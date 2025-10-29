import { Store } from '../../shared/types';

export function createHomePage(store: Store<any>): HTMLElement {
  const page = document.createElement('div');
  page.className = 'home-page';
  page.innerHTML = `
    <div class="hero">
      <h1>Bienvenido a Veedor</h1>
      <p>Gestiona tus finanzas personales de forma sencilla y eficaz</p>
    </div>
    <div class="features">
      <div class="feature-card">
        <h3>Transacciones</h3>
        <p>Registra y gestiona tus ingresos y gastos</p>
      </div>
      <div class="feature-card">
        <h3>Presupuestos</h3>
        <p>Controla tus gastos con presupuestos personalizados</p>
      </div>
      <div class="feature-card">
        <h3>Dashboard</h3>
        <p>Visualiza el estado de tus finanzas</p>
      </div>
    </div>
  `;
  
  // Aplicar estilos
  page.style.cssText = `
    padding: 2rem 0;
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
    color: #4f46e5;
  `;
  
  const heroText = hero.querySelector('p') as HTMLElement;
  heroText.style.cssText = `
    font-size: 1.2rem;
    color: #666;
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
      background-color: #1a1a1a;
      border: 1px solid #333;
      border-radius: 0.5rem;
      padding: 2rem;
      text-align: center;
    `;
    
    const title = card.querySelector('h3') as HTMLElement;
    title.style.cssText = `
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #4f46e5;
    `;
    
    const text = card.querySelector('p') as HTMLElement;
    text.style.cssText = `
      color: #666;
      line-height: 1.6;
    `;
  });
  
  return page;
}
