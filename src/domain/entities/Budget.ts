import { Id } from '../value-objects/Id';
import { MoneyEUR } from '../value-objects/MoneyEUR';
import { EsDate } from '../value-objects/EsDate';

export interface CreateBudgetData {
  categoriaId: string;
  limiteMensualEUR: number;
}

export interface UpdateBudgetData {
  categoriaId?: string;
  limiteMensualEUR?: number;
}

export class Budget {
  public readonly id: Id;
  public readonly categoriaId: string;
  public readonly limiteMensualEUR: MoneyEUR;
  public readonly createdAt: EsDate;

  constructor(data: CreateBudgetData, id?: Id, createdAt?: EsDate) {
    this.id = id || new Id();
    this.categoriaId = this.validateCategoriaId(data.categoriaId);
    this.limiteMensualEUR = new MoneyEUR(data.limiteMensualEUR);
    this.createdAt = createdAt || EsDate.today();
  }

  private validateCategoriaId(categoriaId: string): string {
    if (!categoriaId || typeof categoriaId !== 'string') {
      throw new Error('El ID de categoría es obligatorio');
    }
    
    if (categoriaId.trim().length === 0) {
      throw new Error('El ID de categoría no puede estar vacío');
    }
    
    return categoriaId.trim();
  }

  update(data: UpdateBudgetData): Budget {
    return new Budget(
      {
        categoriaId: data.categoriaId ?? this.categoriaId,
        limiteMensualEUR: data.limiteMensualEUR ?? this.limiteMensualEUR.getValue(),
      },
      this.id,
      this.createdAt
    );
  }

  isExceeded(spentAmount: MoneyEUR): boolean {
    return spentAmount.getValue() > this.limiteMensualEUR.getValue();
  }

  getRemainingAmount(spentAmount: MoneyEUR): MoneyEUR {
    return this.limiteMensualEUR.subtract(spentAmount);
  }

  getUsagePercentage(spentAmount: MoneyEUR): number {
    if (this.limiteMensualEUR.isZero()) {
      return 0;
    }
    
    const percentage = (spentAmount.getValue() / this.limiteMensualEUR.getValue()) * 100;
    return Math.min(percentage, 100); // Máximo 100%
  }

  getUsageStatus(spentAmount: MoneyEUR): 'under' | 'near' | 'exceeded' {
    const percentage = this.getUsagePercentage(spentAmount);
    
    if (percentage >= 100) {
      return 'exceeded';
    } else if (percentage >= 80) {
      return 'near';
    } else {
      return 'under';
    }
  }

  equals(other: Budget): boolean {
    return this.id.equals(other.id);
  }

  toJSON() {
    return {
      id: this.id.toString(),
      categoriaId: this.categoriaId,
      limiteMensualEUR: this.limiteMensualEUR.getValue(),
      createdAt: this.createdAt.getValue().toISOString(),
    };
  }

  static fromJSON(data: any): Budget {
    return new Budget(
      {
        categoriaId: data.categoriaId,
        limiteMensualEUR: data.limiteMensualEUR,
      },
      Id.fromString(data.id),
      new EsDate(new Date(data.createdAt))
    );
  }
}
