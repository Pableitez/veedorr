import { Transaction, CreateTransactionData, UpdateTransactionData } from '../../domain/entities';
import { AppState, TransactionFilters, PaginatedTransactions } from '../types';
import { EsDate } from '../../domain/value-objects/EsDate';

export class TransactionsSlice {
  private state: AppState;
  private eventBus: any;

  constructor(state: AppState, eventBus: any) {
    this.state = state;
    this.eventBus = eventBus;
  }

  // Acciones
  addTransaction(data: CreateTransactionData): Transaction {
    const transaction = new Transaction(data);
    this.state.transactions.push(transaction);
    this.emitChange();
    return transaction;
  }

  updateTransaction(id: string, data: UpdateTransactionData): Transaction {
    const index = this.state.transactions.findIndex(t => t.id.toString() === id);
    if (index === -1) {
      throw new Error(`Transacción con id ${id} no encontrada`);
    }

    const updatedTransaction = this.state.transactions[index].update(data);
    this.state.transactions[index] = updatedTransaction;
    this.emitChange();
    return updatedTransaction;
  }

  removeTransaction(id: string): void {
    const index = this.state.transactions.findIndex(t => t.id.toString() === id);
    if (index === -1) {
      throw new Error(`Transacción con id ${id} no encontrada`);
    }

    this.state.transactions.splice(index, 1);
    this.emitChange();
  }

  importTransactions(transactions: Transaction[]): { imported: number; duplicates: number } {
    const existingHashes = new Set<string>();
    const newTransactions: Transaction[] = [];
    let duplicates = 0;

    // Calcular hashes de transacciones existentes
    for (const transaction of this.state.transactions) {
      const hash = this.generateTransactionHash(transaction);
      existingHashes.add(hash);
    }

    // Procesar nuevas transacciones
    for (const transaction of transactions) {
      const hash = this.generateTransactionHash(transaction);
      if (existingHashes.has(hash)) {
        duplicates++;
      } else {
        newTransactions.push(transaction);
        existingHashes.add(hash);
      }
    }

    this.state.transactions.push(...newTransactions);
    this.emitChange();

    return {
      imported: newTransactions.length,
      duplicates
    };
  }

  setFilters(filters: Partial<TransactionFilters>): void {
    this.state.ui.filters = { ...this.state.ui.filters, ...filters };
    this.state.ui.currentPage = 1; // Reset a la primera página
    this.emitChange();
  }

  setPage(page: number): void {
    const totalPages = this.getTotalPages();
    if (page >= 1 && page <= totalPages) {
      this.state.ui.currentPage = page;
      this.emitChange();
    }
  }

  // Getters
  getTransactions(): Transaction[] {
    return this.state.transactions;
  }

  getFilteredTransactions(): Transaction[] {
    let filtered = [...this.state.transactions];
    const filters = this.state.ui.filters;

    // Filtro por búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(t => 
        t.descripcion.toLowerCase().includes(searchLower) ||
        t.merchant?.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por categoría
    if (filters.categoryId) {
      filtered = filtered.filter(t => t.categoriaId === filters.categoryId);
    }

    // Filtro por tipo
    if (filters.type !== 'all') {
      filtered = filtered.filter(t => {
        if (filters.type === 'income') return t.importeEUR.getValue() > 0;
        if (filters.type === 'expense') return t.importeEUR.getValue() < 0;
        return true;
      });
    }

    // Filtro por fecha
    if (filters.dateFrom) {
      const fromDate = new EsDate(filters.dateFrom);
      filtered = filtered.filter(t => !t.fecha.isBefore(fromDate));
    }

    if (filters.dateTo) {
      const toDate = new EsDate(filters.dateTo);
      filtered = filtered.filter(t => !t.fecha.isAfter(toDate));
    }

    // Ordenar por fecha (más reciente primero)
    filtered.sort((a, b) => b.fecha.getValue().getTime() - a.fecha.getValue().getTime());

    return filtered;
  }

  getPaginatedTransactions(): PaginatedTransactions {
    const filtered = this.getFilteredTransactions();
    const total = filtered.length;
    const pageSize = this.state.ui.pageSize;
    const currentPage = this.state.ui.currentPage;
    const totalPages = Math.ceil(total / pageSize);
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const transactions = filtered.slice(startIndex, endIndex);

    return {
      transactions,
      total,
      page: currentPage,
      pageSize,
      totalPages
    };
  }

  getTransactionsByMonth(year: number, month: number): Transaction[] {
    return this.state.transactions.filter(t => t.isInMonth(year, month));
  }

  getTransactionsByCategory(categoryId: string): Transaction[] {
    return this.state.transactions.filter(t => t.categoriaId === categoryId);
  }

  getTotalPages(): number {
    const filtered = this.getFilteredTransactions();
    return Math.ceil(filtered.length / this.state.ui.pageSize);
  }

  getFilters(): TransactionFilters {
    return { ...this.state.ui.filters };
  }

  getCurrentPage(): number {
    return this.state.ui.currentPage;
  }

  getPageSize(): number {
    return this.state.ui.pageSize;
  }

  // Métodos privados
  private generateTransactionHash(transaction: Transaction): string {
    const fecha = transaction.fecha.format();
    const descripcion = transaction.descripcion.toLowerCase().trim();
    const importe = transaction.importeEUR.getValue().toString();
    return btoa(`${fecha}|${descripcion}|${importe}`).replace(/[+/=]/g, '');
  }

  private emitChange(): void {
    this.eventBus.emit('transactions/changed', {
      transactions: this.state.transactions,
      filtered: this.getFilteredTransactions(),
      paginated: this.getPaginatedTransactions()
    });
  }
}
