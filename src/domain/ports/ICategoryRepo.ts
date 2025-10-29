import { Category, CreateCategoryData, UpdateCategoryData } from '../entities/Category';
import { Id } from '../value-objects/Id';

export interface ICategoryRepo {
  find(id: Id): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  add(category: Category): Promise<void>;
  update(id: Id, data: UpdateCategoryData): Promise<Category>;
  remove(id: Id): Promise<void>;
  exists(id: Id): Promise<boolean>;
  existsBySlug(slug: string): Promise<boolean>;
}
