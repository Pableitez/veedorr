import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { Transaction } from '../../shared/types';
import { STORAGE_KEYS } from '../../shared/constants';

export class LocalStorageTransactionRepository implements ITransactionRepository {
  private storageKey = STORAGE_KEYS.TRANSACTIONS;

  private getTransactions(): Transaction[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      return parsed.map((t: any) => ({
        ...t,
        date: new Date(t.date),
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
      }));
    } catch (error) {
      console.error('Error al cargar transacciones desde LocalStorage:', error);
      return [];
    }
  }

  private saveTransactions(transactions: Transaction[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error al guardar transacciones en LocalStorage:', error);
      throw new Error('No se pudo guardar las transacciones');
    }
  }

  async findAll(): Promise<Transaction[]> {
    return this.getTransactions();
  }

  async findById(id: string): Promise<Transaction | null> {
    const transactions = this.getTransactions();
    return transactions.find(t => t.id === id) || null;
  }

  async create(entity: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    const transactions = this.getTransactions();
    const newTransaction: Transaction = {
      ...entity,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    transactions.push(newTransaction);
    this.saveTransactions(transactions);
    
    return newTransaction;
  }

  async update(id: string, entity: Partial<Transaction>): Promise<Transaction> {
    const transactions = this.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error(`Transacción con id ${id} no encontrada`);
    }

    const updatedTransaction = {
      ...transactions[index],
      ...entity,
      updatedAt: new Date(),
    };

    transactions[index] = updatedTransaction;
    this.saveTransactions(transactions);
    
    return updatedTransaction;
  }

  async delete(id: string): Promise<void> {
    const transactions = this.getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    
    if (filtered.length === transactions.length) {
      throw new Error(`Transacción con id ${id} no encontrada`);
    }

    this.saveTransactions(filtered);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    const transactions = this.getTransactions();
    return transactions.filter(t => t.date >= startDate && t.date <= endDate);
  }

  async findByCategory(category: string): Promise<Transaction[]> {
    const transactions = this.getTransactions();
    return transactions.filter(t => t.category === category);
  }

  async findByType(type: 'income' | 'expense'): Promise<Transaction[]> {
    const transactions = this.getTransactions();
    return transactions.filter(t => t.type === type);
  }

  async getTotalByType(type: 'income' | 'expense'): Promise<number> {
    const transactions = this.getTransactions();
    return transactions
      .filter(t => t.type === type)
      .reduce((total, t) => total + t.amount, 0);
  }

  async getTotalByCategory(category: string): Promise<number> {
    const transactions = this.getTransactions();
    return transactions
      .filter(t => t.category === category)
      .reduce((total, t) => total + t.amount, 0);
  }
}
