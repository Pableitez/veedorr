import { EventBus } from './EventBus';
import { TransactionsSlice } from './slices/transactionsSlice';
import { BudgetsSlice } from './slices/budgetsSlice';
import { SettingsSlice } from './slices/settingsSlice';
import { AppState, AppAction, UIState, TransactionFilters } from './types';
import { UserSettings } from '../../domain/entities';
import { Selectors } from './selectors';

export class AppStore {
  private state: AppState;
  private eventBus: EventBus;
  private transactionsSlice: TransactionsSlice;
  private budgetsSlice: BudgetsSlice;
  private settingsSlice: SettingsSlice;

  constructor(initialState?: Partial<AppState>) {
    this.eventBus = new EventBus();
    
    // Estado inicial
    this.state = {
      transactions: [],
      categories: [],
      budgets: [],
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
      },
      ...initialState
    };

    // Inicializar slices
    this.transactionsSlice = new TransactionsSlice(this.state, this.eventBus);
    this.budgetsSlice = new BudgetsSlice(this.state, this.eventBus);
    this.settingsSlice = new SettingsSlice(this.state, this.eventBus);
  }

  // Getters del estado
  getState(): AppState {
    return { ...this.state };
  }

  getTransactionsSlice(): TransactionsSlice {
    return this.transactionsSlice;
  }

  getBudgetsSlice(): BudgetsSlice {
    return this.budgetsSlice;
  }

  getSettingsSlice(): SettingsSlice {
    return this.settingsSlice;
  }

  // Event bus
  getEventBus(): EventBus {
    return this.eventBus;
  }

  // Selectores
  getSelectors() {
    return Selectors;
  }

  // Dispatch de acciones (estilo Redux)
  dispatch(action: AppAction): void {
    switch (action.type) {
      // Transacciones
      case 'transactions/add':
        this.transactionsSlice.addTransaction(action.payload);
        break;
      case 'transactions/update':
        this.transactionsSlice.updateTransaction(action.payload.id, action.payload.data);
        break;
      case 'transactions/remove':
        this.transactionsSlice.removeTransaction(action.payload.id);
        break;
      case 'transactions/import':
        this.transactionsSlice.importTransactions(action.payload.transactions);
        break;
      case 'transactions/setFilters':
        this.transactionsSlice.setFilters(action.payload);
        break;
      case 'transactions/setPage':
        this.transactionsSlice.setPage(action.payload.page);
        break;

      // Presupuestos
      case 'budgets/add':
        this.budgetsSlice.addBudget(action.payload);
        break;
      case 'budgets/update':
        this.budgetsSlice.updateBudget(action.payload.id, action.payload.data);
        break;
      case 'budgets/remove':
        this.budgetsSlice.removeBudget(action.payload.id);
        break;
      case 'budgets/calculateSpent':
        this.budgetsSlice.calculateSpentForMonth(action.payload.year, action.payload.month);
        break;

      // Configuración
      case 'settings/update':
        this.settingsSlice.updateSettings(action.payload);
        break;

      // UI
      case 'ui/setLoading':
        this.state.ui.loading = action.payload;
        this.eventBus.emit('ui/loadingChanged', action.payload);
        break;
      case 'ui/setError':
        this.state.ui.error = action.payload;
        this.eventBus.emit('ui/errorChanged', action.payload);
        break;
      case 'ui/clearError':
        this.state.ui.error = null;
        this.eventBus.emit('ui/errorCleared');
        break;

      default:
        console.warn(`Acción desconocida: ${action.type}`);
    }
  }

  // Métodos de conveniencia
  subscribe(event: string, handler: (payload: any) => void): () => void {
    return this.eventBus.on(event, handler);
  }

  // Métodos para inicialización
  setTransactions(transactions: any[]): void {
    this.state.transactions = transactions;
    this.eventBus.emit('transactions/initialized', transactions);
  }

  setCategories(categories: any[]): void {
    this.state.categories = categories;
    this.eventBus.emit('categories/initialized', categories);
  }

  setBudgets(budgets: any[]): void {
    this.state.budgets = budgets;
    this.eventBus.emit('budgets/initialized', budgets);
  }

  setSettings(settings: UserSettings): void {
    this.state.settings = settings;
    this.eventBus.emit('settings/initialized', settings);
  }

  // Métodos de utilidad
  reset(): void {
    this.state = {
      transactions: [],
      categories: [],
      budgets: [],
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
    
    this.eventBus.emit('store/reset');
  }

  destroy(): void {
    this.eventBus.clear();
  }
}
