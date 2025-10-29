import { ICategoryRepo } from '../../domain/ports/ICategoryRepo';
import { Category, CreateCategoryData, UpdateCategoryData } from '../../domain/entities/Category';
import { Id } from '../../domain/value-objects/Id';

export class LocalStorageCategoryRepo implements ICategoryRepo {
  private readonly storageKey = 'vedor.categories';

  private getCategories(): Category[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      return parsed.map((c: any) => Category.fromJSON(c));
    } catch (error) {
      console.error('Error al cargar categorías desde LocalStorage:', error);
      return [];
    }
  }

  private saveCategories(categories: Category[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(categories.map(c => c.toJSON())));
    } catch (error) {
      console.error('Error al guardar categorías en LocalStorage:', error);
      throw new Error('No se pudo guardar las categorías');
    }
  }

  async find(id: Id): Promise<Category | null> {
    const categories = this.getCategories();
    return categories.find(c => c.id.equals(id)) || null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const categories = this.getCategories();
    return categories.find(c => c.slug === slug) || null;
  }

  async findAll(): Promise<Category[]> {
    return this.getCategories();
  }

  async add(category: Category): Promise<void> {
    const categories = this.getCategories();
    
    // Verificar que no existe una categoría con el mismo slug
    const existingBySlug = categories.find(c => c.slug === category.slug);
    if (existingBySlug) {
      throw new Error(`Ya existe una categoría con el slug: ${category.slug}`);
    }
    
    categories.push(category);
    this.saveCategories(categories);
  }

  async update(id: Id, data: UpdateCategoryData): Promise<Category> {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id.equals(id));
    
    if (index === -1) {
      throw new Error(`Categoría con id ${id.toString()} no encontrada`);
    }

    const updatedCategory = categories[index].update(data);
    
    // Verificar que no existe otra categoría con el mismo slug
    if (data.slug) {
      const existingBySlug = categories.find(c => c.slug === data.slug && !c.id.equals(id));
      if (existingBySlug) {
        throw new Error(`Ya existe una categoría con el slug: ${data.slug}`);
      }
    }
    
    categories[index] = updatedCategory;
    this.saveCategories(categories);
    
    return updatedCategory;
  }

  async remove(id: Id): Promise<void> {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id.equals(id));
    
    if (index === -1) {
      throw new Error(`Categoría con id ${id.toString()} no encontrada`);
    }

    categories.splice(index, 1);
    this.saveCategories(categories);
  }

  async exists(id: Id): Promise<boolean> {
    const category = await this.find(id);
    return category !== null;
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const category = await this.findBySlug(slug);
    return category !== null;
  }
}
