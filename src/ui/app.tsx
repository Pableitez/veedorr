import { Store, Router } from '../shared/types';
import { createLayout } from './layouts/MainLayout';
import { createHomePage } from './pages/HomePage';
import { createTransactionsPage } from './pages/TransactionsPage';
import { createBudgetsPage } from './pages/BudgetsPage';
import { createDashboardPage } from './pages/DashboardPage';
import { createPlaygroundPage } from './pages/PlaygroundPage';
import { createPrivacyPage } from './pages/PrivacyPage';
import { createTermsPage } from './pages/TermsPage';
import { createCookiesPage } from './pages/CookiesPage';
import { ROUTES } from '../shared/constants';

export function createApp(store: Store<any>, router: Router): HTMLElement {
  // Crear el layout principal
  const layout = createLayout(store, router);
  
  // Configurar rutas
  router.addRoute({
    path: ROUTES.HOME,
    component: () => createHomePage(store),
    title: 'Inicio'
  });
  
  router.addRoute({
    path: ROUTES.TRANSACTIONS,
    component: () => createTransactionsPage(store),
    title: 'Transacciones'
  });
  
  router.addRoute({
    path: ROUTES.BUDGETS,
    component: () => createBudgetsPage(store),
    title: 'Presupuestos'
  });
  
  router.addRoute({
    path: ROUTES.DASHBOARD,
    component: () => createDashboardPage(store),
    title: 'Dashboard'
  });
  
  // Rutas legales
  router.addRoute({
    path: '/privacidad',
    component: () => createPrivacyPage(),
    title: 'Política de Privacidad'
  });
  
  router.addRoute({
    path: '/terminos',
    component: () => createTermsPage(),
    title: 'Términos de Uso'
  });
  
  router.addRoute({
    path: '/cookies',
    component: () => createCookiesPage(),
    title: 'Política de Cookies'
  });
  
  // Ruta de playground solo en desarrollo
  if (import.meta.env.DEV) {
    router.addRoute({
      path: '/playground',
      component: () => createPlaygroundPage(),
      title: 'Playground'
    });
  }
  
  // Configurar navegación
  router.onRouteChange((path: string) => {
    const route = router.getRoute(path);
    if (route) {
      const content = layout.querySelector('#app-content');
      if (content) {
        content.innerHTML = '';
        content.appendChild(route.component());
      }
      
      // Actualizar título de la página
      document.title = `${route.title} - Veedor`;
    }
  });
  
  return layout;
}
