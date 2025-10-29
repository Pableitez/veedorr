import { Budget, StoreState } from '../../../shared/types';

export interface BudgetsSlice {
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  getBudgetById: (id: string) => Budget | null;
  getBudgetsByCategory: (category: string) => Budget[];
  getActiveBudgets: () => Budget[];
}

export const createBudgetsSlice = (store: { getState: () => StoreState; setState: (state: StoreState) => void }): BudgetsSlice => {
  const addBudget = (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => {
    const state = store.getState();
    const newBudget: Budget = {
      ...budget,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    store.setState({
      ...state,
      budgets: [...state.budgets, newBudget],
    });
  };

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    const state = store.getState();
    const budgetIndex = state.budgets.findIndex(b => b.id === id);
    
    if (budgetIndex === -1) {
      throw new Error(`Presupuesto con id ${id} no encontrado`);
    }

    const updatedBudget = {
      ...state.budgets[budgetIndex],
      ...updates,
      updatedAt: new Date(),
    };

    const newBudgets = [...state.budgets];
    newBudgets[budgetIndex] = updatedBudget;

    store.setState({
      ...state,
      budgets: newBudgets,
    });
  };

  const deleteBudget = (id: string) => {
    const state = store.getState();
    const newBudgets = state.budgets.filter(b => b.id !== id);
    
    store.setState({
      ...state,
      budgets: newBudgets,
    });
  };

  const getBudgetById = (id: string): Budget | null => {
    const state = store.getState();
    return state.budgets.find(b => b.id === id) || null;
  };

  const getBudgetsByCategory = (category: string): Budget[] => {
    const state = store.getState();
    return state.budgets.filter(b => b.category === category);
  };

  const getActiveBudgets = (): Budget[] => {
    const state = store.getState();
    const now = new Date();
    return state.budgets.filter(b => 
      b.startDate <= now && b.endDate >= now
    );
  };

  return {
    budgets: store.getState().budgets,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetById,
    getBudgetsByCategory,
    getActiveBudgets,
  };
};
