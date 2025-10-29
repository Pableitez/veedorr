import { Store } from '../../shared/types';
import { ROUTES } from '../../shared/constants';
import { createThemeToggle } from '../components/ThemeToggle';

export function createLayout(store: Store<any>, router: any): HTMLElement {
  const layout = document.createElement('div');
  layout.className = 'main-layout';
  layout.innerHTML = `
    <header class="header">
      <div class="header-content">
        <h1 class="logo">Veedor</h1>
        <nav class="nav">
          <button class="nav-button" data-route="${ROUTES.HOME}">Inicio</button>
          <button class="nav-button" data-route="${ROUTES.TRANSACTIONS}">Transacciones</button>
          <button class="nav-button" data-route="${ROUTES.BUDGETS}">Presupuestos</button>
          <button class="nav-button" data-route="${ROUTES.DASHBOARD}">Dashboard</button>
          ${import.meta.env.DEV ? '<button class="nav-button" data-route="/playground">Playground</button>' : ''}
        </nav>
        <div class="header-actions">
          <div id="theme-toggle-container"></div>
        </div>
      </div>
    </header>
    <main class="main">
      <div id="app-content" class="content"></div>
    </main>
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 Veedor - Finanzas Personales</p>
        <div class="footer-links">
          <a href="#/privacidad" class="footer-link">Privacidad</a>
          <a href="#/terminos" class="footer-link">Términos</a>
          <a href="#/cookies" class="footer-link">Cookies</a>
        </div>
      </div>
    </footer>
  `;
  
  // Aplicar estilos
  layout.style.cssText = `
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #0a0a0a;
    color: #ffffff;
  `;
  
  // Estilos del header
  const header = layout.querySelector('.header') as HTMLElement;
  header.style.cssText = `
    background-color: #1a1a1a;
    border-bottom: 1px solid #333;
    padding: 1rem 0;
  `;
  
  const headerContent = layout.querySelector('.header-content') as HTMLElement;
  headerContent.style.cssText = `
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;
  
  // Crear theme toggle
  const themeToggleContainer = layout.querySelector('#theme-toggle-container') as HTMLElement;
  if (themeToggleContainer) {
    const themeToggle = createThemeToggle();
    themeToggleContainer.appendChild(themeToggle);
  }
  
  const logo = layout.querySelector('.logo') as HTMLElement;
  logo.style.cssText = `
    font-size: 1.5rem;
    font-weight: bold;
    color: #4f46e5;
  `;
  
  const nav = layout.querySelector('.nav') as HTMLElement;
  nav.style.cssText = `
    display: flex;
    gap: 1rem;
  `;
  
  const headerActions = layout.querySelector('.header-actions') as HTMLElement;
  headerActions.style.cssText = `
    display: flex;
    align-items: center;
    gap: 1rem;
  `;
  
  // Estilos de los botones de navegación
  const navButtons = layout.querySelectorAll('.nav-button') as NodeListOf<HTMLButtonElement>;
  navButtons.forEach(button => {
    button.style.cssText = `
      background: none;
      border: 1px solid #333;
      color: #ffffff;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.2s;
    `;
    
    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = '#333';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = 'transparent';
    });
    
    button.addEventListener('click', () => {
      const route = button.getAttribute('data-route');
      if (route) {
        router.navigate(route);
      }
    });
  });
  
  // Estilos del main
  const main = layout.querySelector('.main') as HTMLElement;
  main.style.cssText = `
    flex: 1;
    padding: 2rem 0;
  `;
  
  const content = layout.querySelector('.content') as HTMLElement;
  content.style.cssText = `
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  `;
  
  // Estilos del footer
  const footer = layout.querySelector('.footer') as HTMLElement;
  footer.style.cssText = `
    background-color: #1a1a1a;
    border-top: 1px solid #333;
    padding: 1rem;
    color: #666;
  `;
  
  const footerContent = layout.querySelector('.footer-content') as HTMLElement;
  footerContent.style.cssText = `
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  `;
  
  const footerLinks = layout.querySelector('.footer-links') as HTMLElement;
  footerLinks.style.cssText = `
    display: flex;
    gap: 1.5rem;
  `;
  
  const footerLinkElements = layout.querySelectorAll('.footer-link') as NodeListOf<HTMLAnchorElement>;
  footerLinkElements.forEach(link => {
    link.style.cssText = `
      color: #666;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.2s;
    `;
    
    link.addEventListener('mouseenter', () => {
      link.style.color = '#ffffff';
    });
    
    link.addEventListener('mouseleave', () => {
      link.style.color = '#666';
    });
  });
  
  return layout;
}
