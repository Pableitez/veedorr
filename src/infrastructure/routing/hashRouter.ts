import { Router, Route } from '../../shared/types';

export class HashRouter implements Router {
  private routes: Map<string, Route> = new Map();
  private currentPath: string = '';
  private routeChangeCallbacks: Set<(path: string) => void> = new Set();

  constructor() {
    this.init();
  }

  private init(): void {
    // Escuchar cambios en el hash
    window.addEventListener('hashchange', () => {
      this.handleRouteChange();
    });

    // Manejar ruta inicial
    this.handleRouteChange();
  }

  private handleRouteChange(): void {
    const hash = window.location.hash.slice(1); // Remover el #
    const path = hash || '/'; // Ruta por defecto si no hay hash
    
    this.currentPath = path;
    this.routeChangeCallbacks.forEach(callback => callback(path));
  }

  navigate(path: string): void {
    if (path.startsWith('/')) {
      window.location.hash = path;
    } else {
      window.location.hash = '/' + path;
    }
  }

  getCurrentPath(): string {
    return this.currentPath;
  }

  onRouteChange(callback: (path: string) => void): void {
    this.routeChangeCallbacks.add(callback);
  }

  // Métodos adicionales para gestión de rutas
  addRoute(route: Route): void {
    this.routes.set(route.path, route);
  }

  getRoute(path: string): Route | undefined {
    return this.routes.get(path);
  }

  getAllRoutes(): Route[] {
    return Array.from(this.routes.values());
  }
}
