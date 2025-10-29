import { describe, it, expect } from 'vitest';
import { Transaction, CreateTransactionData } from '../../domain/entities/Transaction';
import { Id } from '../../domain/value-objects/Id';
import { MoneyEUR } from '../../domain/value-objects/MoneyEUR';
import { EsDate } from '../../domain/value-objects/EsDate';

describe('Transaction', () => {
  const validData: CreateTransactionData = {
    accountId: 'account-123',
    fecha: new Date(2024, 0, 15),
    descripcion: 'Compra en supermercado',
    categoriaId: 'cat-123',
    importeEUR: -25.50,
    merchant: 'Mercadona',
  };

  describe('Constructor', () => {
    it('should create transaction with valid data', () => {
      const transaction = new Transaction(validData);
      
      expect(transaction.descripcion).toBe('Compra en supermercado');
      expect(transaction.importeEUR.getValue()).toBe(-25.50);
      expect(transaction.merchant).toBe('Mercadona');
      expect(transaction.accountId).toBe('account-123');
      expect(transaction.categoriaId).toBe('cat-123');
    });

    it('should create transaction with minimal data', () => {
      const minimalData: CreateTransactionData = {
        fecha: new Date(2024, 0, 15),
        descripcion: 'Test transaction',
        importeEUR: 100,
      };
      
      const transaction = new Transaction(minimalData);
      
      expect(transaction.descripcion).toBe('Test transaction');
      expect(transaction.importeEUR.getValue()).toBe(100);
      expect(transaction.accountId).toBeUndefined();
      expect(transaction.categoriaId).toBeUndefined();
      expect(transaction.merchant).toBeUndefined();
    });

    it('should throw error for empty description', () => {
      const invalidData = { ...validData, descripcion: '' };
      expect(() => new Transaction(invalidData)).toThrow('La descripción es obligatoria');
    });

    it('should throw error for description too long', () => {
      const invalidData = { ...validData, descripcion: 'a'.repeat(256) };
      expect(() => new Transaction(invalidData)).toThrow('La descripción no puede exceder 255 caracteres');
    });

    it('should trim description', () => {
      const dataWithSpaces = { ...validData, descripcion: '  Test transaction  ' };
      const transaction = new Transaction(dataWithSpaces);
      expect(transaction.descripcion).toBe('Test transaction');
    });
  });

  describe('Type checking', () => {
    it('should identify income correctly', () => {
      const incomeData = { ...validData, importeEUR: 100 };
      const transaction = new Transaction(incomeData);
      
      expect(transaction.isIncome()).toBe(true);
      expect(transaction.isExpense()).toBe(false);
    });

    it('should identify expense correctly', () => {
      const expenseData = { ...validData, importeEUR: -50 };
      const transaction = new Transaction(expenseData);
      
      expect(transaction.isIncome()).toBe(false);
      expect(transaction.isExpense()).toBe(true);
    });

    it('should handle zero amount', () => {
      const zeroData = { ...validData, importeEUR: 0 };
      const transaction = new Transaction(zeroData);
      
      expect(transaction.isIncome()).toBe(false);
      expect(transaction.isExpense()).toBe(false);
    });
  });

  describe('Amount operations', () => {
    it('should get absolute amount', () => {
      const negativeData = { ...validData, importeEUR: -50 };
      const transaction = new Transaction(negativeData);
      
      expect(transaction.getAbsoluteAmount().getValue()).toBe(50);
    });

    it('should get absolute amount for positive', () => {
      const positiveData = { ...validData, importeEUR: 50 };
      const transaction = new Transaction(positiveData);
      
      expect(transaction.getAbsoluteAmount().getValue()).toBe(50);
    });
  });

  describe('Date filtering', () => {
    it('should check if in month correctly', () => {
      const transaction = new Transaction(validData);
      
      expect(transaction.isInMonth(2024, 1)).toBe(true); // Enero
      expect(transaction.isInMonth(2024, 2)).toBe(false); // Febrero
      expect(transaction.isInMonth(2023, 1)).toBe(false); // Año diferente
    });

    it('should check if in date range correctly', () => {
      const transaction = new Transaction(validData);
      const startDate = new EsDate(new Date(2024, 0, 1));
      const endDate = new EsDate(new Date(2024, 0, 31));
      const outsideStart = new EsDate(new Date(2024, 1, 1));
      const outsideEnd = new EsDate(new Date(2024, 1, 28));
      
      expect(transaction.isInDateRange(startDate, endDate)).toBe(true);
      expect(transaction.isInDateRange(outsideStart, outsideEnd)).toBe(false);
    });
  });

  describe('Update', () => {
    it('should update transaction correctly', () => {
      const transaction = new Transaction(validData);
      const updatedTransaction = transaction.update({
        descripcion: 'Updated description',
        importeEUR: -30.00,
      });
      
      expect(updatedTransaction.descripcion).toBe('Updated description');
      expect(updatedTransaction.importeEUR.getValue()).toBe(-30.00);
      expect(updatedTransaction.id.equals(transaction.id)).toBe(true);
    });

    it('should preserve unchanged fields', () => {
      const transaction = new Transaction(validData);
      const updatedTransaction = transaction.update({
        descripcion: 'Updated description',
      });
      
      expect(updatedTransaction.importeEUR.getValue()).toBe(transaction.importeEUR.getValue());
      expect(updatedTransaction.merchant).toBe(transaction.merchant);
    });
  });

  describe('Serialization', () => {
    it('should serialize to JSON correctly', () => {
      const transaction = new Transaction(validData);
      const json = transaction.toJSON();
      
      expect(json.descripcion).toBe('Compra en supermercado');
      expect(json.importeEUR).toBe(-25.50);
      expect(json.merchant).toBe('Mercadona');
      expect(json.id).toBeDefined();
      expect(json.fecha).toBeDefined();
      expect(json.createdAt).toBeDefined();
    });

    it('should deserialize from JSON correctly', () => {
      const transaction = new Transaction(validData);
      const json = transaction.toJSON();
      const deserialized = Transaction.fromJSON(json);
      
      expect(deserialized.descripcion).toBe(transaction.descripcion);
      expect(deserialized.importeEUR.getValue()).toBe(transaction.importeEUR.getValue());
      expect(deserialized.merchant).toBe(transaction.merchant);
      expect(deserialized.id.equals(transaction.id)).toBe(true);
    });
  });
});
