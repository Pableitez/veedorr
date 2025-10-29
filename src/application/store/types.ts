import { Transaction, Category, Budget, UserSettings } from '../../domain/entities';

// Tipos base del store
export interface AppState {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  settings: UserSettings;
  ui: UIState;
}

export interface UIState {
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  filters: TransactionFilters;
}

export interface TransactionFilters {
  search: string;
  categoryId: string | null;
  type: 'all' | 'income' | 'expense';
  dateFrom: Date | null;
  dateTo: Date | null;
}

// Tipos de acciones
export interface Action<T = any> {
  type: string;
  payload?: T;
}

export interface TransactionAction extends Action {
  type: 'transactions/add' | 'transactions/update' | 'transactions/remove' | 'transactions/import' | 'transactions/setFilters' | 'transactions/setPage';
  payload?: any;
}

export interface BudgetAction extends Action {
  type: 'budgets/add' | 'budgets/update' | 'budgets/remove' | 'budgets/calculateSpent';
  payload?: any;
}

export interface SettingsAction extends Action {
  type: 'settings/update';
  payload?: any;
}

export interface UIAction extends Action {
  type: 'ui/setLoading' | 'ui/setError' | 'ui/clearError';
  payload?: any;
}

export type AppAction = TransactionAction | BudgetAction | SettingsAction | UIAction;

// Tipos para selectors
export interface MonthlyTotals {
  income: number;
  expenses: number;
  savings: number;
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
}

export interface BudgetProgress {
  budgetId: string;
  categoryName: string;
  limit: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'ok' | 'warn' | 'danger';
}

export interface PaginatedTransactions {
  transactions: Transaction[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
