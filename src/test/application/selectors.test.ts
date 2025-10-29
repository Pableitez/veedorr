import { describe, it, expect, beforeEach } from 'vitest';
import { Selectors } from '../../application/store/selectors';
import { AppState } from '../../application/store/types';
import { Transaction, CreateTransactionData } from '../../domain/entities/Transaction';
import { Category, CreateCategoryData } from '../../domain/entities/Category';
import { Budget, CreateBudgetData } from '../../domain/entities/Budget';
import { UserSettings } from '../../domain/entities/UserSettings';

describe('Selectors', () => {
  let mockState: AppState;

  beforeEach(() => {
    // Crear categorías de prueba
    const categories = [
      new Category({ nombre: 'Comida', colorHex: '#FF6B6B' }),
      new Category({ nombre: 'Transporte', colorHex: '#4ECDC4' }),
      new Category({ nombre: 'Ingresos', colorHex: '#45B7D1' }),
    ];

    // Crear transacciones de prueba
    const transactions = [
      new Transaction({
        fecha: new Date(2024, 0, 15), // Enero 2024
        descripcion: 'Sueldo',
        categoriaId: categories[2].id.toString(),
        importeEUR: 2500.00,
      }),
      new Transaction({
        fecha: new Date(2024, 0, 16),
        descripcion: 'Compra supermercado',
        categoriaId: categories[0].id.toString(),
        importeEUR: -85.50,
      }),
      new Transaction({
        fecha: new Date(2024, 0, 17),
        descripcion: 'Transporte público',
        categoriaId: categories[1].id.toString(),
        importeEUR: -12.30,
      }),
      new Transaction({
        fecha: new Date(2024, 0, 18),
        descripcion: 'Cena restaurante',
        categoriaId: categories[0].id.toString(),
        importeEUR: -45.80,
      }),
    ];

    // Crear presupuestos de prueba
    const budgets = [
      new Budget({
        categoriaId: categories[0].id.toString(),
        limiteMensualEUR: 200.00,
      }),
      new Budget({
        categoriaId: categories[1].id.toString(),
        limiteMensualEUR: 50.00,
      }),
    ];

    mockState = {
      transactions,
      categories,
      budgets,
      settings: UserSettings.getDefault(),
      ui: {
        loading: false,
        error: null,
        currentPage: 1,
        pageSize: 50,
        filters: {
          search: '',
          categoryId: null,
          type: 'all',
          dateFrom: null,
          dateTo: null,
        }
      }
    };
  });

  describe('getMonthlyTotals', () => {
    it('should calculate monthly totals correctly', () => {
      const totals = Selectors.getMonthlyTotals(mockState, 2024, 1);
      
      expect(totals.income).toBe(2500.00);
      expect(totals.expenses).toBe(143.60); // 85.50 + 12.30 + 45.80
      expect(totals.savings).toBe(2356.40);
    });

    it('should return zero totals for month with no transactions', () => {
      const totals = Selectors.getMonthlyTotals(mockState, 2024, 2);
      
      expect(totals.income).toBe(0);
      expect(totals.expenses).toBe(0);
      expect(totals.savings).toBe(0);
    });
  });

  describe('getTopSpendingCategories', () => {
    it('should return top spending categories', () => {
      const topCategories = Selectors.getTopSpendingCategories(mockState, 2024, 1, 2);
      
      expect(topCategories).toHaveLength(2);
      expect(topCategories[0].categoryName).toBe('Comida');
      expect(topCategories[0].amount).toBe(131.30); // 85.50 + 45.80
      expect(topCategories[1].categoryName).toBe('Transporte');
      expect(topCategories[1].amount).toBe(12.30);
    });

    it('should limit results correctly', () => {
      const topCategories = Selectors.getTopSpendingCategories(mockState, 2024, 1, 1);
      
      expect(topCategories).toHaveLength(1);
      expect(topCategories[0].categoryName).toBe('Comida');
    });

    it('should calculate percentages correctly', () => {
      const topCategories = Selectors.getTopSpendingCategories(mockState, 2024, 1);
      
      const totalExpenses = 143.60;
      const expectedComidaPercentage = (131.30 / totalExpenses) * 100;
      const expectedTransportePercentage = (12.30 / totalExpenses) * 100;
      
      expect(topCategories[0].percentage).toBeCloseTo(expectedComidaPercentage, 2);
      expect(topCategories[1].percentage).toBeCloseTo(expectedTransportePercentage, 2);
    });
  });

  describe('getBudgetProgress', () => {
    it('should calculate budget progress correctly', () => {
      const progress = Selectors.getBudgetProgress(mockState, 2024, 1);
      
      expect(progress).toHaveLength(2);
      
      // Presupuesto de comida
      const comidaProgress = progress.find(p => p.categoryName === 'Comida');
      expect(comidaProgress).toBeDefined();
      expect(comidaProgress!.limit).toBe(200.00);
      expect(comidaProgress!.spent).toBe(131.30);
      expect(comidaProgress!.remaining).toBeCloseTo(68.70, 1);
      expect(comidaProgress!.percentage).toBeCloseTo(65.65, 2);
      expect(comidaProgress!.status).toBe('ok');
      
      // Presupuesto de transporte
      const transporteProgress = progress.find(p => p.categoryName === 'Transporte');
      expect(transporteProgress).toBeDefined();
      expect(transporteProgress!.limit).toBe(50.00);
      expect(transporteProgress!.spent).toBe(12.30);
      expect(transporteProgress!.remaining).toBe(37.70);
      expect(transporteProgress!.percentage).toBeCloseTo(24.6, 2);
      expect(transporteProgress!.status).toBe('ok');
    });

    it('should set correct status based on percentage', () => {
      // Crear estado con presupuesto excedido
      const exceededBudget = new Budget({
        categoriaId: mockState.categories[0].id.toString(),
        limiteMensualEUR: 100.00, // Límite menor que el gastado
      });
      
      const stateWithExceededBudget = {
        ...mockState,
        budgets: [exceededBudget]
      };
      
      const progress = Selectors.getBudgetProgress(stateWithExceededBudget, 2024, 1);
      const comidaProgress = progress.find(p => p.categoryName === 'Comida');
      
      expect(comidaProgress!.status).toBe('danger');
    });
  });

  describe('getMonthlyBalance', () => {
    it('should return correct monthly balance', () => {
      const balance = Selectors.getMonthlyBalance(mockState, 2024, 1);
      expect(balance).toBe(2356.40);
    });
  });

  describe('getMonthlyIncome', () => {
    it('should return correct monthly income', () => {
      const income = Selectors.getMonthlyIncome(mockState, 2024, 1);
      expect(income).toBe(2500.00);
    });
  });

  describe('getMonthlyExpenses', () => {
    it('should return correct monthly expenses', () => {
      const expenses = Selectors.getMonthlyExpenses(mockState, 2024, 1);
      expect(expenses).toBe(143.60);
    });
  });

  describe('getTransactionsByCategory', () => {
    it('should return transactions for specific category', () => {
      const comidaId = mockState.categories[0].id.toString();
      const transactions = Selectors.getTransactionsByCategory(mockState, comidaId);
      
      expect(transactions).toHaveLength(2);
      expect(transactions.every(t => t.categoriaId === comidaId)).toBe(true);
    });

    it('should filter by month when provided', () => {
      const comidaId = mockState.categories[0].id.toString();
      const transactions = Selectors.getTransactionsByCategory(mockState, comidaId, 2024, 1);
      
      expect(transactions).toHaveLength(2);
    });

    it('should return empty array for different month', () => {
      const comidaId = mockState.categories[0].id.toString();
      const transactions = Selectors.getTransactionsByCategory(mockState, comidaId, 2024, 2);
      
      expect(transactions).toHaveLength(0);
    });
  });

  describe('getTotalSpentByCategory', () => {
    it('should calculate total spent by category', () => {
      const comidaId = mockState.categories[0].id.toString();
      const total = Selectors.getTotalSpentByCategory(mockState, comidaId, 2024, 1);
      
      expect(total).toBe(131.30);
    });
  });

  describe('getBudgetByCategory', () => {
    it('should return budget for category', () => {
      const comidaId = mockState.categories[0].id.toString();
      const budget = Selectors.getBudgetByCategory(mockState, comidaId);
      
      expect(budget).toBeDefined();
      expect(budget!.categoriaId).toBe(comidaId);
    });

    it('should return null for category without budget', () => {
      const ingresosId = mockState.categories[2].id.toString();
      const budget = Selectors.getBudgetByCategory(mockState, ingresosId);
      
      expect(budget).toBeNull();
    });
  });

  describe('getBudgetStatus', () => {
    it('should return correct status', () => {
      const comidaId = mockState.categories[0].id.toString();
      const status = Selectors.getBudgetStatus(mockState, comidaId, 2024, 1);
      
      expect(status).toBe('ok');
    });
  });

  describe('getAvailableCategories', () => {
    it('should return categories sorted by name', () => {
      const categories = Selectors.getAvailableCategories(mockState);
      
      expect(categories).toHaveLength(3);
      expect(categories[0].nombre).toBe('Comida');
      expect(categories[1].nombre).toBe('Ingresos');
      expect(categories[2].nombre).toBe('Transporte');
    });
  });

  describe('getCategoriesWithBudget', () => {
    it('should return only categories with budget', () => {
      const categories = Selectors.getCategoriesWithBudget(mockState);
      
      expect(categories).toHaveLength(2);
      expect(categories.map(c => c.nombre)).toContain('Comida');
      expect(categories.map(c => c.nombre)).toContain('Transporte');
    });
  });

  describe('getCategoriesWithoutBudget', () => {
    it('should return only categories without budget', () => {
      const categories = Selectors.getCategoriesWithoutBudget(mockState);
      
      expect(categories).toHaveLength(1);
      expect(categories[0].nombre).toBe('Ingresos');
    });
  });
});
