import { describe, it, expect, beforeEach } from 'vitest';
import { csvService } from '../../ui/services/CsvService';
import { Category } from '../../domain/entities/Category';

describe('CsvService', () => {
  let mockCategories: Category[];

  beforeEach(() => {
    mockCategories = [
      {
        id: 'cat-1',
        nombre: 'Comida',
        colorHex: '#ff6b6b',
        slug: 'comida',
        createdAt: new Date().toISOString()
      },
      {
        id: 'cat-2',
        nombre: 'Transporte',
        colorHex: '#4ecdc4',
        slug: 'transporte',
        createdAt: new Date().toISOString()
      }
    ];
  });

  describe('processCsvContent', () => {
    it('should process valid CSV content correctly', async () => {
      const csvContent = `fecha;descripcion;categoria;importe
15/01/2024;Compra en supermercado;Comida;-45,50
16/01/2024;Sueldo;;2500,00`;

      const result = await csvService.importFromFile(
        new File([csvContent], 'test.csv', { type: 'text/csv' }),
        mockCategories
      );

      expect(result.success).toBe(true);
      expect(result.imported).toBe(2);
      expect(result.duplicates).toBe(0);
      expect(result.errors).toBe(0);
      expect(result.preview).toHaveLength(2);
    });

    it('should handle invalid dates', async () => {
      const csvContent = `fecha;descripcion;categoria;importe
32/01/2024;Compra inválida;Comida;-45,50
15/13/2024;Otra compra;Comida;-30,00`;

      const result = await csvService.importFromFile(
        new File([csvContent], 'test.csv', { type: 'text/csv' }),
        mockCategories
      );

      expect(result.success).toBe(true);
      expect(result.imported).toBe(0);
      expect(result.errors).toBe(2);
      expect(result.errorDetails).toContain('Fila 2: Fecha inválida "32/01/2024". Use formato dd/mm/aaaa');
      expect(result.errorDetails).toContain('Fila 3: Fecha inválida "15/13/2024". Use formato dd/mm/aaaa');
    });

    it('should handle invalid amounts', async () => {
      const csvContent = `fecha;descripcion;categoria;importe
15/01/2024;Compra con importe inválido;Comida;abc
15/01/2024;Otra compra;Comida;123.456,78,90`;

      const result = await csvService.importFromFile(
        new File([csvContent], 'test.csv', { type: 'text/csv' }),
        mockCategories
      );

      expect(result.success).toBe(true);
      expect(result.imported).toBe(0);
      expect(result.errors).toBe(2);
      expect(result.errorDetails).toContain('Fila 2: Importe inválido "abc". Use formato español (ej: 1.234,56)');
      expect(result.errorDetails).toContain('Fila 3: Importe inválido "123.456,78,90". Use formato español (ej: 1.234,56)');
    });

    it('should handle missing descriptions', async () => {
      const csvContent = `fecha;descripcion;categoria;importe
15/01/2024;;Comida;-45,50
15/01/2024;   ;Comida;-30,00`;

      const result = await csvService.importFromFile(
        new File([csvContent], 'test.csv', { type: 'text/csv' }),
        mockCategories
      );

      expect(result.success).toBe(true);
      expect(result.imported).toBe(0);
      expect(result.errors).toBe(2);
      expect(result.errorDetails).toContain('Fila 2: Descripción es obligatoria');
      expect(result.errorDetails).toContain('Fila 3: Descripción es obligatoria');
    });

    it('should handle unknown categories', async () => {
      const csvContent = `fecha;descripcion;categoria;importe
15/01/2024;Compra con categoría desconocida;Categoría Inexistente;-45,50`;

      const result = await csvService.importFromFile(
        new File([csvContent], 'test.csv', { type: 'text/csv' }),
        mockCategories
      );

      expect(result.success).toBe(true);
      expect(result.imported).toBe(0);
      expect(result.errors).toBe(1);
      expect(result.errorDetails).toContain('Fila 2: Categoría "Categoría Inexistente" no encontrada');
    });

    it('should handle mixed valid and invalid rows', async () => {
      const csvContent = `fecha;descripcion;categoria;importe
15/01/2024;Compra válida;Comida;-45,50
32/01/2024;Fecha inválida;Comida;-30,00
16/01/2024;Otra compra válida;Transporte;-12,30`;

      const result = await csvService.importFromFile(
        new File([csvContent], 'test.csv', { type: 'text/csv' }),
        mockCategories
      );

      expect(result.success).toBe(true);
      expect(result.imported).toBe(2);
      expect(result.errors).toBe(1);
      expect(result.errorDetails).toContain('Fila 3: Fecha inválida "32/01/2024". Use formato dd/mm/aaaa');
    });

    it('should handle empty CSV content', async () => {
      const csvContent = '';

      const result = await csvService.importFromFile(
        new File([csvContent], 'test.csv', { type: 'text/csv' }),
        mockCategories
      );

      expect(result.success).toBe(false);
      expect(result.imported).toBe(0);
      expect(result.errors).toBe(1);
    });
  });

  describe('exportToCsv', () => {
    it('should export transactions to CSV format', () => {
      const transactions = [
        {
          id: 'tx-1',
          fecha: '2024-01-15T00:00:00.000Z',
          descripcion: 'Compra en supermercado',
          categoriaId: 'cat-1',
          importeEUR: -45.50,
          merchant: 'Supermercado ABC',
          createdAt: '2024-01-15T00:00:00.000Z'
        },
        {
          id: 'tx-2',
          fecha: '2024-01-16T00:00:00.000Z',
          descripcion: 'Sueldo',
          categoriaId: undefined,
          importeEUR: 2500.00,
          merchant: undefined,
          createdAt: '2024-01-16T00:00:00.000Z'
        }
      ];

      const csvContent = csvService.exportToCsv(transactions, mockCategories);

      expect(csvContent).toContain('fecha;descripcion;categoria;importe;comercio');
      expect(csvContent).toContain('15/1/2024;Compra en supermercado;Comida;-45,5;Supermercado ABC');
      expect(csvContent).toContain('16/1/2024;Sueldo;;2500;');
    });
  });

  describe('exportToJson', () => {
    it('should export transactions to JSON format', () => {
      const transactions = [
        {
          id: 'tx-1',
          fecha: '2024-01-15T00:00:00.000Z',
          descripcion: 'Compra en supermercado',
          categoriaId: 'cat-1',
          importeEUR: -45.50,
          merchant: 'Supermercado ABC',
          createdAt: '2024-01-15T00:00:00.000Z'
        }
      ];

      const jsonContent = csvService.exportToJson(transactions, mockCategories);
      const parsed = JSON.parse(jsonContent);

      expect(parsed.metadata).toBeDefined();
      expect(parsed.metadata.totalTransactions).toBe(1);
      expect(parsed.categories).toHaveLength(2);
      expect(parsed.transactions).toHaveLength(1);
      expect(parsed.transactions[0].categoria).toBe('Comida');
    });
  });

  describe('generateExampleCsv', () => {
    it('should generate valid example CSV', () => {
      const exampleCsv = csvService.generateExampleCsv();

      expect(exampleCsv).toContain('fecha;descripcion;categoria;importe');
      expect(exampleCsv).toContain('15/01/2024;Compra en supermercado;Comida;-45,50');
      expect(exampleCsv).toContain('16/01/2024;Sueldo;Ingresos;2500,00');
    });
  });
});
