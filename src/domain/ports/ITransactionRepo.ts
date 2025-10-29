import { Transaction, CreateTransactionData, UpdateTransactionData } from '../entities/Transaction';
import { Id } from '../value-objects/Id';
import { EsDate } from '../value-objects/EsDate';

export interface ITransactionRepo {
  find(id: Id): Promise<Transaction | null>;
  findByMonth(year: number, month: number): Promise<Transaction[]>;
  findByDateRange(startDate: EsDate, endDate: EsDate): Promise<Transaction[]>;
  findByCategory(categoriaId: string): Promise<Transaction[]>;
  findByAccount(accountId: string): Promise<Transaction[]>;
  add(transaction: Transaction): Promise<void>;
  update(id: Id, data: UpdateTransactionData): Promise<Transaction>;
  remove(id: Id): Promise<void>;
  importMany(transactions: Transaction[], dedupe: boolean): Promise<{ imported: number; duplicates: number }>;
  getTotalByCategory(categoriaId: string, startDate?: EsDate, endDate?: EsDate): Promise<number>;
  getTotalByMonth(year: number, month: number): Promise<{ income: number; expense: number; balance: number }>;
}
