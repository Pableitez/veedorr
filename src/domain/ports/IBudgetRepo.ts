import { Budget, CreateBudgetData, UpdateBudgetData } from '../entities/Budget';
import { Id } from '../value-objects/Id';

export interface IBudgetRepo {
  find(id: Id): Promise<Budget | null>;
  findByCategory(categoriaId: string): Promise<Budget[]>;
  findAll(): Promise<Budget[]>;
  add(budget: Budget): Promise<void>;
  update(id: Id, data: UpdateBudgetData): Promise<Budget>;
  remove(id: Id): Promise<void>;
  exists(id: Id): Promise<boolean>;
  existsByCategory(categoriaId: string): Promise<boolean>;
}
