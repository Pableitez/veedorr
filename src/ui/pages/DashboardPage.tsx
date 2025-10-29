import { Store } from '../../shared/types';
import { createCard } from '../components/Card';
import { createButton } from '../components/Button';
import { ROUTES } from '../../shared/constants';
import { MoneyEUR } from '../../domain/value-objects/MoneyEUR';
import { EsDate } from '../../domain/value-objects/EsDate';

export function createDashboardPage(store: Store<any>): HTMLElement {
  const container = document.createElement('div');
  container.className = 'dashboard-page';
  container.style.cssText = `
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  `;

  // Obtener datos del store
  const state = store.getState();
  const { transactions, categories, budgets } = state;

  // Calcular KPIs del mes actual
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyTransactions = transactions.filter((t: any) => {
    const tDate = new Date(t.fecha);
    return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
  });

  const totalExpenses = monthlyTransactions
    .filter((t: any) => t.importeEUR < 0)
    .reduce((sum: number, t: any) => sum + Math.abs(t.importeEUR), 0);

  const totalIncome = monthlyTransactions
    .filter((t: any) => t.importeEUR > 0)
    .reduce((sum: number, t: any) => sum + t.importeEUR, 0);

  const netSavings = totalIncome - totalExpenses;

  // Calcular gastos por categoría
  const expensesByCategory = new Map<string, number>();
  monthlyTransactions
    .filter((t: any) => t.importeEUR < 0 && t.categoriaId)
    .forEach((t: any) => {
      const category = categories.find((c: any) => c.id === t.categoriaId);
      const categoryName = category ? category.nombre : 'Sin categoría';
      const current = expensesByCategory.get(categoryName) || 0;
      expensesByCategory.set(categoryName, current + Math.abs(t.importeEUR));
    });

  // Top 5 categorías
  const topCategories = Array.from(expensesByCategory.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Crear HTML
  container.innerHTML = `
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <p class="dashboard-subtitle">Resumen financiero de ${new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(now)}</p>
    </div>

    <div class="kpis-grid">
      <div class="kpi-card" data-route="${ROUTES.TRANSACTIONS}?filter=expenses">
        <div class="kpi-icon">💰</div>
        <div class="kpi-content">
          <h3>Gastos del mes</h3>
          <div class="kpi-value">${new MoneyEUR(totalExpenses).format()}</div>
        </div>
      </div>

      <div class="kpi-card" data-route="${ROUTES.TRANSACTIONS}?filter=income">
        <div class="kpi-icon">📈</div>
        <div class="kpi-content">
          <h3>Ingresos del mes</h3>
          <div class="kpi-value">${new MoneyEUR(totalIncome).format()}</div>
        </div>
      </div>

      <div class="kpi-card" data-route="${ROUTES.TRANSACTIONS}">
        <div class="kpi-icon">💎</div>
        <div class="kpi-content">
          <h3>Ahorro neto</h3>
          <div class="kpi-value ${netSavings >= 0 ? 'positive' : 'negative'}">${new MoneyEUR(netSavings).format()}</div>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="chart-section">
        <h2>Gastos por categoría</h2>
        <div class="chart-container">
          <canvas id="category-chart" width="400" height="400"></canvas>
        </div>
      </div>

      <div class="top-categories-section">
        <h2>Top 5 categorías</h2>
        <div class="top-categories-list">
          ${topCategories.map(([category, amount], index) => `
            <div class="category-item" data-route="${ROUTES.TRANSACTIONS}?filter=category&value=${encodeURIComponent(category)}">
              <div class="category-rank">${index + 1}</div>
              <div class="category-info">
                <div class="category-name">${category}</div>
                <div class="category-amount">${new MoneyEUR(amount).format()}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Estilos
  const style = document.createElement('style');
  style.textContent = `
    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-subtitle {
      color: var(--text-secondary);
      margin-top: 0.5rem;
    }

    .kpis-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .kpi-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .kpi-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .kpi-icon {
      font-size: 2rem;
    }

    .kpi-content h3 {
      margin: 0 0 0.5rem 0;
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-weight: 500;
    }

    .kpi-value {
      font-size: 1.8rem;
      font-weight: bold;
      color: var(--text-primary);
    }

    .kpi-value.positive {
      color: #10b981;
    }

    .kpi-value.negative {
      color: #ef4444;
    }

    .dashboard-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .chart-section,
    .top-categories-section {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1.5rem;
    }

    .chart-section h2,
    .top-categories-section h2 {
      margin: 0 0 1.5rem 0;
      color: var(--text-primary);
    }

    .chart-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 300px;
    }

    .top-categories-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .category-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--bg-secondary);
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .category-item:hover {
      background: var(--bg-hover);
    }

    .category-rank {
      width: 32px;
      height: 32px;
      background: var(--primary-color);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 0.9rem;
    }

    .category-info {
      flex: 1;
    }

    .category-name {
      font-weight: 500;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }

    .category-amount {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .dashboard-content {
        grid-template-columns: 1fr;
      }
      
      .kpis-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
  container.appendChild(style);

  // Inicializar gráfico
  setTimeout(() => {
    initializeChart(expensesByCategory);
  }, 100);

  // Agregar event listeners para navegación
  const clickableElements = container.querySelectorAll('[data-route]');
  clickableElements.forEach(element => {
    element.addEventListener('click', (e) => {
      e.preventDefault();
      const route = (e.currentTarget as HTMLElement).dataset.route;
      if (route) {
        window.location.hash = route;
      }
    });
  });

  return container;
}

function initializeChart(expensesByCategory: Map<string, number>) {
  const canvas = document.getElementById('category-chart') as HTMLCanvasElement;
  if (!canvas || !window.Chart) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const data = Array.from(expensesByCategory.entries()).map(([category, amount]) => ({
    label: category,
    value: amount
  }));

  if (data.length === 0) {
    // Mostrar mensaje si no hay datos
    ctx.fillStyle = 'var(--text-secondary)';
    ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No hay gastos este mes', canvas.width / 2, canvas.height / 2);
    return;
  }

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.map(d => d.label),
      datasets: [{
        data: data.map(d => d.value),
        backgroundColor: [
          '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
          '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: 'var(--text-primary)',
            padding: 20,
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.parsed;
              const total = data.reduce((sum, d) => sum + d.value, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${context.label}: ${new MoneyEUR(value).format()} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}