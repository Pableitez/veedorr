// Configuración global para tests
import { expect, afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extender expect con matchers de testing-library
expect.extend(matchers);

// Limpiar localStorage antes de cada test
beforeEach(() => {
  localStorage.clear();
});

// Limpiar después de cada test
afterEach(() => {
  cleanup();
});
