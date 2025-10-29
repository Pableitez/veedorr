import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository';
import { Budget } from '../../shared/types';
import { STORAGE_KEYS } from '../../shared/constants';

export class LocalStorageBudgetRepository implements IBudgetRepository {
  private storageKey = STORAGE_KEYS.BUDGETS;

  private getBudgets(): Budget[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      return parsed.map((b: any) => ({
        ...b,
        startDate: new Date(b.startDate),
        endDate: new Date(b.endDate),
        createdAt: new Date(b.createdAt),
        updatedAt: new Date(b.updatedAt),
      }));
    } catch (error) {
      console.error('Error al cargar presupuestos desde LocalStorage:', error);
      return [];
    }
  }

  private saveBudgets(budgets: Budget[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(budgets));
    } catch (error) {
      console.error('Error al guardar presupuestos en LocalStorage:', error);
      throw new Error('No se pudo guardar los presupuestos');
    }
  }

  async findAll(): Promise<Budget[]> {
    return this.getBudgets();
  }

  async findById(id: string): Promise<Budget | null> {
    const budgets = this.getBudgets();
    return budgets.find(b => b.id === id) || null;
  }

  async create(entity: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<Budget> {
    const budgets = this.getBudgets();
    const newBudget: Budget = {
      ...entity,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    budgets.push(newBudget);
    this.saveBudgets(budgets);
    
    return newBudget;
  }

  async update(id: string, entity: Partial<Budget>): Promise<Budget> {
    const budgets = this.getBudgets();
    const index = budgets.findIndex(b => b.id === id);
    
    if (index === -1) {
      throw new Error(`Presupuesto con id ${id} no encontrado`);
    }

    const updatedBudget = {
      ...budgets[index],
      ...entity,
      updatedAt: new Date(),
    };

    budgets[index] = updatedBudget;
    this.saveBudgets(budgets);
    
    return updatedBudget;
  }

  async delete(id: string): Promise<void> {
    const budgets = this.getBudgets();
    const filtered = budgets.filter(b => b.id !== id);
    
    if (filtered.length === budgets.length) {
      throw new Error(`Presupuesto con id ${id} no encontrado`);
    }

    this.saveBudgets(filtered);
  }

  async findByCategory(category: string): Promise<Budget[]> {
    const budgets = this.getBudgets();
    return budgets.filter(b => b.category === category);
  }

  async findActive(): Promise<Budget[]> {
    const budgets = this.getBudgets();
    const now = new Date();
    return budgets.filter(b => b.startDate <= now && b.endDate >= now);
  }

  async findByPeriod(period: 'monthly' | 'yearly'): Promise<Budget[]> {
    const budgets = this.getBudgets();
    return budgets.filter(b => b.period === period);
  }

  async getTotalBudgeted(): Promise<number> {
    const budgets = this.getBudgets();
    return budgets.reduce((total, b) => total + b.amount, 0);
  }

  async getTotalSpent(): Promise<number> {
    const budgets = this.getBudgets();
    return budgets.reduce((total, b) => total + b.spent, 0);
  }
}
