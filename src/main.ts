// Importar estilos
import './ui/styles.css';

// Hacer las funciones globales para los onclick
declare global {
  function showDashboard(): void;
  function showTransactions(): void;
  function showBudgets(): void;
}

// Función para inicializar tema
function initializeTheme() {
  const savedTheme = localStorage.getItem('veedor-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

// Función para crear la página de inicio
function createHomePage() {
  const page = document.createElement('div');
  page.className = 'home-page';
  page.innerHTML = `
    <div class="hero">
      <h1>Bienvenido a Veedor</h1>
      <p>Gestiona tus finanzas personales de forma sencilla y eficaz</p>
    </div>
    <div class="features">
      <div class="feature-card">
        <h3>📊 Dashboard</h3>
        <p>Visualiza el estado de tus finanzas con KPIs y gráficos</p>
        <button onclick="showDashboard()" class="btn">Ver Dashboard</button>
      </div>
      <div class="feature-card">
        <h3>💰 Transacciones</h3>
        <p>Registra y gestiona tus ingresos y gastos</p>
        <button onclick="showTransactions()" class="btn">Ver Transacciones</button>
      </div>
      <div class="feature-card">
        <h3>📋 Presupuestos</h3>
        <p>Controla tus gastos con presupuestos personalizados</p>
        <button onclick="showBudgets()" class="btn">Ver Presupuestos</button>
      </div>
    </div>
  `;
  
  // Aplicar estilos
  page.style.cssText = `
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  `;
  
  const hero = page.querySelector('.hero') as HTMLElement;
  hero.style.cssText = `
    text-align: center;
    margin-bottom: 3rem;
  `;
  
  const heroTitle = hero.querySelector('h1') as HTMLElement;
  heroTitle.style.cssText = `
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: var(--color-primary, #4f46e5);
  `;
  
  const heroText = hero.querySelector('p') as HTMLElement;
  heroText.style.cssText = `
    font-size: 1.2rem;
    color: var(--color-text-secondary, #a1a1aa);
  `;
  
  const features = page.querySelector('.features') as HTMLElement;
  features.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  `;
  
  const featureCards = page.querySelectorAll('.feature-card') as NodeListOf<HTMLElement>;
  featureCards.forEach(card => {
    card.style.cssText = `
      background-color: var(--color-surface, #1a1a1a);
      border: 1px solid var(--color-border, #333);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
    `;
    
    const title = card.querySelector('h3') as HTMLElement;
    title.style.cssText = `
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: var(--color-primary, #4f46e5);
    `;
    
    const text = card.querySelector('p') as HTMLElement;
    text.style.cssText = `
      color: var(--color-text-secondary, #a1a1aa);
      line-height: 1.6;
      margin-bottom: 1.5rem;
    `;
    
    const button = card.querySelector('.btn') as HTMLElement;
    button.style.cssText = `
      background-color: var(--color-primary, #4f46e5);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.2s;
    `;
    
    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = 'var(--color-primary-hover, #4338ca)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = 'var(--color-primary, #4f46e5)';
    });
  });
  
  return page;
}

// Funciones para los botones (globales)
window.showDashboard = function() {
  alert('Dashboard - Próximamente con gráficos y KPIs');
};

window.showTransactions = function() {
  alert('Transacciones - Próximamente con CRUD completo');
};

window.showBudgets = function() {
  alert('Presupuestos - Próximamente con gestión completa');
};

// Inicializar aplicación
function initApp() {
  console.log('Inicializando Veedor...');
  
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('No se encontró el elemento root');
    return;
  }

  // Inicializar tema
  initializeTheme();
  
  // Crear y montar la página
  const homePage = createHomePage();
  rootElement.innerHTML = '';
  rootElement.appendChild(homePage);
  
  console.log('Veedor cargado correctamente');
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
