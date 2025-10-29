import { Transaction, StoreState } from '../../../shared/types';

export interface TransactionsSlice {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionById: (id: string) => Transaction | null;
  getTransactionsByDateRange: (startDate: Date, endDate: Date) => Transaction[];
  getTransactionsByCategory: (category: string) => Transaction[];
}

export const createTransactionsSlice = (store: { getState: () => StoreState; setState: (state: StoreState) => void }): TransactionsSlice => {
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const state = store.getState();
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    store.setState({
      ...state,
      transactions: [...state.transactions, newTransaction],
    });
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    const state = store.getState();
    const transactionIndex = state.transactions.findIndex(t => t.id === id);
    
    if (transactionIndex === -1) {
      throw new Error(`Transacción con id ${id} no encontrada`);
    }

    const updatedTransaction = {
      ...state.transactions[transactionIndex],
      ...updates,
      updatedAt: new Date(),
    };

    const newTransactions = [...state.transactions];
    newTransactions[transactionIndex] = updatedTransaction;

    store.setState({
      ...state,
      transactions: newTransactions,
    });
  };

  const deleteTransaction = (id: string) => {
    const state = store.getState();
    const newTransactions = state.transactions.filter(t => t.id !== id);
    
    store.setState({
      ...state,
      transactions: newTransactions,
    });
  };

  const getTransactionById = (id: string): Transaction | null => {
    const state = store.getState();
    return state.transactions.find(t => t.id === id) || null;
  };

  const getTransactionsByDateRange = (startDate: Date, endDate: Date): Transaction[] => {
    const state = store.getState();
    return state.transactions.filter(t => 
      t.date >= startDate && t.date <= endDate
    );
  };

  const getTransactionsByCategory = (category: string): Transaction[] => {
    const state = store.getState();
    return state.transactions.filter(t => t.category === category);
  };

  return {
    transactions: store.getState().transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
    getTransactionsByDateRange,
    getTransactionsByCategory,
  };
};
