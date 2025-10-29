import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageTransactionRepo } from '../../infrastructure/repositories/LocalStorageTransactionRepo';
import { Transaction, CreateTransactionData } from '../../domain/entities/Transaction';
import { Id } from '../../domain/value-objects/Id';
import { EsDate } from '../../domain/value-objects/EsDate';

describe('LocalStorageTransactionRepo', () => {
  let repo: LocalStorageTransactionRepo;

  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
    repo = new LocalStorageTransactionRepo();
  });

  const createTestTransaction = (): Transaction => {
    const data: CreateTransactionData = {
      fecha: new Date(2024, 0, 15),
      descripcion: 'Test transaction',
      importeEUR: 100.50,
      categoriaId: 'cat-123',
    };
    return new Transaction(data);
  };

  describe('add', () => {
    it('should add transaction successfully', async () => {
      const transaction = createTestTransaction();
      
      await repo.add(transaction);
      
      const found = await repo.find(transaction.id);
      expect(found).not.toBeNull();
      expect(found?.descripcion).toBe('Test transaction');
    });

    it('should prevent duplicate transactions', async () => {
      const transaction = createTestTransaction();
      
      await repo.add(transaction);
      
      // Intentar agregar la misma transacción (mismo hash)
      await expect(repo.add(transaction)).rejects.toThrow('Transacción duplicada detectada');
    });
  });

  describe('find', () => {
    it('should return null for non-existent transaction', async () => {
      const id = new Id();
      const found = await repo.find(id);
      expect(found).toBeNull();
    });

    it('should return transaction by id', async () => {
      const transaction = createTestTransaction();
      await repo.add(transaction);
      
      const found = await repo.find(transaction.id);
      expect(found).not.toBeNull();
      expect(found?.id.equals(transaction.id)).toBe(true);
    });
  });

  describe('findByMonth', () => {
    it('should return transactions for specific month', async () => {
      const transaction1 = new Transaction({
        fecha: new Date(2024, 0, 15), // Enero 2024
        descripcion: 'Transaction 1',
        importeEUR: 100,
      });
      
      const transaction2 = new Transaction({
        fecha: new Date(2024, 1, 15), // Febrero 2024
        descripcion: 'Transaction 2',
        importeEUR: 200,
      });
      
      await repo.add(transaction1);
      await repo.add(transaction2);
      
      const januaryTransactions = await repo.findByMonth(2024, 1);
      expect(januaryTransactions).toHaveLength(1);
      expect(januaryTransactions[0].descripcion).toBe('Transaction 1');
    });
  });

  describe('findByCategory', () => {
    it('should return transactions for specific category', async () => {
      const transaction1 = new Transaction({
        fecha: new Date(2024, 0, 15),
        descripcion: 'Transaction 1',
        importeEUR: 100,
        categoriaId: 'cat-1',
      });
      
      const transaction2 = new Transaction({
        fecha: new Date(2024, 0, 16),
        descripcion: 'Transaction 2',
        importeEUR: 200,
        categoriaId: 'cat-2',
      });
      
      await repo.add(transaction1);
      await repo.add(transaction2);
      
      const cat1Transactions = await repo.findByCategory('cat-1');
      expect(cat1Transactions).toHaveLength(1);
      expect(cat1Transactions[0].descripcion).toBe('Transaction 1');
    });
  });

  describe('update', () => {
    it('should update transaction successfully', async () => {
      const transaction = createTestTransaction();
      await repo.add(transaction);
      
      const updatedTransaction = await repo.update(transaction.id, {
        descripcion: 'Updated description',
        importeEUR: 200.75,
      });
      
      expect(updatedTransaction.descripcion).toBe('Updated description');
      expect(updatedTransaction.importeEUR.getValue()).toBe(200.75);
    });

    it('should throw error for non-existent transaction', async () => {
      const id = new Id();
      
      await expect(repo.update(id, { descripcion: 'Updated' }))
        .rejects.toThrow('Transacción con id');
    });
  });

  describe('remove', () => {
    it('should remove transaction successfully', async () => {
      const transaction = createTestTransaction();
      await repo.add(transaction);
      
      await repo.remove(transaction.id);
      
      const found = await repo.find(transaction.id);
      expect(found).toBeNull();
    });

    it('should throw error for non-existent transaction', async () => {
      const id = new Id();
      
      await expect(repo.remove(id)).rejects.toThrow('Transacción con id');
    });
  });

  describe('importMany', () => {
    it('should import transactions without duplicates', async () => {
      const transactions = [
        createTestTransaction(),
        new Transaction({
          fecha: new Date(2024, 0, 16),
          descripcion: 'Another transaction',
          importeEUR: 200,
        }),
      ];
      
      const result = await repo.importMany(transactions, false);
      
      expect(result.imported).toBe(2);
      expect(result.duplicates).toBe(0);
    });

    it('should detect and count duplicates', async () => {
      const transaction = createTestTransaction();
      await repo.add(transaction);
      
      const result = await repo.importMany([transaction], false);
      
      expect(result.imported).toBe(0);
      expect(result.duplicates).toBe(1);
    });
  });

  describe('getTotalByMonth', () => {
    it('should calculate totals correctly', async () => {
      const income = new Transaction({
        fecha: new Date(2024, 0, 15),
        descripcion: 'Income',
        importeEUR: 1000,
      });
      
      const expense = new Transaction({
        fecha: new Date(2024, 0, 16),
        descripcion: 'Expense',
        importeEUR: -300,
      });
      
      await repo.add(income);
      await repo.add(expense);
      
      const totals = await repo.getTotalByMonth(2024, 1);
      
      expect(totals.income).toBe(1000);
      expect(totals.expense).toBe(300);
      expect(totals.balance).toBe(700);
    });
  });
});
