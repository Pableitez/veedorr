import { AppStore } from './AppStore';
import { AppState, MonthlyTotals, CategorySpending, BudgetProgress } from './types';

// Hook principal para acceder al estado
export function useAppState(store: AppStore): AppState {
  return store.getState();
}

// Hook para dispatch
export function useDispatch(store: AppStore) {
  return store.dispatch.bind(store);
}

// Hook para suscribirse a cambios
export function useStoreSubscription(store: AppStore, event: string, handler: (payload: any) => void) {
  return store.subscribe(event, handler);
}

// Hooks específicos para slices
export function useTransactions(store: AppStore) {
  return store.getTransactionsSlice();
}

export function useBudgets(store: AppStore) {
  return store.getBudgetsSlice();
}

export function useSettings(store: AppStore) {
  return store.getSettingsSlice();
}

// Hooks para selectores
export function useMonthlyTotals(store: AppStore, year: number, month: number): MonthlyTotals {
  const state = store.getState();
  return store.getSelectors().getMonthlyTotals(state, year, month);
}

export function useTopSpendingCategories(store: AppStore, year: number, month: number, limit?: number): CategorySpending[] {
  const state = store.getState();
  return store.getSelectors().getTopSpendingCategories(state, year, month, limit);
}

export function useBudgetProgress(store: AppStore, year: number, month: number): BudgetProgress[] {
  const state = store.getState();
  return store.getSelectors().getBudgetProgress(state, year, month);
}

export function useMonthlyBalance(store: AppStore, year: number, month: number): number {
  const state = store.getState();
  return store.getSelectors().getMonthlyBalance(state, year, month);
}

export function useMonthlyIncome(store: AppStore, year: number, month: number): number {
  const state = store.getState();
  return store.getSelectors().getMonthlyIncome(state, year, month);
}

export function useMonthlyExpenses(store: AppStore, year: number, month: number): number {
  const state = store.getState();
  return store.getSelectors().getMonthlyExpenses(state, year, month);
}

export function useTransactionsByCategory(store: AppStore, categoryId: string, year?: number, month?: number) {
  const state = store.getState();
  return store.getSelectors().getTransactionsByCategory(state, categoryId, year, month);
}

export function useTotalSpentByCategory(store: AppStore, categoryId: string, year?: number, month?: number): number {
  const state = store.getState();
  return store.getSelectors().getTotalSpentByCategory(state, categoryId, year, month);
}

export function useBudgetByCategory(store: AppStore, categoryId: string) {
  const state = store.getState();
  return store.getSelectors().getBudgetByCategory(state, categoryId);
}

export function useBudgetStatus(store: AppStore, categoryId: string, year: number, month: number): 'ok' | 'warn' | 'danger' {
  const state = store.getState();
  return store.getSelectors().getBudgetStatus(state, categoryId, year, month);
}

export function useAvailableCategories(store: AppStore) {
  const state = store.getState();
  return store.getSelectors().getAvailableCategories(state);
}

export function useCategoriesWithBudget(store: AppStore) {
  const state = store.getState();
  return store.getSelectors().getCategoriesWithBudget(state);
}

export function useCategoriesWithoutBudget(store: AppStore) {
  const state = store.getState();
  return store.getSelectors().getCategoriesWithoutBudget(state);
}

// Hook para UI state
export function useUIState(store: AppStore) {
  const state = store.getState();
  return state.ui;
}

// Hook para loading state
export function useLoading(store: AppStore): boolean {
  const state = store.getState();
  return state.ui.loading;
}

// Hook para error state
export function useError(store: AppStore): string | null {
  const state = store.getState();
  return state.ui.error;
}
