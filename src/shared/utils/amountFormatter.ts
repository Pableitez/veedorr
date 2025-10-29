import { AmountFormatter } from '../types';
import { CURRENCY_CONFIG } from '../constants';

export class SpanishAmountFormatter implements AmountFormatter {
  private locale = CURRENCY_CONFIG.locale;
  private currency = CURRENCY_CONFIG.code;

  format(amount: number): string {
    return new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  parse(amountString: string): number {
    // Remover símbolos de moneda y espacios
    const cleanString = amountString
      .replace(/[€\s]/g, '')
      .replace(/\./g, '') // Remover separadores de miles
      .replace(',', '.'); // Convertir coma decimal a punto

    const amount = parseFloat(cleanString);
    
    if (isNaN(amount)) {
      throw new Error('Formato de importe inválido');
    }

    return amount;
  }

  formatForInput(amount: number): string {
    // Formato para input (sin símbolo de moneda)
    return amount.toFixed(2).replace('.', ',');
  }

  parseFromInput(amountString: string): number {
    // Parsear desde input (formato con coma decimal)
    const cleanString = amountString.replace(',', '.');
    const amount = parseFloat(cleanString);
    
    if (isNaN(amount)) {
      throw new Error('Formato de importe inválido');
    }

    return amount;
  }
}

export const amountFormatter = new SpanishAmountFormatter();
