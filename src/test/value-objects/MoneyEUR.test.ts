import { describe, it, expect } from 'vitest';
import { MoneyEUR } from '../../domain/value-objects/MoneyEUR';

describe('MoneyEUR', () => {
  describe('Constructor', () => {
    it('should create MoneyEUR with valid amount', () => {
      const money = new MoneyEUR(1234.56);
      expect(money.getValue()).toBe(1234.56);
    });

    it('should round to 2 decimal places', () => {
      const money = new MoneyEUR(1234.567);
      expect(money.getValue()).toBe(1234.57);
    });

    it('should throw error for invalid amount', () => {
      expect(() => new MoneyEUR(NaN)).toThrow('El importe debe ser un número válido');
      expect(() => new MoneyEUR(Infinity)).toThrow('El importe debe ser finito');
    });
  });

  describe('Formatting', () => {
    it('should format correctly in Spanish', () => {
      const money = new MoneyEUR(1234.56);
      expect(money.format()).toBe('1.234,56 €');
    });

    it('should format for input correctly', () => {
      const money = new MoneyEUR(1234.56);
      expect(money.formatForInput()).toBe('1234,56');
    });

    it('should format zero correctly', () => {
      const money = new MoneyEUR(0);
      expect(money.format()).toBe('0,00 €');
    });

    it('should format negative amounts correctly', () => {
      const money = new MoneyEUR(-1234.56);
      expect(money.format()).toBe('-1.234,56 €');
    });
  });

  describe('Parsing', () => {
    it('should parse Spanish format correctly', () => {
      const money = MoneyEUR.fromString('1.234,56 €');
      expect(money.getValue()).toBe(1234.56);
    });

    it('should parse without currency symbol', () => {
      const money = MoneyEUR.fromString('1.234,56');
      expect(money.getValue()).toBe(1234.56);
    });

    it('should parse input format correctly', () => {
      const money = MoneyEUR.fromInputString('1234,56');
      expect(money.getValue()).toBe(1234.56);
    });

    it('should throw error for invalid format', () => {
      expect(() => MoneyEUR.fromString('invalid')).toThrow('Formato de importe inválido');
      expect(() => MoneyEUR.fromInputString('invalid')).toThrow('Formato de importe inválido');
    });
  });

  describe('Arithmetic operations', () => {
    it('should add correctly', () => {
      const money1 = new MoneyEUR(100);
      const money2 = new MoneyEUR(50);
      const result = money1.add(money2);
      expect(result.getValue()).toBe(150);
    });

    it('should subtract correctly', () => {
      const money1 = new MoneyEUR(100);
      const money2 = new MoneyEUR(30);
      const result = money1.subtract(money2);
      expect(result.getValue()).toBe(70);
    });

    it('should multiply correctly', () => {
      const money = new MoneyEUR(100);
      const result = money.multiply(1.5);
      expect(result.getValue()).toBe(150);
    });

    it('should divide correctly', () => {
      const money = new MoneyEUR(100);
      const result = money.divide(2);
      expect(result.getValue()).toBe(50);
    });

    it('should throw error when dividing by zero', () => {
      const money = new MoneyEUR(100);
      expect(() => money.divide(0)).toThrow('No se puede dividir por cero');
    });
  });

  describe('Comparisons', () => {
    it('should compare equality correctly', () => {
      const money1 = new MoneyEUR(100);
      const money2 = new MoneyEUR(100);
      const money3 = new MoneyEUR(100.01);
      
      expect(money1.equals(money2)).toBe(true);
      expect(money1.equals(money3)).toBe(false);
    });

    it('should check if positive', () => {
      const positive = new MoneyEUR(100);
      const negative = new MoneyEUR(-100);
      const zero = new MoneyEUR(0);
      
      expect(positive.isPositive()).toBe(true);
      expect(negative.isPositive()).toBe(false);
      expect(zero.isPositive()).toBe(false);
    });

    it('should check if negative', () => {
      const positive = new MoneyEUR(100);
      const negative = new MoneyEUR(-100);
      const zero = new MoneyEUR(0);
      
      expect(positive.isNegative()).toBe(false);
      expect(negative.isNegative()).toBe(true);
      expect(zero.isNegative()).toBe(false);
    });

    it('should check if zero', () => {
      const positive = new MoneyEUR(100);
      const negative = new MoneyEUR(-100);
      const zero = new MoneyEUR(0);
      
      expect(positive.isZero()).toBe(false);
      expect(negative.isZero()).toBe(false);
      expect(zero.isZero()).toBe(true);
    });
  });

  describe('Static methods', () => {
    it('should create zero amount', () => {
      const zero = MoneyEUR.zero();
      expect(zero.getValue()).toBe(0);
      expect(zero.isZero()).toBe(true);
    });
  });
});
