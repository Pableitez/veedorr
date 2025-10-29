import { describe, it, expect } from 'vitest';
import { CsvParser } from '../../infrastructure/csv/CsvParser';

describe('CsvParser', () => {
  let parser: CsvParser;

  beforeEach(() => {
    parser = new CsvParser();
  });

  describe('parse', () => {
    it('should parse valid CSV correctly', () => {
      const csvContent = `fecha;descripcion;categoria;importe
15/01/2024;Compra supermercado;Comida;-45,50
16/01/2024;Sueldo;Ingresos;2500,00`;

      const result = parser.parse(csvContent);

      expect(result.ok).toHaveLength(2);
      expect(result.duplicados).toBe(0);
      expect(result.errores).toHaveLength(0);
      
      expect(result.ok[0].descripcion).toBe('Compra supermercado');
      expect(result.ok[0].importeEUR.getValue()).toBe(-45.50);
      expect(result.ok[1].descripcion).toBe('Sueldo');
      expect(result.ok[1].importeEUR.getValue()).toBe(2500.00);
    });

    it('should handle empty CSV', () => {
      const result = parser.parse('');
      
      expect(result.ok).toHaveLength(0);
      expect(result.duplicados).toBe(0);
      expect(result.errores).toHaveLength(0);
    });

    it('should validate headers correctly', () => {
      const csvContent = `fecha;descripcion;categoria;importe;extra
15/01/2024;Test;Comida;100,00;extra`;

      const result = parser.parse(csvContent);

      expect(result.ok).toHaveLength(0);
      expect(result.errores).toHaveLength(1);
      expect(result.errores[0].error).toContain('Se esperaban 4 columnas');
    });

    it('should validate header names', () => {
      const csvContent = `date;description;category;amount
15/01/2024;Test;Comida;100,00`;

      const result = parser.parse(csvContent);

      expect(result.ok).toHaveLength(0);
      expect(result.errores).toHaveLength(1);
      expect(result.errores[0].error).toContain('debe ser "fecha"');
    });

    it('should handle invalid dates', () => {
      const csvContent = `fecha;descripcion;categoria;importe
32/01/2024;Test;Comida;100,00`;

      const result = parser.parse(csvContent);

      expect(result.ok).toHaveLength(0);
      expect(result.errores).toHaveLength(1);
      expect(result.errores[0].error).toContain('Fecha inválida');
    });

    it('should handle invalid amounts', () => {
      const csvContent = `fecha;descripcion;categoria;importe
15/01/2024;Test;Comida;invalid`;

      const result = parser.parse(csvContent);

      expect(result.ok).toHaveLength(0);
      expect(result.errores).toHaveLength(1);
      expect(result.errores[0].error).toContain('Importe inválido');
    });

    it('should handle missing description', () => {
      const csvContent = `fecha;descripcion;categoria;importe
15/01/2024;;Comida;100,00`;

      const result = parser.parse(csvContent);

      expect(result.ok).toHaveLength(0);
      expect(result.errores).toHaveLength(1);
      expect(result.errores[0].error).toContain('Descripción es obligatoria');
    });

    it('should handle description too long', () => {
      const longDescription = 'a'.repeat(256);
      const csvContent = `fecha;descripcion;categoria;importe
15/01/2024;${longDescription};Comida;100,00`;

      const result = parser.parse(csvContent);

      expect(result.ok).toHaveLength(0);
      expect(result.errores).toHaveLength(1);
      expect(result.errores[0].error).toContain('no puede exceder 255 caracteres');
    });

    it('should handle different amount formats', () => {
      const csvContent = `fecha;descripcion;categoria;importe
15/01/2024;Test 1;Comida;1234,56
16/01/2024;Test 2;Comida;-789,12
17/01/2024;Test 3;Comida;0,00`;

      const result = parser.parse(csvContent);

      expect(result.ok).toHaveLength(3);
      expect(result.ok[0].importeEUR.getValue()).toBe(1234.56);
      expect(result.ok[1].importeEUR.getValue()).toBe(-789.12);
      expect(result.ok[2].importeEUR.getValue()).toBe(0.00);
    });

    it('should detect duplicate transactions', () => {
      const csvContent = `fecha;descripcion;categoria;importe
15/01/2024;Test;Comida;100,00
15/01/2024;Test;Comida;100,00`;

      const result = parser.parse(csvContent);

      expect(result.ok).toHaveLength(1);
      expect(result.duplicados).toBe(1);
    });

    it('should handle mixed valid and invalid rows', () => {
      const csvContent = `fecha;descripcion;categoria;importe
15/01/2024;Valid transaction;Comida;100,00
32/01/2024;Invalid date;Comida;200,00
16/01/2024;Another valid;Comida;300,00`;

      const result = parser.parse(csvContent);

      expect(result.ok).toHaveLength(2);
      expect(result.errores).toHaveLength(1);
      expect(result.duplicados).toBe(0);
    });
  });

  describe('generateExampleCsv', () => {
    it('should generate valid example CSV', () => {
      const example = CsvParser.generateExampleCsv();
      
      expect(example).toContain('fecha;descripcion;categoria;importe');
      expect(example).toContain('15/01/2024;Compra en supermercado;Comida;-45,50');
      expect(example).toContain('16/01/2024;Sueldo;Ingresos;2500,00');
    });

    it('should generate parseable CSV', () => {
      const example = CsvParser.generateExampleCsv();
      const result = parser.parse(example);
      
      expect(result.ok.length).toBeGreaterThan(0);
      expect(result.errores).toHaveLength(0);
    });
  });
});
