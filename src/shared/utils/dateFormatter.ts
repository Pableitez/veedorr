import { DateFormatter } from '../types';
import { DATE_CONFIG } from '../constants';

export class SpanishDateFormatter implements DateFormatter {
  private locale = DATE_CONFIG.locale;
  private timeZone = DATE_CONFIG.timeZone;

  format(date: Date): string {
    return new Intl.DateTimeFormat(this.locale, {
      timeZone: this.timeZone,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  }

  parse(dateString: string): Date {
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

    return date;
  }

  formatForInput(date: Date): string {
    // Formato para input type="date" (yyyy-mm-dd)
    return date.toISOString().split('T')[0];
  }

  parseFromInput(dateString: string): Date {
    // Parsear desde input type="date" (yyyy-mm-dd)
    const date = new Date(dateString + 'T00:00:00');
    if (isNaN(date.getTime())) {
      throw new Error('Formato de fecha inválido');
    }
    return date;
  }
}

export const dateFormatter = new SpanishDateFormatter();
