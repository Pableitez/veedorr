import { ITransactionRepo } from '../../domain/ports/ITransactionRepo';
import { Transaction, CreateTransactionData, UpdateTransactionData } from '../../domain/entities/Transaction';
import { Id } from '../../domain/value-objects/Id';
import { EsDate } from '../../domain/value-objects/EsDate';
import { MoneyEUR } from '../../domain/value-objects/MoneyEUR';

export class LocalStorageTransactionRepo implements ITransactionRepo {
  private readonly storageKey = 'vedor.transactions';
  private readonly duplicateKey = 'vedor.transaction_hashes';

  private getTransactions(): Transaction[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      return parsed.map((t: any) => Transaction.fromJSON(t));
    } catch (error) {
      console.error('Error al cargar transacciones desde LocalStorage:', error);
      return [];
    }
  }

  private saveTransactions(transactions: Transaction[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(transactions.map(t => t.toJSON())));
    } catch (error) {
      console.error('Error al guardar transacciones en LocalStorage:', error);
      throw new Error('No se pudo guardar las transacciones');
    }
  }

  private getTransactionHashes(): Set<string> {
    try {
      const data = localStorage.getItem(this.duplicateKey);
      if (!data) return new Set();
      return new Set(JSON.parse(data));
    } catch (error) {
      console.error('Error al cargar hashes de transacciones:', error);
      return new Set();
    }
  }

  private saveTransactionHashes(hashes: Set<string>): void {
    try {
      localStorage.setItem(this.duplicateKey, JSON.stringify(Array.from(hashes)));
    } catch (error) {
      console.error('Error al guardar hashes de transacciones:', error);
    }
  }

  private generateTransactionHash(transaction: Transaction): string {
    const fecha = transaction.fecha.format();
    const descripcion = transaction.descripcion.toLowerCase().trim();
    const importe = transaction.importeEUR.getValue().toString();
    return btoa(`${fecha}|${descripcion}|${importe}`).replace(/[+/=]/g, '');
  }

  async find(id: Id): Promise<Transaction | null> {
    const transactions = this.getTransactions();
    return transactions.find(t => t.id.equals(id)) || null;
  }

  async findByMonth(year: number, month: number): Promise<Transaction[]> {
    const transactions = this.getTransactions();
    return transactions.filter(t => t.isInMonth(year, month));
  }

  async findByDateRange(startDate: EsDate, endDate: EsDate): Promise<Transaction[]> {
    const transactions = this.getTransactions();
    return transactions.filter(t => t.isInDateRange(startDate, endDate));
  }

  async findByCategory(categoriaId: string): Promise<Transaction[]> {
    const transactions = this.getTransactions();
    return transactions.filter(t => t.categoriaId === categoriaId);
  }

  async findByAccount(accountId: string): Promise<Transaction[]> {
    const transactions = this.getTransactions();
    return transactions.filter(t => t.accountId === accountId);
  }

  async add(transaction: Transaction): Promise<void> {
    const transactions = this.getTransactions();
    const hashes = this.getTransactionHashes();
    
    const hash = this.generateTransactionHash(transaction);
    if (hashes.has(hash)) {
      throw new Error('Transacción duplicada detectada');
    }
    
    transactions.push(transaction);
    hashes.add(hash);
    
    this.saveTransactions(transactions);
    this.saveTransactionHashes(hashes);
  }

  async update(id: Id, data: UpdateTransactionData): Promise<Transaction> {
    const transactions = this.getTransactions();
    const index = transactions.findIndex(t => t.id.equals(id));
    
    if (index === -1) {
      throw new Error(`Transacción con id ${id.toString()} no encontrada`);
    }

    const oldTransaction = transactions[index];
    const updatedTransaction = oldTransaction.update(data);
    
    // Verificar si hay duplicados con el nuevo hash
    const hashes = this.getTransactionHashes();
    const oldHash = this.generateTransactionHash(oldTransaction);
    const newHash = this.generateTransactionHash(updatedTransaction);
    
    if (oldHash !== newHash && hashes.has(newHash)) {
      throw new Error('La actualización crearía una transacción duplicada');
    }
    
    // Actualizar hashes
    hashes.delete(oldHash);
    hashes.add(newHash);
    
    transactions[index] = updatedTransaction;
    
    this.saveTransactions(transactions);
    this.saveTransactionHashes(hashes);
    
    return updatedTransaction;
  }

  async remove(id: Id): Promise<void> {
    const transactions = this.getTransactions();
    const index = transactions.findIndex(t => t.id.equals(id));
    
    if (index === -1) {
      throw new Error(`Transacción con id ${id.toString()} no encontrada`);
    }

    const transaction = transactions[index];
    const hashes = this.getTransactionHashes();
    const hash = this.generateTransactionHash(transaction);
    
    transactions.splice(index, 1);
    hashes.delete(hash);
    
    this.saveTransactions(transactions);
    this.saveTransactionHashes(hashes);
  }

  async importMany(transactions: Transaction[], dedupe: boolean): Promise<{ imported: number; duplicates: number }> {
    const existingTransactions = this.getTransactions();
    const hashes = this.getTransactionHashes();
    let imported = 0;
    let duplicates = 0;
    
    const newTransactions: Transaction[] = [];
    
    for (const transaction of transactions) {
      const hash = this.generateTransactionHash(transaction);
      
      if (hashes.has(hash)) {
        duplicates++;
        if (!dedupe) {
          continue; // Skip duplicates if not deduplicating
        }
      }
      
      newTransactions.push(transaction);
      hashes.add(hash);
      imported++;
    }
    
    if (newTransactions.length > 0) {
      const allTransactions = [...existingTransactions, ...newTransactions];
      this.saveTransactions(allTransactions);
      this.saveTransactionHashes(hashes);
    }
    
    return { imported, duplicates };
  }

  async getTotalByCategory(categoriaId: string, startDate?: EsDate, endDate?: EsDate): Promise<number> {
    let transactions = this.getTransactions().filter(t => t.categoriaId === categoriaId);
    
    if (startDate && endDate) {
      transactions = transactions.filter(t => t.isInDateRange(startDate, endDate));
    }
    
    return transactions.reduce((total, t) => total + t.importeEUR.getValue(), 0);
  }

  async getTotalByMonth(year: number, month: number): Promise<{ income: number; expense: number; balance: number }> {
    const transactions = await this.findByMonth(year, month);
    
    let income = 0;
    let expense = 0;
    
    for (const transaction of transactions) {
      const amount = transaction.importeEUR.getValue();
      if (amount > 0) {
        income += amount;
      } else {
        expense += Math.abs(amount);
      }
    }
    
    return {
      income,
      expense,
      balance: income - expense
    };
  }
}
