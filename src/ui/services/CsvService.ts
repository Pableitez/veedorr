import { CsvParser } from '../../infrastructure/csv/CsvParser';
import { Transaction, CreateTransactionData } from '../../domain/entities/Transaction';
import { Category } from '../../domain/entities/Category';
import { Id } from '../../domain/value-objects/Id';
import { parseSpanishDate, parseSpanishAmount } from '../../shared/utils/validation';

export interface ImportResult {
  success: boolean;
  imported: number;
  duplicates: number;
  errors: number;
  errorDetails: string[];
  preview?: any[];
}

export interface ExportOptions {
  format: 'csv' | 'json';
  dateFrom?: Date;
  dateTo?: Date;
  categoryId?: string;
}

class CsvService {
  private csvParser: CsvParser;

  constructor() {
    this.csvParser = new CsvParser();
  }

  /**
   * Procesa un archivo CSV y devuelve el resultado de la importación
   */
  async importFromFile(file: File, categories: Category[]): Promise<ImportResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const csvContent = e.target?.result as string;
        if (!csvContent) {
          resolve({
            success: false,
            imported: 0,
            duplicates: 0,
            errors: 1,
            errorDetails: ['No se pudo leer el archivo']
          });
          return;
        }

        try {
          const result = await this.processCsvContent(csvContent, categories);
          resolve(result);
        } catch (error) {
          resolve({
            success: false,
            imported: 0,
            duplicates: 0,
            errors: 1,
            errorDetails: [`Error al procesar CSV: ${error}`]
          });
        }
      };

      reader.onerror = () => {
        resolve({
          success: false,
          imported: 0,
          duplicates: 0,
          errors: 1,
          errorDetails: ['Error al leer el archivo']
        });
      };

      reader.readAsText(file, 'UTF-8');
    });
  }

  /**
   * Procesa el contenido CSV y valida las transacciones
   */
  private async processCsvContent(csvContent: string, categories: Category[]): Promise<ImportResult> {
    const result: ImportResult = {
      success: true,
      imported: 0,
      duplicates: 0,
      errors: 0,
      errorDetails: [],
      preview: []
    };

    try {
      // Parsear CSV
      const parseResult = this.csvParser.parse(csvContent);
      
      if (!parseResult.ok) {
        result.success = false;
        result.errors = parseResult.errors.length;
        result.errorDetails = parseResult.errors;
        return result;
      }

      const transactions = parseResult.transactions;
      result.preview = transactions.slice(0, 5); // Vista previa de 5 filas

      // Validar cada transacción
      const validTransactions: CreateTransactionData[] = [];
      const duplicates: string[] = [];
      const errors: string[] = [];

      for (let i = 0; i < transactions.length; i++) {
        const row = transactions[i];
        const rowNumber = i + 2; // +2 porque la primera fila es el header

        try {
          // Validar fecha
          const parsedDate = parseSpanishDate(row.fecha);
          if (!parsedDate) {
            errors.push(`Fila ${rowNumber}: Fecha inválida "${row.fecha}". Use formato dd/mm/aaaa`);
            continue;
          }

          // Validar importe
          const parsedAmount = parseSpanishAmount(row.importe);
          if (parsedAmount === null) {
            errors.push(`Fila ${rowNumber}: Importe inválido "${row.importe}". Use formato español (ej: 1.234,56)`);
            continue;
          }

          // Validar descripción
          if (!row.descripcion || row.descripcion.trim().length === 0) {
            errors.push(`Fila ${rowNumber}: Descripción es obligatoria`);
            continue;
          }

          // Buscar categoría por nombre
          let categoriaId: string | undefined;
          if (row.categoria && row.categoria.trim().length > 0) {
            const category = categories.find(cat => 
              cat.nombre.toLowerCase() === row.categoria.toLowerCase()
            );
            if (category) {
              categoriaId = category.id;
            } else {
              errors.push(`Fila ${rowNumber}: Categoría "${row.categoria}" no encontrada`);
              continue;
            }
          }

          // Crear hash para detectar duplicados
          const hash = this.createTransactionHash(row.fecha, row.descripcion, row.importe);
          
          // Verificar si ya existe (esto se haría contra la base de datos real)
          // Por ahora simulamos que no hay duplicados
          const isDuplicate = false; // TODO: Implementar verificación real

          if (isDuplicate) {
            duplicates.push(`Fila ${rowNumber}: Transacción duplicada`);
            continue;
          }

          // Crear transacción válida
          const transactionData: CreateTransactionData = {
            id: new Id().toString(),
            fecha: parsedDate.toISOString(),
            descripcion: row.descripcion.trim(),
            categoriaId,
            importeEUR: parsedAmount,
            merchant: row.merchant?.trim() || undefined,
            createdAt: new Date().toISOString()
          };

          validTransactions.push(transactionData);

        } catch (error) {
          errors.push(`Fila ${rowNumber}: Error inesperado - ${error}`);
        }
      }

      result.imported = validTransactions.length;
      result.duplicates = duplicates.length;
      result.errors = errors.length;
      result.errorDetails = [...duplicates, ...errors];

      return result;

    } catch (error) {
      result.success = false;
      result.errors = 1;
      result.errorDetails = [`Error al procesar CSV: ${error}`];
      return result;
    }
  }

  /**
   * Crea un hash único para una transacción basado en fecha, descripción e importe
   */
  private createTransactionHash(fecha: string, descripcion: string, importe: string): string {
    const normalized = `${fecha}|${descripcion.trim().toLowerCase()}|${importe}`;
    return btoa(normalized).replace(/[^a-zA-Z0-9]/g, '');
  }

  /**
   * Exporta transacciones a CSV
   */
  exportToCsv(transactions: Transaction[], categories: Category[]): string {
    const headers = ['fecha', 'descripcion', 'categoria', 'importe', 'comercio'];
    const csvLines = [headers.join(';')];

    transactions.forEach(transaction => {
      const category = categories.find(cat => cat.id === transaction.categoriaId);
      const fecha = new Date(transaction.fecha).toLocaleDateString('es-ES');
      const importe = transaction.importeEUR.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true
      });
      
      const row = [
        fecha,
        transaction.descripcion,
        category ? category.nombre : '',
        importe,
        transaction.merchant || ''
      ];
      
      csvLines.push(row.join(';'));
    });

    return csvLines.join('\n');
  }

  /**
   * Exporta transacciones a JSON
   */
  exportToJson(transactions: Transaction[], categories: Category[]): string {
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        totalTransactions: transactions.length,
        version: '1.0'
      },
      categories: categories.map(cat => ({
        id: cat.id,
        nombre: cat.nombre,
        colorHex: cat.colorHex,
        slug: cat.slug
      })),
      transactions: transactions.map(transaction => {
        const category = categories.find(cat => cat.id === transaction.categoriaId);
        return {
          id: transaction.id,
          fecha: transaction.fecha,
          descripcion: transaction.descripcion,
          categoria: category ? category.nombre : null,
          categoriaId: transaction.categoriaId,
          importeEUR: transaction.importeEUR,
          merchant: transaction.merchant,
          createdAt: transaction.createdAt
        };
      })
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Genera un archivo de ejemplo CSV
   */
  generateExampleCsv(): string {
    return this.csvParser.generateExampleCsv();
  }

  /**
   * Descarga un archivo
   */
  downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
}

export const csvService = new CsvService();
