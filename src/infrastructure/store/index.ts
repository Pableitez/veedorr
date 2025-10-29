import { SimpleStore } from './store';
import { createTransactionsSlice } from './slices/transactionsSlice';
import { createBudgetsSlice } from './slices/budgetsSlice';
import { createSettingsSlice } from './slices/settingsSlice';
import { StoreState, DEFAULT_SETTINGS } from '../../shared/types';
import { DEFAULT_SETTINGS as DEFAULT_SETTINGS_CONST } from '../../shared/constants';

// Estado inicial de la aplicación
const initialState: StoreState = {
  transactions: [],
  budgets: [],
  settings: DEFAULT_SETTINGS_CONST,
};

// Crear instancia del store
export const store = new SimpleStore(initialState);

// Crear slices
export const transactionsSlice = createTransactionsSlice(store);
export const budgetsSlice = createBudgetsSlice(store);
export const settingsSlice = createSettingsSlice(store);

// Exportar store y slices
export { store as default };
