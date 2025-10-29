import { IRepository, Transaction } from '../../shared/types';

export interface ITransactionRepository extends IRepository<Transaction> {
  findByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]>;
  findByCategory(category: string): Promise<Transaction[]>;
  findByType(type: 'income' | 'expense'): Promise<Transaction[]>;
  getTotalByType(type: 'income' | 'expense'): Promise<number>;
  getTotalByCategory(category: string): Promise<number>;
}
