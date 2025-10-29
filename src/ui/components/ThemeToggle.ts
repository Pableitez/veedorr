export interface ThemeToggleProps {
  className?: string;
  'aria-label'?: string;
}

export function createThemeToggle(props: ThemeToggleProps = {}): HTMLElement {
  const { className = '', 'aria-label': ariaLabel } = props;

  const toggle = document.createElement('button');
  toggle.className = `theme-toggle ${className}`.trim();
  toggle.setAttribute('aria-label', ariaLabel || 'Cambiar tema');
  toggle.setAttribute('type', 'button');

  // Obtener tema actual del localStorage o usar 'dark' por defecto
  const currentTheme = localStorage.getItem('veedor-theme') || 'dark';
  updateTheme(currentTheme);
  updateToggleIcon(toggle, currentTheme);

  // Event listener para cambiar tema
  toggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    updateTheme(newTheme);
    updateToggleIcon(toggle, newTheme);
    
    // Guardar en localStorage
    localStorage.setItem('veedor-theme', newTheme);
    
    // Emitir evento personalizado
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: newTheme } 
    }));
  });

  // Aplicar estilos
  applyThemeToggleStyles(toggle);

  return toggle;
}

function updateTheme(theme: string): void {
  document.documentElement.setAttribute('data-theme', theme);
}

function updateToggleIcon(toggle: HTMLElement, theme: string): void {
  const icon = theme === 'dark' ? '☀️' : '🌙';
  toggle.textContent = icon;
}

function applyThemeToggleStyles(toggle: HTMLElement): void {
  const styles = `
    background: none;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    padding: var(--space-2);
    font-size: var(--font-size-lg);
    cursor: pointer;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
  `;

  const hoverStyles = `
    &:hover {
      background-color: var(--color-surface-hover);
      border-color: var(--color-primary);
    }
  `;

  const focusStyles = `
    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  `;

  toggle.style.cssText = styles;

  // Crear estilos CSS dinámicos
  const style = document.createElement('style');
  style.textContent = `
    .theme-toggle {
      ${hoverStyles}
      ${focusStyles}
    }
  `;
  document.head.appendChild(style);
}

// Función para inicializar el tema al cargar la página
export function initializeTheme(): void {
  const savedTheme = localStorage.getItem('veedor-theme') || 'dark';
  updateTheme(savedTheme);
}

// Función para obtener el tema actual
export function getCurrentTheme(): 'dark' | 'light' {
  return (document.documentElement.getAttribute('data-theme') as 'dark' | 'light') || 'dark';
}

// Función para cambiar tema programáticamente
export function setTheme(theme: 'dark' | 'light'): void {
  updateTheme(theme);
  localStorage.setItem('veedor-theme', theme);
  
  // Emitir evento personalizado
  window.dispatchEvent(new CustomEvent('themeChanged', { 
    detail: { theme } 
  }));
}

// Función para alternar tema programáticamente
export function toggleTheme(): 'dark' | 'light' {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  return newTheme;
}

// Función para suscribirse a cambios de tema
export function onThemeChange(callback: (theme: 'dark' | 'light') => void): () => void {
  const handler = (event: CustomEvent) => {
    callback(event.detail.theme);
  };
  
  window.addEventListener('themeChanged', handler as EventListener);
  
  // Devolver función de cleanup
  return () => {
    window.removeEventListener('themeChanged', handler as EventListener);
  };
}
