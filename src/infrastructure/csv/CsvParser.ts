import { Transaction, CreateTransactionData } from '../../domain/entities/Transaction';
import { EsDate } from '../../domain/value-objects/EsDate';
import { MoneyEUR } from '../../domain/value-objects/MoneyEUR';

export interface CsvParseResult {
  ok: Transaction[];
  duplicados: number;
  errores: CsvParseError[];
}

export interface CsvParseError {
  linea: number;
  error: string;
  datos?: string;
}

export class CsvParser {
  private readonly expectedHeaders = ['fecha', 'descripcion', 'categoria', 'importe'];
  private readonly separator = ';';

  parse(csvContent: string): CsvParseResult {
    const lines = csvContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    if (lines.length === 0) {
      return { ok: [], duplicados: 0, errores: [] };
    }

    // Verificar cabeceras
    const headers = this.parseLine(lines[0]);
    const headerError = this.validateHeaders(headers);
    if (headerError) {
      return {
        ok: [],
        duplicados: 0,
        errores: [{ linea: 1, error: headerError }]
      };
    }

    const transactions: Transaction[] = [];
    const errores: CsvParseError[] = [];
    const seenHashes = new Set<string>();
    let duplicados = 0;

    // Procesar cada línea de datos
    for (let i = 1; i < lines.length; i++) {
      const lineNumber = i + 1;
      const line = lines[i];

      try {
        const transaction = this.parseTransactionLine(line, lineNumber);
        const hash = this.generateTransactionHash(transaction);
        
        if (seenHashes.has(hash)) {
          duplicados++;
          continue;
        }
        
        seenHashes.add(hash);
        transactions.push(transaction);
      } catch (error) {
        errores.push({
          linea: lineNumber,
          error: error instanceof Error ? error.message : 'Error desconocido',
          datos: line
        });
      }
    }

    return {
      ok: transactions,
      duplicados,
      errores
    };
  }

  private parseLine(line: string): string[] {
    return line.split(this.separator).map(cell => cell.trim());
  }

  private validateHeaders(headers: string[]): string | null {
    if (headers.length !== this.expectedHeaders.length) {
      return `Se esperaban ${this.expectedHeaders.length} columnas, se encontraron ${headers.length}`;
    }

    for (let i = 0; i < this.expectedHeaders.length; i++) {
      if (headers[i].toLowerCase() !== this.expectedHeaders[i]) {
        return `Columna ${i + 1} debe ser "${this.expectedHeaders[i]}", se encontró "${headers[i]}"`;
      }
    }

    return null;
  }

  private parseTransactionLine(line: string, lineNumber: number): Transaction {
    const cells = this.parseLine(line);
    
    if (cells.length !== this.expectedHeaders.length) {
      throw new Error(`Línea debe tener ${this.expectedHeaders.length} columnas, se encontraron ${cells.length}`);
    }

    const [fechaStr, descripcion, categoria, importeStr] = cells;

    // Parsear fecha
    let fecha: Date;
    try {
      const esDate = EsDate.fromString(fechaStr);
      fecha = esDate.getValue();
    } catch (error) {
      throw new Error(`Fecha inválida: ${fechaStr}. Use formato dd/mm/yyyy`);
    }

    // Validar descripción
    if (!descripcion || descripcion.length === 0) {
      throw new Error('Descripción es obligatoria');
    }

    if (descripcion.length > 255) {
      throw new Error('Descripción no puede exceder 255 caracteres');
    }

    // Parsear importe
    let importe: number;
    try {
      const money = MoneyEUR.fromString(importeStr);
      importe = money.getValue();
    } catch (error) {
      throw new Error(`Importe inválido: ${importeStr}. Use formato con coma decimal (ej: 123,45)`);
    }

    // Crear transacción
    const transactionData: CreateTransactionData = {
      fecha,
      descripcion: descripcion.trim(),
      categoriaId: categoria.trim() || undefined,
      importeEUR: importe,
    };

    return new Transaction(transactionData);
  }

  private generateTransactionHash(transaction: Transaction): string {
    const fecha = transaction.fecha.format();
    const descripcion = transaction.descripcion.toLowerCase().trim();
    const importe = transaction.importeEUR.getValue().toString();
    return btoa(`${fecha}|${descripcion}|${importe}`).replace(/[+/=]/g, '');
  }

  // Método para generar un CSV de ejemplo
  static generateExampleCsv(): string {
    const separator = ';';
    const headers = ['fecha', 'descripcion', 'categoria', 'importe'];
    const examples = [
      ['15/01/2024', 'Compra en supermercado', 'Comida', '-45,50'],
      ['16/01/2024', 'Sueldo', 'Ingresos', '2500,00'],
      ['17/01/2024', 'Alquiler', 'Vivienda', '-800,00'],
      ['18/01/2024', 'Transporte público', 'Transporte', '-12,30'],
      ['19/01/2024', 'Netflix', 'Suscripciones', '-15,99'],
    ];

    const csvLines = [headers.join(separator)];
    csvLines.push(...examples.map(row => row.join(separator)));

    return csvLines.join('\n');
  }
}
