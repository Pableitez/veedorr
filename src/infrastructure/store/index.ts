import { SimpleStore } from './store';
import { createTransactionsSlice } from './slices/transactionsSlice';
import { createBudgetsSlice } from './slices/budgetsSlice';
import { createSettingsSlice } from './slices/settingsSlice';
import { StoreState } from '../../shared/types';
import { DEFAULT_SETTINGS } from '../../shared/constants';

// Estado inicial de la aplicación
const initialState: StoreState = {
  transactions: [],
  budgets: [],
  settings: DEFAULT_SETTINGS,
};

// Crear instancia del store
export const store = new SimpleStore(initialState);

// Crear slices
export const transactionsSlice = createTransactionsSlice(store);
export const budgetsSlice = createBudgetsSlice(store);
export const settingsSlice = createSettingsSlice(store);

// Exportar store y slices
export { store as default };