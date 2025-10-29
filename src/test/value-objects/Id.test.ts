import { describe, it, expect } from 'vitest';
import { Id } from '../../domain/value-objects/Id';

describe('Id', () => {
  describe('Constructor', () => {
    it('should create Id with provided value', () => {
      const id = new Id('test-id');
      expect(id.toString()).toBe('test-id');
    });

    it('should generate random UUID when no value provided', () => {
      const id = new Id();
      expect(id.toString()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it('should throw error for empty string', () => {
      expect(() => new Id('')).toThrow('ID debe ser una cadena no vacía');
    });

    it('should throw error for null/undefined', () => {
      expect(() => new Id(null as any)).toThrow('ID debe ser una cadena no vacía');
      expect(() => new Id(undefined as any)).toThrow('ID debe ser una cadena no vacía');
    });
  });

  describe('Equality', () => {
    it('should compare equality correctly', () => {
      const id1 = new Id('test-id');
      const id2 = new Id('test-id');
      const id3 = new Id('different-id');
      
      expect(id1.equals(id2)).toBe(true);
      expect(id1.equals(id3)).toBe(false);
    });

    it('should compare with different instances', () => {
      const id1 = new Id('test-id');
      const id2 = new Id('test-id');
      
      expect(id1.equals(id2)).toBe(true);
    });
  });

  describe('Static methods', () => {
    it('should create Id from string', () => {
      const id = Id.fromString('test-id');
      expect(id.toString()).toBe('test-id');
    });

    it('should throw error for invalid string', () => {
      expect(() => Id.fromString('')).toThrow('ID debe ser una cadena no vacía');
    });
  });

  describe('String representation', () => {
    it('should return string value', () => {
      const id = new Id('test-id');
      expect(id.toString()).toBe('test-id');
    });
  });
});
