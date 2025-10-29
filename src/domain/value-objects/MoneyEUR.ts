export class MoneyEUR {
  private readonly amount: number;

  constructor(amount: number) {
    this.validate(amount);
    this.amount = Math.round(amount * 100) / 100; // Redondear a 2 decimales
  }

  private validate(amount: number): void {
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new Error('El importe debe ser un número válido');
    }
    
    if (!isFinite(amount)) {
      throw new Error('El importe debe ser finito');
    }
  }

  getValue(): number {
    return this.amount;
  }

  format(): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    }).format(this.amount);
  }

  formatForInput(): string {
    return this.amount.toFixed(2).replace('.', ',');
  }

  add(other: MoneyEUR): MoneyEUR {
    return new MoneyEUR(this.amount + other.amount);
  }

  subtract(other: MoneyEUR): MoneyEUR {
    return new MoneyEUR(this.amount - other.amount);
  }

  multiply(factor: number): MoneyEUR {
    return new MoneyEUR(this.amount * factor);
  }

  divide(divisor: number): MoneyEUR {
    if (divisor === 0) {
      throw new Error('No se puede dividir por cero');
    }
    return new MoneyEUR(this.amount / divisor);
  }

  equals(other: MoneyEUR): boolean {
    return Math.abs(this.amount - other.amount) < 0.01; // Tolerancia para comparaciones de punto flotante
  }

  isPositive(): boolean {
    return this.amount > 0;
  }

  isNegative(): boolean {
    return this.amount < 0;
  }

  isZero(): boolean {
    return Math.abs(this.amount) < 0.01;
  }

  static fromString(value: string): MoneyEUR {
    // Parsear formato español: 1.234,56 €
    const cleanValue = value
      .replace(/[€\s]/g, '')
      .replace(/\./g, '') // Remover separadores de miles
      .replace(',', '.'); // Convertir coma decimal a punto

    const amount = parseFloat(cleanValue);
    
    if (isNaN(amount)) {
      throw new Error(`Formato de importe inválido: ${value}`);
    }

    return new MoneyEUR(amount);
  }

  static fromInputString(value: string): MoneyEUR {
    // Parsear desde input (formato con coma decimal)
    const cleanValue = value.replace(',', '.');
    const amount = parseFloat(cleanValue);
    
    if (isNaN(amount)) {
      throw new Error(`Formato de importe inválido: ${value}`);
    }

    return new MoneyEUR(amount);
  }

  static zero(): MoneyEUR {
    return new MoneyEUR(0);
  }
}
