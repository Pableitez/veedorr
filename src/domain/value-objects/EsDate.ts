export class EsDate {
  private readonly date: Date;

  constructor(date: Date) {
    this.validate(date);
    this.date = new Date(date.getTime()); // Crear copia para inmutabilidad
  }

  private validate(date: Date): void {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('La fecha debe ser una instancia válida de Date');
    }
  }

  getValue(): Date {
    return new Date(this.date.getTime());
  }

  format(): string {
    return new Intl.DateTimeFormat('es-ES', {
      timeZone: 'Europe/Madrid',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(this.date);
  }

  formatForInput(): string {
    // Formato para input type="date" (yyyy-mm-dd)
    return this.date.toISOString().split('T')[0];
  }

  formatLong(): string {
    return new Intl.DateTimeFormat('es-ES', {
      timeZone: 'Europe/Madrid',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(this.date);
  }

  formatShort(): string {
    return new Intl.DateTimeFormat('es-ES', {
      timeZone: 'Europe/Madrid',
      day: '2-digit',
      month: '2-digit',
    }).format(this.date);
  }

  parse(dateString: string): EsDate {
    // Parsear formato dd/mm/yyyy
    const parts = dateString.split('/');
    if (parts.length !== 3) {
      throw new Error('Formato de fecha inválido. Use dd/mm/yyyy');
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Los meses en JS van de 0-11
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      throw new Error('Formato de fecha inválido. Use dd/mm/yyyy');
    }

    const date = new Date(year, month, day);
    
    // Validar que la fecha sea válida
    if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
      throw new Error('Fecha inválida');
    }

    return new EsDate(date);
  }

  parseFromInput(dateString: string): EsDate {
    // Parsear desde input type="date" (yyyy-mm-dd)
    const date = new Date(dateString + 'T00:00:00');
    if (isNaN(date.getTime())) {
      throw new Error('Formato de fecha inválido');
    }
    return new EsDate(date);
  }

  equals(other: EsDate): boolean {
    return this.date.getTime() === other.date.getTime();
  }

  isBefore(other: EsDate): boolean {
    return this.date < other.date;
  }

  isAfter(other: EsDate): boolean {
    return this.date > other.date;
  }

  isSameDay(other: EsDate): boolean {
    return this.date.toDateString() === other.date.toDateString();
  }

  addDays(days: number): EsDate {
    const newDate = new Date(this.date);
    newDate.setDate(newDate.getDate() + days);
    return new EsDate(newDate);
  }

  addMonths(months: number): EsDate {
    const newDate = new Date(this.date);
    newDate.setMonth(newDate.getMonth() + months);
    return new EsDate(newDate);
  }

  addYears(years: number): EsDate {
    const newDate = new Date(this.date);
    newDate.setFullYear(newDate.getFullYear() + years);
    return new EsDate(newDate);
  }

  getStartOfMonth(): EsDate {
    const newDate = new Date(this.date);
    newDate.setDate(1);
    newDate.setHours(0, 0, 0, 0);
    return new EsDate(newDate);
  }

  getEndOfMonth(): EsDate {
    const newDate = new Date(this.date);
    newDate.setMonth(newDate.getMonth() + 1, 0);
    newDate.setHours(23, 59, 59, 999);
    return new EsDate(newDate);
  }

  getStartOfYear(): EsDate {
    const newDate = new Date(this.date);
    newDate.setMonth(0, 1);
    newDate.setHours(0, 0, 0, 0);
    return new EsDate(newDate);
  }

  getEndOfYear(): EsDate {
    const newDate = new Date(this.date);
    newDate.setMonth(11, 31);
    newDate.setHours(23, 59, 59, 999);
    return new EsDate(newDate);
  }

  static today(): EsDate {
    return new EsDate(new Date());
  }

  static fromString(dateString: string): EsDate {
    return new EsDate(new Date()).parse(dateString);
  }

  static fromInputString(dateString: string): EsDate {
    return new EsDate(new Date()).parseFromInput(dateString);
  }
}
