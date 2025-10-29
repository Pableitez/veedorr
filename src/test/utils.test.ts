import { describe, it, expect } from 'vitest';
import { dateFormatter, amountFormatter } from '../shared/utils';

describe('Date Formatter', () => {
  it('should format date correctly', () => {
    const date = new Date(2024, 0, 15); // 15 de enero de 2024
    const formatted = dateFormatter.format(date);
    expect(formatted).toBe('15/01/2024');
  });

  it('should parse date correctly', () => {
    const dateString = '15/01/2024';
    const parsed = dateFormatter.parse(dateString);
    expect(parsed.getDate()).toBe(15);
    expect(parsed.getMonth()).toBe(0); // Enero es 0
    expect(parsed.getFullYear()).toBe(2024);
  });

  it('should throw error for invalid date format', () => {
    expect(() => dateFormatter.parse('invalid-date')).toThrow();
  });
});

describe('Amount Formatter', () => {
  it('should format amount correctly', () => {
    const amount = 1234.56;
    const formatted = amountFormatter.format(amount);
    expect(formatted).toBe('1.234,56 €');
  });

  it('should parse amount correctly', () => {
    const amountString = '1.234,56 €';
    const parsed = amountFormatter.parse(amountString);
    expect(parsed).toBe(1234.56);
  });

  it('should throw error for invalid amount format', () => {
    expect(() => amountFormatter.parse('invalid-amount')).toThrow();
  });
});
