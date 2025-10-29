import { Id } from '../value-objects/Id';

export interface CreateCategoryData {
  nombre: string;
  colorHex: string;
  slug?: string;
}

export interface UpdateCategoryData {
  nombre?: string;
  colorHex?: string;
  slug?: string;
}

export class Category {
  public readonly id: Id;
  public readonly nombre: string;
  public readonly colorHex: string;
  public readonly slug: string;

  constructor(data: CreateCategoryData, id?: Id) {
    this.id = id || new Id();
    this.nombre = this.validateNombre(data.nombre);
    this.colorHex = this.validateColorHex(data.colorHex);
    this.slug = data.slug || this.generateSlug(data.nombre);
  }

  private validateNombre(nombre: string): string {
    if (!nombre || typeof nombre !== 'string') {
      throw new Error('El nombre es obligatorio');
    }
    
    const trimmed = nombre.trim();
    if (trimmed.length === 0) {
      throw new Error('El nombre no puede estar vacío');
    }
    
    if (trimmed.length > 50) {
      throw new Error('El nombre no puede exceder 50 caracteres');
    }
    
    return trimmed;
  }

  private validateColorHex(colorHex: string): string {
    if (!colorHex || typeof colorHex !== 'string') {
      throw new Error('El color es obligatorio');
    }
    
    const trimmed = colorHex.trim().toUpperCase();
    
    // Validar formato hex
    if (!/^#[0-9A-F]{6}$/.test(trimmed)) {
      throw new Error('El color debe tener formato hexadecimal (#RRGGBB)');
    }
    
    return trimmed;
  }

  private generateSlug(nombre: string): string {
    return nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
      .trim();
  }

  update(data: UpdateCategoryData): Category {
    return new Category(
      {
        nombre: data.nombre ?? this.nombre,
        colorHex: data.colorHex ?? this.colorHex,
        slug: data.slug ?? this.slug,
      },
      this.id
    );
  }

  equals(other: Category): boolean {
    return this.id.equals(other.id);
  }

  toJSON() {
    return {
      id: this.id.toString(),
      nombre: this.nombre,
      colorHex: this.colorHex,
      slug: this.slug,
    };
  }

  static fromJSON(data: any): Category {
    return new Category(
      {
        nombre: data.nombre,
        colorHex: data.colorHex,
        slug: data.slug,
      },
      Id.fromString(data.id)
    );
  }
}
