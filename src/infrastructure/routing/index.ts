import { HashRouter } from './hashRouter';
import { Router } from '../../shared/types';

// Crear instancia del router
export const router: Router = new HashRouter();

// Exportar tipos y clases
export { HashRouter };
export type { Router } from '../../shared/types';
