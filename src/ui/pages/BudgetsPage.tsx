import { Store } from '../../shared/types';
import { createCard } from '../components/Card';
import { createButton } from '../components/Button';
import { createTable } from '../components/Table';
import { createModal } from '../components/Modal';
import { createProgress } from '../components/Progress';
import { createBadge } from '../components/Badge';
import { toastService } from '../services/ToastService';
import { parseSpanishAmount, formatSpanishAmount, validateRequired, validateRange } from '../../shared/utils/validation';
import { MoneyEUR } from '../../domain/value-objects/MoneyEUR';
import { Id } from '../../domain/value-objects/Id';

export function createBudgetsPage(store: Store<any>): HTMLElement {
  const container = document.createElement('div');
  container.className = 'budgets-page';
  container.style.cssText = `
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  `;

  let isEditing = false;
  let editingBudgetId: string | null = null;

  // Obtener datos del store
  const state = store.getState();
  const { budgets, categories, transactions } = state;

  // Calcular gastos del mes actual por categoría
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyTransactions = transactions.filter((t: any) => {
    const tDate = new Date(t.fecha);
    return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
  });

  const expensesByCategory = new Map<string, number>();
  monthlyTransactions
    .filter((t: any) => t.importeEUR < 0 && t.categoriaId)
    .forEach((t: any) => {
      const current = expensesByCategory.get(t.categoriaId) || 0;
      expensesByCategory.set(t.categoriaId, current + Math.abs(t.importeEUR));
    });

  function render() {
    container.innerHTML = `
      <div class="budgets-header">
        <h1>Presupuestos</h1>
        <div class="header-actions">
          <button id="add-budget-btn" class="btn btn-primary">
            ➕ Nuevo Presupuesto
          </button>
        </div>
      </div>

      <div class="budgets-content">
        <div class="budgets-info">
          <p>Gestiona tus límites de gasto mensual por categoría</p>
        </div>

        <div class="budgets-table">
          ${createBudgetsTable()}
        </div>
      </div>
    `;

    addEventListeners();
  }

  function createBudgetsTable() {
    if (budgets.length === 0) {
      return `
        <div class="empty-state">
          <p>No tienes presupuestos configurados</p>
          <button id="create-first-budget" class="btn btn-primary">
            Crear mi primer presupuesto
          </button>
        </div>
      `;
    }

    const tableData = budgets.map((budget: any) => {
      const category = categories.find((c: any) => c.id === budget.categoriaId);
      const spent = expensesByCategory.get(budget.categoriaId) || 0;
      const limit = budget.limiteMensualEUR;
      const percentage = limit > 0 ? (spent / limit) * 100 : 0;
      
      let status = 'ok';
      let statusText = 'Bien';
      if (percentage >= 100) {
        status = 'danger';
        statusText = 'Excedido';
      } else if (percentage >= 80) {
        status = 'warn';
        statusText = 'Cuidado';
      }

      return {
        id: budget.id,
        categoria: category ? category.nombre : 'Categoría no encontrada',
        limite: new MoneyEUR(limit).format(),
        gastado: new MoneyEUR(spent).format(),
        porcentaje: `${percentage.toFixed(1)}%`,
        progreso: createProgress({
          value: Math.min(percentage, 100),
          max: 100,
          className: `progress-${status}`
        }),
        estado: createBadge({
          text: statusText,
          variant: status as any
        }),
        actions: `
          <button class="btn-icon edit-btn" data-id="${budget.id}" title="Editar">
            ✏️
          </button>
          <button class="btn-icon delete-btn" data-id="${budget.id}" title="Eliminar">
            🗑️
          </button>
        `
      };
    });

    return createTable({
      headers: ['Categoría', 'Límite Mensual', 'Gastado', 'Porcentaje', 'Progreso', 'Estado', 'Acciones'],
      data: tableData,
      className: 'budgets-table'
    });
  }

  function addEventListeners() {
    // Botón principal
    const addBudgetBtn = container.querySelector('#add-budget-btn');
    const createFirstBudgetBtn = container.querySelector('#create-first-budget');

    addBudgetBtn?.addEventListener('click', () => {
      showBudgetModal();
    });

    createFirstBudgetBtn?.addEventListener('click', () => {
      showBudgetModal();
    });

    // Acciones de presupuestos
    const editButtons = container.querySelectorAll('.edit-btn');
    const deleteButtons = container.querySelectorAll('.delete-btn');

    editButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.id;
        if (id) {
          editBudget(id);
        }
      });
    });

    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.id;
        if (id) {
          deleteBudget(id);
        }
      });
    });
  }

  function showBudgetModal(budget?: any) {
    isEditing = !!budget;
    editingBudgetId = budget?.id || null;

    const modal = createModal({
      title: isEditing ? 'Editar Presupuesto' : 'Nuevo Presupuesto',
      content: createBudgetForm(budget),
      onClose: () => {
        modal.remove();
      }
    });

    document.body.appendChild(modal);

    // Event listeners del formulario
    const form = modal.querySelector('#budget-form') as HTMLFormElement;
    const submitBtn = modal.querySelector('#submit-budget') as HTMLButtonElement;

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      handleBudgetSubmit(form);
    });

    submitBtn?.addEventListener('click', () => {
      form?.requestSubmit();
    });
  }

  function createBudgetForm(budget?: any) {
    // Filtrar categorías que ya tienen presupuesto (excepto la que estamos editando)
    const categoriesWithBudget = budgets
      .filter((b: any) => b.id !== editingBudgetId)
      .map((b: any) => b.categoriaId);
    
    const availableCategories = categories.filter((cat: any) => 
      !categoriesWithBudget.includes(cat.id)
    );

    return `
      <form id="budget-form" class="budget-form">
        <div class="form-group">
          <label for="budget-category">Categoría *</label>
          <select id="budget-category" name="categoriaId" required>
            <option value="">Seleccionar categoría</option>
            ${availableCategories.map((cat: any) => `
              <option value="${cat.id}" ${budget?.categoriaId === cat.id ? 'selected' : ''}>
                ${cat.nombre}
              </option>
            `).join('')}
          </select>
          ${availableCategories.length === 0 && !isEditing ? `
            <p class="form-help">Todas las categorías ya tienen presupuesto asignado</p>
          ` : ''}
        </div>

        <div class="form-group">
          <label for="budget-limit">Límite Mensual (€) *</label>
          <input type="text" id="budget-limit" name="limiteMensualEUR" 
                 placeholder="0,00" 
                 value="${budget ? formatSpanishAmount(budget.limiteMensualEUR) : ''}" 
                 required>
          <p class="form-help">Introduce el límite mensual en euros</p>
        </div>

        <div class="form-actions">
          <button type="button" id="cancel-budget" class="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" id="submit-budget" class="btn btn-primary" 
                  ${availableCategories.length === 0 && !isEditing ? 'disabled' : ''}>
            ${isEditing ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    `;
  }

  function handleBudgetSubmit(form: HTMLFormElement) {
    const formData = new FormData(form);
    const data = {
      categoriaId: formData.get('categoriaId') as string,
      limiteMensualEUR: formData.get('limiteMensualEUR') as string
    };

    // Validaciones
    const categoryError = validateRequired(data.categoriaId, 'Categoría');
    if (categoryError) {
      toastService.error('Error de validación', categoryError);
      return;
    }

    const limitError = validateRequired(data.limiteMensualEUR, 'Límite mensual');
    if (limitError) {
      toastService.error('Error de validación', limitError);
      return;
    }

    // Parsear importe
    const parsedAmount = parseSpanishAmount(data.limiteMensualEUR);
    if (parsedAmount === null) {
      toastService.error('Error de validación', 'Formato de importe inválido. Use formato español (ej: 1.234,56)');
      return;
    }

    // Validar que el importe sea positivo
    const amountRangeError = validateRange(parsedAmount, 0.01, 999999.99, 'Límite mensual');
    if (amountRangeError) {
      toastService.error('Error de validación', amountRangeError);
      return;
    }

    // Crear o actualizar presupuesto
    const budgetData = {
      id: isEditing ? editingBudgetId : new Id().toString(),
      categoriaId: data.categoriaId,
      limiteMensualEUR: parsedAmount,
      createdAt: isEditing ? undefined : new Date().toISOString()
    };

    try {
      if (isEditing) {
        store.dispatch({ type: 'budgets/update', payload: budgetData });
        toastService.success('Presupuesto actualizado', 'El presupuesto se ha actualizado correctamente');
      } else {
        store.dispatch({ type: 'budgets/add', payload: budgetData });
        toastService.success('Presupuesto creado', 'El presupuesto se ha creado correctamente');
      }

      // Cerrar modal y actualizar vista
      const modal = form.closest('.modal') as HTMLElement;
      modal?.remove();
      render();
    } catch (error) {
      toastService.error('Error', 'No se pudo guardar el presupuesto');
    }
  }

  function editBudget(id: string) {
    const budget = budgets.find((b: any) => b.id === id);
    if (budget) {
      showBudgetModal(budget);
    }
  }

  function deleteBudget(id: string) {
    const budget = budgets.find((b: any) => b.id === id);
    const category = budget ? categories.find((c: any) => c.id === budget.categoriaId) : null;
    const categoryName = category ? category.nombre : 'este presupuesto';

    if (confirm(`¿Estás seguro de que quieres eliminar el presupuesto de ${categoryName}?`)) {
      try {
        store.dispatch({ type: 'budgets/remove', payload: { id } });
        toastService.success('Presupuesto eliminado', 'El presupuesto se ha eliminado correctamente');
        render();
      } catch (error) {
        toastService.error('Error', 'No se pudo eliminar el presupuesto');
      }
    }
  }

  // Inicializar
  render();

  return container;
}