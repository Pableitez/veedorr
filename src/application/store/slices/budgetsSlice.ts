import { Budget, CreateBudgetData, UpdateBudgetData } from '../../domain/entities';
import { AppState, BudgetProgress } from '../types';
import { MoneyEUR } from '../../domain/value-objects/MoneyEUR';

export class BudgetsSlice {
  private state: AppState;
  private eventBus: any;

  constructor(state: AppState, eventBus: any) {
    this.state = state;
    this.eventBus = eventBus;
  }

  // Acciones
  addBudget(data: CreateBudgetData): Budget {
    const budget = new Budget(data);
    this.state.budgets.push(budget);
    this.emitChange();
    return budget;
  }

  updateBudget(id: string, data: UpdateBudgetData): Budget {
    const index = this.state.budgets.findIndex(b => b.id.toString() === id);
    if (index === -1) {
      throw new Error(`Presupuesto con id ${id} no encontrado`);
    }

    const updatedBudget = this.state.budgets[index].update(data);
    this.state.budgets[index] = updatedBudget;
    this.emitChange();
    return updatedBudget;
  }

  removeBudget(id: string): void {
    const index = this.state.budgets.findIndex(b => b.id.toString() === id);
    if (index === -1) {
      throw new Error(`Presupuesto con id ${id} no encontrado`);
    }

    this.state.budgets.splice(index, 1);
    this.emitChange();
  }

  calculateSpentForMonth(year: number, month: number): void {
    // Esta función actualiza los cálculos de gastado para cada presupuesto
    // En un sistema real, esto podría actualizar un campo calculado
    this.emitChange();
  }

  // Getters
  getBudgets(): Budget[] {
    return this.state.budgets;
  }

  getBudgetById(id: string): Budget | null {
    return this.state.budgets.find(b => b.id.toString() === id) || null;
  }

  getBudgetsByCategory(categoryId: string): Budget[] {
    return this.state.budgets.filter(b => b.categoriaId === categoryId);
  }

  getBudgetProgress(): BudgetProgress[] {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    return this.state.budgets.map(budget => {
      const category = this.state.categories.find(c => c.id.toString() === budget.categoriaId);
      const categoryName = category?.nombre || 'Sin categoría';
      
      // Calcular gastado del mes actual
      const spent = this.calculateSpentForCategory(budget.categoriaId, currentYear, currentMonth);
      
      const limit = budget.limiteMensualEUR.getValue();
      const remaining = Math.max(0, limit - spent);
      const percentage = limit > 0 ? (spent / limit) * 100 : 0;
      
      let status: 'ok' | 'warn' | 'danger' = 'ok';
      if (percentage >= 100) {
        status = 'danger';
      } else if (percentage >= 80) {
        status = 'warn';
      }

      return {
        budgetId: budget.id.toString(),
        categoryName,
        limit,
        spent,
        remaining,
        percentage: Math.round(percentage * 100) / 100,
        status
      };
    });
  }

  getTotalBudgeted(): number {
    return this.state.budgets.reduce((total, budget) => 
      total + budget.limiteMensualEUR.getValue(), 0
    );
  }

  getTotalSpentForMonth(year: number, month: number): number {
    return this.state.budgets.reduce((total, budget) => {
      const spent = this.calculateSpentForCategory(budget.categoriaId, year, month);
      return total + spent;
    }, 0);
  }

  // Métodos privados
  private calculateSpentForCategory(categoryId: string, year: number, month: number): number {
    const transactions = this.state.transactions.filter(t => 
      t.categoriaId === categoryId && 
      t.isInMonth(year, month) &&
      t.importeEUR.getValue() < 0 // Solo gastos
    );

    return transactions.reduce((total, t) => 
      total + Math.abs(t.importeEUR.getValue()), 0
    );
  }

  private emitChange(): void {
    this.eventBus.emit('budgets/changed', {
      budgets: this.state.budgets,
      progress: this.getBudgetProgress()
    });
  }
}
