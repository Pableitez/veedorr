/**
 * Utilidades de validación para formato español
 */

/**
 * Valida y parsea una fecha en formato dd/mm/yyyy
 */
export function parseSpanishDate(dateString: string): Date | null {
  const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const match = dateString.match(regex);
  
  if (!match) {
    return null;
  }

  const [, day, month, year] = match;
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  // Validar rangos
  if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1900) {
    return null;
  }

  const date = new Date(yearNum, monthNum - 1, dayNum);
  
  // Verificar que la fecha es válida (no hay overflow)
  if (date.getDate() !== dayNum || date.getMonth() !== monthNum - 1 || date.getFullYear() !== yearNum) {
    return null;
  }

  return date;
}

/**
 * Formatea una fecha a formato español dd/mm/yyyy
 */
export function formatSpanishDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Valida y parsea un importe en formato español (coma decimal)
 */
export function parseSpanishAmount(amountString: string): number | null {
  // Remover espacios y validar formato
  const cleaned = amountString.trim();
  
  // Permitir signo negativo al inicio
  const signMatch = cleaned.match(/^-?/);
  const sign = signMatch ? signMatch[0] : '';
  const withoutSign = cleaned.replace(/^-?/, '');
  
  // Validar formato: números con coma decimal opcional
  const regex = /^(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)$/;
  if (!regex.test(withoutSign)) {
    return null;
  }

  // Convertir a número: reemplazar punto por nada (separador de miles) y coma por punto
  const normalized = withoutSign.replace(/\./g, '').replace(',', '.');
  const amount = parseFloat(normalized);
  
  if (isNaN(amount)) {
    return null;
  }

  return sign === '-' ? -amount : amount;
}

/**
 * Formatea un importe a formato español
 */
export function formatSpanishAmount(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true
  }).format(amount);
}

/**
 * Valida que un string no esté vacío
 */
export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || value.trim().length === 0) {
    return `${fieldName} es obligatorio`;
  }
  return null;
}

/**
 * Valida que un valor esté en un rango
 */
export function validateRange(value: number, min: number, max: number, fieldName: string): string | null {
  if (value < min || value > max) {
    return `${fieldName} debe estar entre ${min} y ${max}`;
  }
  return null;
}
