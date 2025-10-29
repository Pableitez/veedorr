import { Transaction, Category, Budget } from '../../domain/entities';
import { AppState, MonthlyTotals, CategorySpending, BudgetProgress } from './types';
import { MoneyEUR } from '../../domain/value-objects/MoneyEUR';

export class Selectors {
  // Selectores de totales mensuales
  static getMonthlyTotals(state: AppState, year: number, month: number): MonthlyTotals {
    const transactions = state.transactions.filter(t => t.isInMonth(year, month));
    
    let income = 0;
    let expenses = 0;

    for (const transaction of transactions) {
      const amount = transaction.importeEUR.getValue();
      if (amount > 0) {
        income += amount;
      } else {
        expenses += Math.abs(amount);
      }
    }

    return {
      income,
      expenses,
      savings: income - expenses
    };
  }

  // Selector de categorías con más gasto
  static getTopSpendingCategories(state: AppState, year: number, month: number, limit: number = 5): CategorySpending[] {
    const transactions = state.transactions.filter(t => 
      t.isInMonth(year, month) && 
      t.importeEUR.getValue() < 0 && // Solo gastos
      t.categoriaId
    );

    // Agrupar por categoría
    const categoryTotals = new Map<string, number>();
    
    for (const transaction of transactions) {
      const categoryId = transaction.categoriaId!;
      const amount = Math.abs(transaction.importeEUR.getValue());
      
      const current = categoryTotals.get(categoryId) || 0;
      categoryTotals.set(categoryId, current + amount);
    }

    // Calcular total de gastos para porcentajes
    const totalExpenses = Array.from(categoryTotals.values()).reduce((sum, amount) => sum + amount, 0);

    // Convertir a array y ordenar
    const categorySpending: CategorySpending[] = Array.from(categoryTotals.entries())
      .map(([categoryId, amount]) => {
        const category = state.categories.find(c => c.id.toString() === categoryId);
        const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
        
        return {
          categoryId,
          categoryName: category?.nombre || 'Sin categoría',
          amount,
          percentage: Math.round(percentage * 100) / 100
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit);

    return categorySpending;
  }

  // Selector de progreso de presupuestos
  static getBudgetProgress(state: AppState, year: number, month: number): BudgetProgress[] {
    return state.budgets.map(budget => {
      const category = state.categories.find(c => c.id.toString() === budget.categoriaId);
      const categoryName = category?.nombre || 'Sin categoría';
      
      // Calcular gastado del mes
      const spent = this.calculateSpentForCategory(state.transactions, budget.categoriaId, year, month);
      
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

  // Selector de balance mensual
  static getMonthlyBalance(state: AppState, year: number, month: number): number {
    const totals = this.getMonthlyTotals(state, year, month);
    return totals.savings;
  }

  // Selector de ingresos mensuales
  static getMonthlyIncome(state: AppState, year: number, month: number): number {
    const totals = this.getMonthlyTotals(state, year, month);
    return totals.income;
  }

  // Selector de gastos mensuales
  static getMonthlyExpenses(state: AppState, year: number, month: number): number {
    const totals = this.getMonthlyTotals(state, year, month);
    return totals.expenses;
  }

  // Selector de transacciones por categoría
  static getTransactionsByCategory(state: AppState, categoryId: string, year?: number, month?: number): Transaction[] {
    let transactions = state.transactions.filter(t => t.categoriaId === categoryId);
    
    if (year && month) {
      transactions = transactions.filter(t => t.isInMonth(year, month));
    }
    
    return transactions;
  }

  // Selector de total gastado por categoría
  static getTotalSpentByCategory(state: AppState, categoryId: string, year?: number, month?: number): number {
    const transactions = this.getTransactionsByCategory(state, categoryId, year, month);
    
    return transactions
      .filter(t => t.importeEUR.getValue() < 0) // Solo gastos
      .reduce((total, t) => total + Math.abs(t.importeEUR.getValue()), 0);
  }

  // Selector de presupuesto por categoría
  static getBudgetByCategory(state: AppState, categoryId: string): Budget | null {
    return state.budgets.find(b => b.categoriaId === categoryId) || null;
  }

  // Selector de estado de presupuesto (ok/warn/danger)
  static getBudgetStatus(state: AppState, categoryId: string, year: number, month: number): 'ok' | 'warn' | 'danger' {
    const budget = this.getBudgetByCategory(state, categoryId);
    if (!budget) return 'ok';

    const spent = this.getTotalSpentByCategory(state, categoryId, year, month);
    const limit = budget.limiteMensualEUR.getValue();
    const percentage = limit > 0 ? (spent / limit) * 100 : 0;

    if (percentage >= 100) return 'danger';
    if (percentage >= 80) return 'warn';
    return 'ok';
  }

  // Selector de categorías disponibles
  static getAvailableCategories(state: AppState): Category[] {
    return state.categories.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  // Selector de categorías con presupuesto
  static getCategoriesWithBudget(state: AppState): Category[] {
    const budgetCategoryIds = new Set(state.budgets.map(b => b.categoriaId));
    return state.categories.filter(c => budgetCategoryIds.has(c.id.toString()));
  }

  // Selector de categorías sin presupuesto
  static getCategoriesWithoutBudget(state: AppState): Category[] {
    const budgetCategoryIds = new Set(state.budgets.map(b => b.categoriaId));
    return state.categories.filter(c => !budgetCategoryIds.has(c.id.toString()));
  }

  // Métodos auxiliares privados
  private static calculateSpentForCategory(transactions: Transaction[], categoryId: string, year: number, month: number): number {
    return transactions
      .filter(t => 
        t.categoriaId === categoryId && 
        t.isInMonth(year, month) &&
        t.importeEUR.getValue() < 0
      )
      .reduce((total, t) => total + Math.abs(t.importeEUR.getValue()), 0);
  }
}
