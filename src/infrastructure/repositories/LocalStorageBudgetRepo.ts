import { IBudgetRepo } from '../../domain/ports/IBudgetRepo';
import { Budget, CreateBudgetData, UpdateBudgetData } from '../../domain/entities/Budget';
import { Id } from '../../domain/value-objects/Id';

export class LocalStorageBudgetRepo implements IBudgetRepo {
  private readonly storageKey = 'vedor.budgets';

  private getBudgets(): Budget[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      return parsed.map((b: any) => Budget.fromJSON(b));
    } catch (error) {
      console.error('Error al cargar presupuestos desde LocalStorage:', error);
      return [];
    }
  }

  private saveBudgets(budgets: Budget[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(budgets.map(b => b.toJSON())));
    } catch (error) {
      console.error('Error al guardar presupuestos en LocalStorage:', error);
      throw new Error('No se pudo guardar los presupuestos');
    }
  }

  async find(id: Id): Promise<Budget | null> {
    const budgets = this.getBudgets();
    return budgets.find(b => b.id.equals(id)) || null;
  }

  async findByCategory(categoriaId: string): Promise<Budget[]> {
    const budgets = this.getBudgets();
    return budgets.filter(b => b.categoriaId === categoriaId);
  }

  async findAll(): Promise<Budget[]> {
    return this.getBudgets();
  }

  async add(budget: Budget): Promise<void> {
    const budgets = this.getBudgets();
    
    // Verificar que no existe un presupuesto para la misma categoría
    const existingForCategory = budgets.find(b => b.categoriaId === budget.categoriaId);
    if (existingForCategory) {
      throw new Error(`Ya existe un presupuesto para la categoría: ${budget.categoriaId}`);
    }
    
    budgets.push(budget);
    this.saveBudgets(budgets);
  }

  async update(id: Id, data: UpdateBudgetData): Promise<Budget> {
    const budgets = this.getBudgets();
    const index = budgets.findIndex(b => b.id.equals(id));
    
    if (index === -1) {
      throw new Error(`Presupuesto con id ${id.toString()} no encontrado`);
    }

    const updatedBudget = budgets[index].update(data);
    
    // Verificar que no existe otro presupuesto para la misma categoría
    if (data.categoriaId) {
      const existingForCategory = budgets.find(b => b.categoriaId === data.categoriaId && !b.id.equals(id));
      if (existingForCategory) {
        throw new Error(`Ya existe un presupuesto para la categoría: ${data.categoriaId}`);
      }
    }
    
    budgets[index] = updatedBudget;
    this.saveBudgets(budgets);
    
    return updatedBudget;
  }

  async remove(id: Id): Promise<void> {
    const budgets = this.getBudgets();
    const index = budgets.findIndex(b => b.id.equals(id));
    
    if (index === -1) {
      throw new Error(`Presupuesto con id ${id.toString()} no encontrado`);
    }

    budgets.splice(index, 1);
    this.saveBudgets(budgets);
  }

  async exists(id: Id): Promise<boolean> {
    const budget = await this.find(id);
    return budget !== null;
  }

  async existsByCategory(categoriaId: string): Promise<boolean> {
    const budgets = await this.findByCategory(categoriaId);
    return budgets.length > 0;
  }
}
