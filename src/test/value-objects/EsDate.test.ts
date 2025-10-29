import { describe, it, expect } from 'vitest';
import { EsDate } from '../../domain/value-objects/EsDate';

describe('EsDate', () => {
  describe('Constructor', () => {
    it('should create EsDate with valid date', () => {
      const date = new Date(2024, 0, 15); // 15 de enero de 2024
      const esDate = new EsDate(date);
      expect(esDate.getValue()).toEqual(date);
    });

    it('should throw error for invalid date', () => {
      expect(() => new EsDate(new Date('invalid'))).toThrow('La fecha debe ser una instancia válida de Date');
    });
  });

  describe('Formatting', () => {
    it('should format correctly in Spanish', () => {
      const date = new Date(2024, 0, 15); // 15 de enero de 2024
      const esDate = new EsDate(date);
      expect(esDate.format()).toBe('15/01/2024');
    });

    it('should format for input correctly', () => {
      const date = new Date(2024, 0, 15);
      const esDate = new EsDate(date);
      expect(esDate.formatForInput()).toBe('2024-01-15');
    });

    it('should format long date correctly', () => {
      const date = new Date(2024, 0, 15); // Lunes 15 de enero de 2024
      const esDate = new EsDate(date);
      const formatted = esDate.formatLong();
      expect(formatted).toContain('enero');
      expect(formatted).toContain('2024');
    });

    it('should format short date correctly', () => {
      const date = new Date(2024, 0, 15);
      const esDate = new EsDate(date);
      expect(esDate.formatShort()).toBe('15/1');
    });
  });

  describe('Parsing', () => {
    it('should parse Spanish format correctly', () => {
      const esDate = EsDate.fromString('15/01/2024');
      const date = esDate.getValue();
      expect(date.getDate()).toBe(15);
      expect(date.getMonth()).toBe(0); // Enero es 0
      expect(date.getFullYear()).toBe(2024);
    });

    it('should parse input format correctly', () => {
      const esDate = EsDate.fromInputString('2024-01-15');
      const date = esDate.getValue();
      expect(date.getDate()).toBe(15);
      expect(date.getMonth()).toBe(0);
      expect(date.getFullYear()).toBe(2024);
    });

    it('should throw error for invalid format', () => {
      expect(() => EsDate.fromString('invalid-date')).toThrow('Formato de fecha inválido. Use dd/mm/yyyy');
      expect(() => EsDate.fromString('32/01/2024')).toThrow('Fecha inválida');
      expect(() => EsDate.fromInputString('invalid')).toThrow('Formato de fecha inválido');
    });
  });

  describe('Comparisons', () => {
    it('should compare equality correctly', () => {
      const date1 = new Date(2024, 0, 15);
      const date2 = new Date(2024, 0, 15);
      const date3 = new Date(2024, 0, 16);
      
      const esDate1 = new EsDate(date1);
      const esDate2 = new EsDate(date2);
      const esDate3 = new EsDate(date3);
      
      expect(esDate1.equals(esDate2)).toBe(true);
      expect(esDate1.equals(esDate3)).toBe(false);
    });

    it('should check if before', () => {
      const date1 = new Date(2024, 0, 15);
      const date2 = new Date(2024, 0, 16);
      
      const esDate1 = new EsDate(date1);
      const esDate2 = new EsDate(date2);
      
      expect(esDate1.isBefore(esDate2)).toBe(true);
      expect(esDate2.isBefore(esDate1)).toBe(false);
    });

    it('should check if after', () => {
      const date1 = new Date(2024, 0, 15);
      const date2 = new Date(2024, 0, 16);
      
      const esDate1 = new EsDate(date1);
      const esDate2 = new EsDate(date2);
      
      expect(esDate2.isAfter(esDate1)).toBe(true);
      expect(esDate1.isAfter(esDate2)).toBe(false);
    });

    it('should check if same day', () => {
      const date1 = new Date(2024, 0, 15, 10, 30);
      const date2 = new Date(2024, 0, 15, 15, 45);
      const date3 = new Date(2024, 0, 16);
      
      const esDate1 = new EsDate(date1);
      const esDate2 = new EsDate(date2);
      const esDate3 = new EsDate(date3);
      
      expect(esDate1.isSameDay(esDate2)).toBe(true);
      expect(esDate1.isSameDay(esDate3)).toBe(false);
    });
  });

  describe('Date arithmetic', () => {
    it('should add days correctly', () => {
      const date = new Date(2024, 0, 15);
      const esDate = new EsDate(date);
      const result = esDate.addDays(5);
      
      expect(result.getValue().getDate()).toBe(20);
    });

    it('should add months correctly', () => {
      const date = new Date(2024, 0, 15);
      const esDate = new EsDate(date);
      const result = esDate.addMonths(2);
      
      expect(result.getValue().getMonth()).toBe(2); // Marzo
    });

    it('should add years correctly', () => {
      const date = new Date(2024, 0, 15);
      const esDate = new EsDate(date);
      const result = esDate.addYears(1);
      
      expect(result.getValue().getFullYear()).toBe(2025);
    });
  });

  describe('Date ranges', () => {
    it('should get start of month', () => {
      const date = new Date(2024, 0, 15);
      const esDate = new EsDate(date);
      const startOfMonth = esDate.getStartOfMonth();
      
      expect(startOfMonth.getValue().getDate()).toBe(1);
      expect(startOfMonth.getValue().getMonth()).toBe(0);
    });

    it('should get end of month', () => {
      const date = new Date(2024, 0, 15);
      const esDate = new EsDate(date);
      const endOfMonth = esDate.getEndOfMonth();
      
      expect(endOfMonth.getValue().getDate()).toBe(31);
      expect(endOfMonth.getValue().getMonth()).toBe(0);
    });

    it('should get start of year', () => {
      const date = new Date(2024, 5, 15);
      const esDate = new EsDate(date);
      const startOfYear = esDate.getStartOfYear();
      
      expect(startOfYear.getValue().getMonth()).toBe(0);
      expect(startOfYear.getValue().getDate()).toBe(1);
    });

    it('should get end of year', () => {
      const date = new Date(2024, 5, 15);
      const esDate = new EsDate(date);
      const endOfYear = esDate.getEndOfYear();
      
      expect(endOfYear.getValue().getMonth()).toBe(11);
      expect(endOfYear.getValue().getDate()).toBe(31);
    });
  });

  describe('Static methods', () => {
    it('should create today date', () => {
      const today = EsDate.today();
      const now = new Date();
      
      expect(today.isSameDay(new EsDate(now))).toBe(true);
    });
  });
});
