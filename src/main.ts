import { createApp } from './ui/app';
import { store } from './infrastructure/store';
import { router } from './infrastructure/routing';
import { initializeTheme } from './ui/components/ThemeToggle';
import './ui/styles.css';

// Inicializar tema
initializeTheme();

// Inicializar la aplicación
const app = createApp(store, router);

const rootElement = document.getElementById('root');
if (rootElement) {
  rootElement.innerHTML = '';
  rootElement.appendChild(app);
} else {
  console.error('No se encontró el elemento root');
}