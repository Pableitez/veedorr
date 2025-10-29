import { Transaction, CreateTransactionData } from '../../domain/entities/Transaction';
import { Category, CreateCategoryData } from '../../domain/entities/Category';
import { Budget, CreateBudgetData } from '../../domain/entities/Budget';
import { EsDate } from '../../domain/value-objects/EsDate';
import { MoneyEUR } from '../../domain/value-objects/MoneyEUR';

export class DataSeeder {
  static generateCategories(): Category[] {
    const categoryData: CreateCategoryData[] = [
      { nombre: 'Alquiler', colorHex: '#FF6B6B' },
      { nombre: 'Comida', colorHex: '#4ECDC4' },
      { nombre: 'Transporte', colorHex: '#45B7D1' },
      { nombre: 'Suscripciones', colorHex: '#96CEB4' },
      { nombre: 'Ocio', colorHex: '#FFEAA7' },
      { nombre: 'Supermercado', colorHex: '#DDA0DD' },
      { nombre: 'Salud', colorHex: '#98D8C8' },
      { nombre: 'Ingresos', colorHex: '#6C5CE7' },
    ];

    return categoryData.map(data => new Category(data));
  }

  static generateTransactions(categories: Category[]): Transaction[] {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Crear fechas del mes actual
    const dates = this.generateDatesForMonth(currentYear, currentMonth);
    
    const transactionData: CreateTransactionData[] = [
      // Ingresos
      {
        fecha: dates[0],
        descripcion: 'Sueldo mensual',
        categoriaId: categories.find(c => c.nombre === 'Ingresos')?.id.toString(),
        importeEUR: 2500.00,
      },
      {
        fecha: dates[5],
        descripcion: 'Freelance proyecto web',
        categoriaId: categories.find(c => c.nombre === 'Ingresos')?.id.toString(),
        importeEUR: 800.00,
      },
      
      // Gastos fijos
      {
        fecha: dates[1],
        descripcion: 'Alquiler piso',
        categoriaId: categories.find(c => c.nombre === 'Alquiler')?.id.toString(),
        importeEUR: -800.00,
      },
      {
        fecha: dates[2],
        descripcion: 'Seguro de coche',
        categoriaId: categories.find(c => c.nombre === 'Transporte')?.id.toString(),
        importeEUR: -120.00,
      },
      
      // Comida y supermercado
      {
        fecha: dates[3],
        descripcion: 'Compra semanal Mercadona',
        categoriaId: categories.find(c => c.nombre === 'Supermercado')?.id.toString(),
        importeEUR: -85.50,
        merchant: 'Mercadona',
      },
      {
        fecha: dates[8],
        descripcion: 'Cena restaurante',
        categoriaId: categories.find(c => c.nombre === 'Comida')?.id.toString(),
        importeEUR: -45.80,
        merchant: 'Restaurante El Buen Sabor',
      },
      {
        fecha: dates[12],
        descripcion: 'Compra Carrefour',
        categoriaId: categories.find(c => c.nombre === 'Supermercado')?.id.toString(),
        importeEUR: -62.30,
        merchant: 'Carrefour',
      },
      
      // Transporte
      {
        fecha: dates[4],
        descripcion: 'Abono transporte mensual',
        categoriaId: categories.find(c => c.nombre === 'Transporte')?.id.toString(),
        importeEUR: -40.00,
      },
      {
        fecha: dates[10],
        descripcion: 'Gasolina',
        categoriaId: categories.find(c => c.nombre === 'Transporte')?.id.toString(),
        importeEUR: -55.00,
        merchant: 'Repsol',
      },
      
      // Suscripciones
      {
        fecha: dates[6],
        descripcion: 'Netflix',
        categoriaId: categories.find(c => c.nombre === 'Suscripciones')?.id.toString(),
        importeEUR: -15.99,
        merchant: 'Netflix',
      },
      {
        fecha: dates[7],
        descripcion: 'Spotify Premium',
        categoriaId: categories.find(c => c.nombre === 'Suscripciones')?.id.toString(),
        importeEUR: -9.99,
        merchant: 'Spotify',
      },
      
      // Ocio
      {
        fecha: dates[9],
        descripcion: 'Cine',
        categoriaId: categories.find(c => c.nombre === 'Ocio')?.id.toString(),
        importeEUR: -12.50,
        merchant: 'Cinesa',
      },
      {
        fecha: dates[11],
        descripcion: 'Libros Amazon',
        categoriaId: categories.find(c => c.nombre === 'Ocio')?.id.toString(),
        importeEUR: -28.90,
        merchant: 'Amazon',
      },
      
      // Salud
      {
        fecha: dates[13],
        descripcion: 'Farmacia',
        categoriaId: categories.find(c => c.nombre === 'Salud')?.id.toString(),
        importeEUR: -35.60,
        merchant: 'Farmacia Central',
      },
    ];

    return transactionData.map(data => new Transaction(data));
  }

  static generateBudgets(categories: Category[]): Budget[] {
    const budgetData: CreateBudgetData[] = [
      {
        categoriaId: categories.find(c => c.nombre === 'Alquiler')?.id.toString() || '',
        limiteMensualEUR: 800.00,
      },
      {
        categoriaId: categories.find(c => c.nombre === 'Comida')?.id.toString() || '',
        limiteMensualEUR: 300.00,
      },
      {
        categoriaId: categories.find(c => c.nombre === 'Transporte')?.id.toString() || '',
        limiteMensualEUR: 150.00,
      },
      {
        categoriaId: categories.find(c => c.nombre === 'Suscripciones')?.id.toString() || '',
        limiteMensualEUR: 50.00,
      },
      {
        categoriaId: categories.find(c => c.nombre === 'Ocio')?.id.toString() || '',
        limiteMensualEUR: 200.00,
      },
      {
        categoriaId: categories.find(c => c.nombre === 'Supermercado')?.id.toString() || '',
        limiteMensualEUR: 400.00,
      },
    ];

    return budgetData.map(data => new Budget(data));
  }

  private static generateDatesForMonth(year: number, month: number): Date[] {
    const dates: Date[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Generar fechas distribuidas a lo largo del mes
    const intervals = [1, 3, 5, 8, 10, 12, 15, 18, 20, 22, 25, 28, 30];
    
    for (const day of intervals) {
      if (day <= daysInMonth) {
        dates.push(new Date(year, month, day));
      }
    }
    
    return dates;
  }

  static async seedIfEmpty(
    transactionRepo: any,
    categoryRepo: any,
    budgetRepo: any
  ): Promise<{ categories: number; transactions: number; budgets: number }> {
    // Verificar si ya hay datos
    const existingCategories = await categoryRepo.findAll();
    if (existingCategories.length > 0) {
      return { categories: 0, transactions: 0, budgets: 0 };
    }

    // Generar datos de ejemplo
    const categories = this.generateCategories();
    const transactions = this.generateTransactions(categories);
    const budgets = this.generateBudgets(categories);

    // Guardar categorías primero
    for (const category of categories) {
      await categoryRepo.add(category);
    }

    // Guardar transacciones
    for (const transaction of transactions) {
      await transactionRepo.add(transaction);
    }

    // Guardar presupuestos
    for (const budget of budgets) {
      await budgetRepo.add(budget);
    }

    return {
      categories: categories.length,
      transactions: transactions.length,
      budgets: budgets.length,
    };
  }
}
