export class Id {
  private readonly value: string;

  constructor(value?: string) {
    if (value) {
      this.validate(value);
      this.value = value;
    } else {
      this.value = crypto.randomUUID();
    }
  }

  private validate(value: string): void {
    if (typeof value !== 'string') {
      throw new Error('ID debe ser una cadena no vacía');
    }
    
    if (value.length < 1) {
      throw new Error('ID debe ser una cadena no vacía');
    }
  }

  toString(): string {
    return this.value;
  }

  equals(other: Id): boolean {
    return this.value === other.value;
  }

  static fromString(value: string): Id {
    return new Id(value);
  }
}
