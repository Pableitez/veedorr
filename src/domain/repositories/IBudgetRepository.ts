import { IRepository, Budget } from '../../shared/types';

export interface IBudgetRepository extends IRepository<Budget> {
  findByCategory(category: string): Promise<Budget[]>;
  findActive(): Promise<Budget[]>;
  findByPeriod(period: 'monthly' | 'yearly'): Promise<Budget[]>;
  getTotalBudgeted(): Promise<number>;
  getTotalSpent(): Promise<number>;
}
