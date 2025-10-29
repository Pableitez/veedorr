// Constantes de la aplicación
export const APP_NAME = 'Veedor';
export const APP_VERSION = '0.1.0';

// Configuración por defecto
export const DEFAULT_SETTINGS = {
  currency: 'EUR' as const,
  dateFormat: 'dd/mm/yyyy' as const,
  theme: 'dark' as const,
  language: 'es-ES' as const,
};

// Categorías predefinidas
export const TRANSACTION_CATEGORIES = [
  'Alimentación',
  'Transporte',
  'Vivienda',
  'Salud',
  'Entretenimiento',
  'Educación',
  'Ropa',
  'Otros',
] as const;

export const BUDGET_CATEGORIES = [
  'Alimentación',
  'Transporte',
  'Vivienda',
  'Salud',
  'Entretenimiento',
  'Educación',
  'Ropa',
  'Ahorro',
  'Otros',
] as const;

// Rutas de la aplicación
export const ROUTES = {
  HOME: '/',
  TRANSACTIONS: '/transactions',
  BUDGETS: '/budgets',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
} as const;

// Claves de LocalStorage
export const STORAGE_KEYS = {
  TRANSACTIONS: 'veedor_transactions',
  BUDGETS: 'veedor_budgets',
  SETTINGS: 'veedor_settings',
} as const;

// Configuración de fechas en español
export const DATE_CONFIG = {
  locale: 'es-ES',
  timeZone: 'Europe/Madrid',
} as const;

// Configuración de moneda
export const CURRENCY_CONFIG = {
  code: 'EUR',
  symbol: '€',
  locale: 'es-ES',
} as const;
