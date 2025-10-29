// Re-exportar tipos del dominio
export type { Transaction, CreateTransactionData, UpdateTransactionData } from '../../domain/entities/Transaction';
export type { Category, CreateCategoryData, UpdateCategoryData } from '../../domain/entities/Category';
export type { Budget, CreateBudgetData, UpdateBudgetData } from '../../domain/entities/Budget';
export type { UserSettings, CreateUserSettingsData, UpdateUserSettingsData, Theme, Locale } from '../../domain/entities/UserSettings';

// Re-exportar value objects
export { Id } from '../../domain/value-objects/Id';
export { MoneyEUR } from '../../domain/value-objects/MoneyEUR';
export { EsDate } from '../../domain/value-objects/EsDate';

// Tipos para el store (usando las nuevas entidades)
export interface StoreState {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  settings: UserSettings;
}

// Tipos para repositorios
export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

// Tipos para el router
export interface Route {
  path: string;
  component: () => HTMLElement;
  title: string;
}

export interface Router {
  navigate(path: string): void;
  getCurrentPath(): string;
  onRouteChange(callback: (path: string) => void): void;
}

// Tipos para el store
export interface Store<T> {
  getState(): T;
  setState(newState: T): void;
  subscribe(callback: (state: T) => void): () => void;
}

// Tipos para utilidades de fecha e importe
export interface DateFormatter {
  format(date: Date): string;
  parse(dateString: string): Date;
}

export interface AmountFormatter {
  format(amount: number): string;
  parse(amountString: string): number;
}
