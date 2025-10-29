import { Id } from '../value-objects/Id';
import { MoneyEUR } from '../value-objects/MoneyEUR';
import { EsDate } from '../value-objects/EsDate';

export interface CreateTransactionData {
  accountId?: string;
  fecha: Date;
  descripcion: string;
  categoriaId?: string;
  importeEUR: number;
  merchant?: string;
}

export interface UpdateTransactionData {
  accountId?: string;
  fecha?: Date;
  descripcion?: string;
  categoriaId?: string;
  importeEUR?: number;
  merchant?: string;
}

export class Transaction {
  public readonly id: Id;
  public readonly accountId?: string;
  public readonly fecha: EsDate;
  public readonly descripcion: string;
  public readonly categoriaId?: string;
  public readonly importeEUR: MoneyEUR;
  public readonly merchant?: string;
  public readonly createdAt: EsDate;

  constructor(data: CreateTransactionData, id?: Id, createdAt?: EsDate) {
    this.id = id || new Id();
    this.accountId = data.accountId;
    this.fecha = new EsDate(data.fecha);
    this.descripcion = this.validateDescripcion(data.descripcion);
    this.categoriaId = data.categoriaId;
    this.importeEUR = new MoneyEUR(data.importeEUR);
    this.merchant = data.merchant;
    this.createdAt = createdAt || EsDate.today();
  }

  private validateDescripcion(descripcion: string): string {
    if (!descripcion || typeof descripcion !== 'string') {
      throw new Error('La descripción es obligatoria');
    }
    
    if (descripcion.trim().length === 0) {
      throw new Error('La descripción no puede estar vacía');
    }
    
    if (descripcion.length > 255) {
      throw new Error('La descripción no puede exceder 255 caracteres');
    }
    
    return descripcion.trim();
  }

  update(data: UpdateTransactionData): Transaction {
    return new Transaction(
      {
        accountId: data.accountId ?? this.accountId,
        fecha: data.fecha ?? this.fecha.getValue(),
        descripcion: data.descripcion ?? this.descripcion,
        categoriaId: data.categoriaId ?? this.categoriaId,
        importeEUR: data.importeEUR ?? this.importeEUR.getValue(),
        merchant: data.merchant ?? this.merchant,
      },
      this.id,
      this.createdAt
    );
  }

  isIncome(): boolean {
    return this.importeEUR.isPositive();
  }

  isExpense(): boolean {
    return this.importeEUR.isNegative();
  }

  getAbsoluteAmount(): MoneyEUR {
    return this.importeEUR.isNegative() 
      ? new MoneyEUR(Math.abs(this.importeEUR.getValue()))
      : this.importeEUR;
  }

  isInMonth(year: number, month: number): boolean {
    const transactionDate = this.fecha.getValue();
    return transactionDate.getFullYear() === year && 
           transactionDate.getMonth() === month - 1; // Los meses en JS van de 0-11
  }

  isInDateRange(startDate: EsDate, endDate: EsDate): boolean {
    return !this.fecha.isBefore(startDate) && !this.fecha.isAfter(endDate);
  }

  toJSON() {
    return {
      id: this.id.toString(),
      accountId: this.accountId,
      fecha: this.fecha.getValue().toISOString(),
      descripcion: this.descripcion,
      categoriaId: this.categoriaId,
      importeEUR: this.importeEUR.getValue(),
      merchant: this.merchant,
      createdAt: this.createdAt.getValue().toISOString(),
    };
  }

  static fromJSON(data: any): Transaction {
    return new Transaction(
      {
        accountId: data.accountId,
        fecha: new Date(data.fecha),
        descripcion: data.descripcion,
        categoriaId: data.categoriaId,
        importeEUR: data.importeEUR,
        merchant: data.merchant,
      },
      Id.fromString(data.id),
      new EsDate(new Date(data.createdAt))
    );
  }
}
