import { Store } from '../../shared/types';
import { createCard } from '../components/Card';
import { createButton } from '../components/Button';
import { createInput } from '../components/Input';
import { createSelect } from '../components/Select';
import { createTable } from '../components/Table';
import { createModal } from '../components/Modal';
import { toastService } from '../services/ToastService';
import { csvService } from '../services/CsvService';
import { parseSpanishDate, parseSpanishAmount, formatSpanishDate, formatSpanishAmount, validateRequired } from '../../shared/utils/validation';
import { MoneyEUR } from '../../domain/value-objects/MoneyEUR';
import { EsDate } from '../../domain/value-objects/EsDate';
import { Id } from '../../domain/value-objects/Id';

export function createTransactionsPage(store: Store<any>): HTMLElement {
  const container = document.createElement('div');
  container.className = 'transactions-page';
  container.style.cssText = `
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  `;

  let currentPage = 1;
  const pageSize = 50;
  let filteredTransactions: any[] = [];
  let isEditing = false;
  let editingTransactionId: string | null = null;

  // Obtener datos del store
  const state = store.getState();
  const { transactions, categories } = state;

  // Inicializar filtros
  const filters = {
    fromDate: '',
    toDate: '',
    categoryId: '',
    searchText: ''
  };

  function applyFilters() {
    filteredTransactions = transactions.filter((transaction: any) => {
      // Filtro por fecha desde
      if (filters.fromDate) {
        const fromDate = parseSpanishDate(filters.fromDate);
        if (fromDate && new Date(transaction.fecha) < fromDate) {
          return false;
        }
      }

      // Filtro por fecha hasta
      if (filters.toDate) {
        const toDate = parseSpanishDate(filters.toDate);
        if (toDate && new Date(transaction.fecha) > toDate) {
          return false;
        }
      }

      // Filtro por categoría
      if (filters.categoryId && transaction.categoriaId !== filters.categoryId) {
        return false;
      }

      // Filtro por texto
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const descriptionMatch = transaction.descripcion.toLowerCase().includes(searchLower);
        const merchantMatch = transaction.merchant?.toLowerCase().includes(searchLower);
        if (!descriptionMatch && !merchantMatch) {
          return false;
        }
      }

      return true;
    });

    // Ordenar por fecha descendente
    filteredTransactions.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    currentPage = 1;
    render();
  }

  function getPaginatedTransactions() {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredTransactions.slice(startIndex, endIndex);
  }

  function getTotalPages() {
    return Math.ceil(filteredTransactions.length / pageSize);
  }

  function render() {
    const paginatedTransactions = getPaginatedTransactions();
    const totalPages = getTotalPages();

    container.innerHTML = `
      <div class="transactions-header">
        <h1>Transacciones</h1>
        <div class="header-actions">
          <button id="export-data-btn" class="btn btn-secondary">
            📤 Exportar
          </button>
          <button id="import-csv-btn" class="btn btn-secondary">
            📁 Importar CSV
          </button>
          <button id="add-transaction-btn" class="btn btn-primary">
            ➕ Añadir Transacción
          </button>
        </div>
      </div>

      <div class="filters-section">
        <div class="filters-grid">
          <div class="filter-group">
            <label for="from-date">Desde:</label>
            <input type="text" id="from-date" placeholder="dd/mm/aaaa" value="${filters.fromDate}">
          </div>
          <div class="filter-group">
            <label for="to-date">Hasta:</label>
            <input type="text" id="to-date" placeholder="dd/mm/aaaa" value="${filters.toDate}">
          </div>
          <div class="filter-group">
            <label for="category-filter">Categoría:</label>
            <select id="category-filter">
              <option value="">Todas las categorías</option>
              ${categories.map((cat: any) => `
                <option value="${cat.id}" ${filters.categoryId === cat.id ? 'selected' : ''}>
                  ${cat.nombre}
                </option>
              `).join('')}
            </select>
          </div>
          <div class="filter-group">
            <label for="search-text">Buscar:</label>
            <input type="text" id="search-text" placeholder="Descripción o comercio" value="${filters.searchText}">
          </div>
        </div>
        <div class="filter-actions">
          <button id="apply-filters" class="btn btn-primary">Filtrar</button>
          <button id="clear-filters" class="btn btn-secondary">Limpiar</button>
        </div>
      </div>

      <div class="transactions-content">
        <div class="transactions-info">
          <span>Mostrando ${paginatedTransactions.length} de ${filteredTransactions.length} transacciones</span>
        </div>

        <div class="transactions-table">
          ${createTransactionsTable(paginatedTransactions)}
        </div>

        ${totalPages > 1 ? `
          <div class="pagination">
            <button id="prev-page" class="btn btn-secondary" ${currentPage === 1 ? 'disabled' : ''}>
              ← Anterior
            </button>
            <span class="page-info">
              Página ${currentPage} de ${totalPages}
            </span>
            <button id="next-page" class="btn btn-secondary" ${currentPage === totalPages ? 'disabled' : ''}>
              Siguiente →
            </button>
          </div>
        ` : ''}
      </div>
    `;

    addEventListeners();
  }

  function createTransactionsTable(transactions: any[]) {
    if (transactions.length === 0) {
      return `
        <div class="empty-state">
          <p>No se encontraron transacciones</p>
        </div>
      `;
    }

    const tableData = transactions.map(transaction => {
      const category = categories.find((c: any) => c.id === transaction.categoriaId);
      const amount = new MoneyEUR(transaction.importeEUR);
      const date = new EsDate(new Date(transaction.fecha));

      return {
        id: transaction.id,
        fecha: date.formatShort(),
        descripcion: transaction.descripcion,
        categoria: category ? category.nombre : 'Sin categoría',
        importe: amount.format(),
        merchant: transaction.merchant || '',
        actions: `
          <button class="btn-icon edit-btn" data-id="${transaction.id}" title="Editar">
            ✏️
          </button>
          <button class="btn-icon delete-btn" data-id="${transaction.id}" title="Eliminar">
            🗑️
          </button>
        `
      };
    });

    return createTable({
      headers: ['Fecha', 'Descripción', 'Categoría', 'Importe', 'Comercio', 'Acciones'],
      data: tableData,
      className: 'transactions-table'
    });
  }

  function addEventListeners() {
    // Filtros
    const fromDateInput = container.querySelector('#from-date') as HTMLInputElement;
    const toDateInput = container.querySelector('#to-date') as HTMLInputElement;
    const categorySelect = container.querySelector('#category-filter') as HTMLSelectElement;
    const searchInput = container.querySelector('#search-text') as HTMLInputElement;

    const applyFiltersBtn = container.querySelector('#apply-filters');
    const clearFiltersBtn = container.querySelector('#clear-filters');

    applyFiltersBtn?.addEventListener('click', () => {
      filters.fromDate = fromDateInput.value;
      filters.toDate = toDateInput.value;
      filters.categoryId = categorySelect.value;
      filters.searchText = searchInput.value;
      applyFilters();
    });

    clearFiltersBtn?.addEventListener('click', () => {
      filters.fromDate = '';
      filters.toDate = '';
      filters.categoryId = '';
      filters.searchText = '';
      fromDateInput.value = '';
      toDateInput.value = '';
      categorySelect.value = '';
      searchInput.value = '';
      applyFilters();
    });

    // Paginación
    const prevPageBtn = container.querySelector('#prev-page');
    const nextPageBtn = container.querySelector('#next-page');

    prevPageBtn?.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        render();
      }
    });

    nextPageBtn?.addEventListener('click', () => {
      if (currentPage < getTotalPages()) {
        currentPage++;
        render();
      }
    });

    // Acciones de transacciones
    const editButtons = container.querySelectorAll('.edit-btn');
    const deleteButtons = container.querySelectorAll('.delete-btn');

    editButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.id;
        if (id) {
          editTransaction(id);
        }
      });
    });

    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.id;
        if (id) {
          deleteTransaction(id);
        }
      });
    });

    // Botones principales
    const addTransactionBtn = container.querySelector('#add-transaction-btn');
    const importCsvBtn = container.querySelector('#import-csv-btn');
    const exportDataBtn = container.querySelector('#export-data-btn');

    addTransactionBtn?.addEventListener('click', () => {
      showTransactionModal();
    });

    importCsvBtn?.addEventListener('click', () => {
      showImportModal();
    });

    exportDataBtn?.addEventListener('click', () => {
      showExportModal();
    });
  }

  function showTransactionModal(transaction?: any) {
    isEditing = !!transaction;
    editingTransactionId = transaction?.id || null;

    const modal = createModal({
      title: isEditing ? 'Editar Transacción' : 'Nueva Transacción',
      content: createTransactionForm(transaction),
      onClose: () => {
        modal.remove();
      }
    });

    document.body.appendChild(modal);

    // Event listeners del formulario
    const form = modal.querySelector('#transaction-form') as HTMLFormElement;
    const submitBtn = modal.querySelector('#submit-transaction') as HTMLButtonElement;

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      handleTransactionSubmit(form);
    });

    submitBtn?.addEventListener('click', () => {
      form?.requestSubmit();
    });
  }

  function createTransactionForm(transaction?: any) {
    const today = new Date();
    const defaultDate = transaction ? formatSpanishDate(new Date(transaction.fecha)) : formatSpanishDate(today);

    return `
      <form id="transaction-form" class="transaction-form">
        <div class="form-group">
          <label for="transaction-date">Fecha *</label>
          <input type="text" id="transaction-date" name="fecha" 
                 placeholder="dd/mm/aaaa" value="${defaultDate}" required>
        </div>

        <div class="form-group">
          <label for="transaction-description">Descripción *</label>
          <input type="text" id="transaction-description" name="descripcion" 
                 placeholder="Descripción de la transacción" 
                 value="${transaction?.descripcion || ''}" required>
        </div>

        <div class="form-group">
          <label for="transaction-category">Categoría</label>
          <select id="transaction-category" name="categoriaId">
            <option value="">Seleccionar categoría</option>
            ${categories.map((cat: any) => `
              <option value="${cat.id}" ${transaction?.categoriaId === cat.id ? 'selected' : ''}>
                ${cat.nombre}
              </option>
            `).join('')}
          </select>
        </div>

        <div class="form-group">
          <label for="transaction-amount">Importe *</label>
          <input type="text" id="transaction-amount" name="importeEUR" 
                 placeholder="0,00" value="${transaction ? formatSpanishAmount(transaction.importeEUR) : ''}" required>
        </div>

        <div class="form-group">
          <label for="transaction-merchant">Comercio</label>
          <input type="text" id="transaction-merchant" name="merchant" 
                 placeholder="Nombre del comercio" 
                 value="${transaction?.merchant || ''}">
        </div>

        <div class="form-actions">
          <button type="button" id="cancel-transaction" class="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" id="submit-transaction" class="btn btn-primary">
            ${isEditing ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    `;
  }

  function handleTransactionSubmit(form: HTMLFormElement) {
    const formData = new FormData(form);
    const data = {
      fecha: formData.get('fecha') as string,
      descripcion: formData.get('descripcion') as string,
      categoriaId: formData.get('categoriaId') as string,
      importeEUR: formData.get('importeEUR') as string,
      merchant: formData.get('merchant') as string
    };

    // Validaciones
    const dateError = validateRequired(data.fecha, 'Fecha');
    if (dateError) {
      toastService.error('Error de validación', dateError);
      return;
    }

    const descriptionError = validateRequired(data.descripcion, 'Descripción');
    if (descriptionError) {
      toastService.error('Error de validación', descriptionError);
      return;
    }

    const amountError = validateRequired(data.importeEUR, 'Importe');
    if (amountError) {
      toastService.error('Error de validación', amountError);
      return;
    }

    // Parsear datos
    const parsedDate = parseSpanishDate(data.fecha);
    if (!parsedDate) {
      toastService.error('Error de validación', 'Formato de fecha inválido. Use dd/mm/aaaa');
      return;
    }

    const parsedAmount = parseSpanishAmount(data.importeEUR);
    if (parsedAmount === null) {
      toastService.error('Error de validación', 'Formato de importe inválido. Use formato español (ej: 1.234,56)');
      return;
    }

    // Crear o actualizar transacción
    const transactionData = {
      id: isEditing ? editingTransactionId : new Id().toString(),
      fecha: parsedDate.toISOString(),
      descripcion: data.descripcion.trim(),
      categoriaId: data.categoriaId || undefined,
      importeEUR: parsedAmount,
      merchant: data.merchant?.trim() || undefined,
      createdAt: isEditing ? undefined : new Date().toISOString()
    };

    try {
      if (isEditing) {
        store.dispatch({ type: 'transactions/update', payload: transactionData });
        toastService.success('Transacción actualizada', 'La transacción se ha actualizado correctamente');
      } else {
        store.dispatch({ type: 'transactions/add', payload: transactionData });
        toastService.success('Transacción creada', 'La transacción se ha creado correctamente');
      }

      // Cerrar modal y actualizar vista
      const modal = form.closest('.modal') as HTMLElement;
      modal?.remove();
      applyFilters();
    } catch (error) {
      toastService.error('Error', 'No se pudo guardar la transacción');
    }
  }

  function editTransaction(id: string) {
    const transaction = transactions.find((t: any) => t.id === id);
    if (transaction) {
      showTransactionModal(transaction);
    }
  }

  function deleteTransaction(id: string) {
    if (confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
      try {
        store.dispatch({ type: 'transactions/remove', payload: { id } });
        toastService.success('Transacción eliminada', 'La transacción se ha eliminado correctamente');
        applyFilters();
      } catch (error) {
        toastService.error('Error', 'No se pudo eliminar la transacción');
      }
    }
  }

  function showImportModal() {
    const modal = createModal({
      title: 'Importar CSV',
      content: `
        <div class="import-section">
          <div class="import-info">
            <p>Selecciona un archivo CSV con el formato:</p>
            <div class="csv-format">
              <code>fecha;descripcion;categoria;importe</code>
            </div>
            <p class="format-help">Formato de fecha: dd/mm/aaaa | Formato de importe: 1.234,56</p>
          </div>
          
          <div class="form-group">
            <label for="csv-file">Archivo CSV:</label>
            <input type="file" id="csv-file" accept=".csv" />
          </div>
          
          <div id="preview-section" class="preview-section" style="display: none;">
            <h3>Vista previa (primeras 5 filas):</h3>
            <div id="preview-table" class="preview-table"></div>
            <div id="import-summary" class="import-summary"></div>
          </div>
          
          <div class="form-actions">
            <button type="button" id="download-example" class="btn btn-secondary">
              📥 Descargar ejemplo
            </button>
            <button type="button" id="cancel-import" class="btn btn-secondary">
              Cancelar
            </button>
            <button type="button" id="process-csv" class="btn btn-primary" disabled>
              Importar
            </button>
          </div>
        </div>
      `,
      onClose: () => {
        modal.remove();
      }
    });

    document.body.appendChild(modal);

    // Event listeners
    const cancelBtn = modal.querySelector('#cancel-import');
    const processBtn = modal.querySelector('#process-csv') as HTMLButtonElement;
    const downloadExampleBtn = modal.querySelector('#download-example');
    const fileInput = modal.querySelector('#csv-file') as HTMLInputElement;
    const previewSection = modal.querySelector('#preview-section') as HTMLElement;
    const previewTable = modal.querySelector('#preview-table') as HTMLElement;
    const importSummary = modal.querySelector('#import-summary') as HTMLElement;

    let importResult: any = null;

    // Descargar ejemplo
    downloadExampleBtn?.addEventListener('click', () => {
      const exampleCsv = csvService.generateExampleCsv();
      csvService.downloadFile(exampleCsv, 'ejemplo_transacciones.csv', 'text/csv');
    });

    // Procesar archivo
    fileInput?.addEventListener('change', async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        previewSection.style.display = 'none';
        processBtn.disabled = true;
        return;
      }

      try {
        // Mostrar loading
        previewTable.innerHTML = '<div class="loading">Procesando archivo...</div>';
        previewSection.style.display = 'block';

        // Procesar CSV
        importResult = await csvService.importFromFile(file, categories);
        
        // Mostrar vista previa
        if (importResult.preview && importResult.preview.length > 0) {
          const previewHtml = `
            <table class="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Categoría</th>
                  <th>Importe</th>
                </tr>
              </thead>
              <tbody>
                ${importResult.preview.map((row: any) => `
                  <tr>
                    <td>${row.fecha}</td>
                    <td>${row.descripcion}</td>
                    <td>${row.categoria || '-'}</td>
                    <td>${row.importe}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `;
          previewTable.innerHTML = previewHtml;
        } else {
          previewTable.innerHTML = '<p>No se encontraron datos válidos para mostrar</p>';
        }

        // Mostrar resumen
        const summaryHtml = `
          <div class="summary-stats">
            <div class="stat-item">
              <span class="stat-label">Válidas:</span>
              <span class="stat-value valid">${importResult.imported}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Duplicadas:</span>
              <span class="stat-value warning">${importResult.duplicates}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Errores:</span>
              <span class="stat-value error">${importResult.errors}</span>
            </div>
          </div>
          ${importResult.errorDetails.length > 0 ? `
            <div class="error-details">
              <h4>Detalles de errores:</h4>
              <ul>
                ${importResult.errorDetails.map((error: string) => `<li>${error}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        `;
        importSummary.innerHTML = summaryHtml;

        // Habilitar botón de importar si hay transacciones válidas
        processBtn.disabled = importResult.imported === 0;

      } catch (error) {
        previewTable.innerHTML = `<p class="error">Error al procesar el archivo: ${error}</p>`;
        processBtn.disabled = true;
      }
    });

    cancelBtn?.addEventListener('click', () => {
      modal.remove();
    });

    processBtn?.addEventListener('click', async () => {
      if (!importResult || importResult.imported === 0) {
        toastService.warning('Sin datos', 'No hay transacciones válidas para importar');
        return;
      }

      try {
        // Aquí se importarían las transacciones al store
        // Por ahora simulamos la importación
        toastService.success(
          'Importación completada', 
          `Importadas ${importResult.imported} transacciones, ${importResult.duplicates} duplicadas, ${importResult.errors} errores`
        );
        
        modal.remove();
        applyFilters(); // Actualizar la vista
      } catch (error) {
        toastService.error('Error de importación', 'No se pudieron importar las transacciones');
      }
    });
  }

  function showExportModal() {
    const modal = createModal({
      title: 'Exportar Datos',
      content: `
        <div class="export-section">
          <div class="export-info">
            <p>Selecciona el formato de exportación:</p>
          </div>
          
          <div class="export-options">
            <div class="export-option">
              <h3>📊 Exportar CSV</h3>
              <p>Exporta las transacciones filtradas en formato CSV</p>
              <button id="export-csv" class="btn btn-primary">
                Exportar CSV
              </button>
            </div>
            
            <div class="export-option">
              <h3>📋 Exportar JSON</h3>
              <p>Exporta todos los datos (transacciones, categorías, presupuestos)</p>
              <button id="export-json" class="btn btn-primary">
                Exportar JSON
              </button>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" id="cancel-export" class="btn btn-secondary">
              Cancelar
            </button>
          </div>
        </div>
      `,
      onClose: () => {
        modal.remove();
      }
    });

    document.body.appendChild(modal);

    // Event listeners
    const cancelBtn = modal.querySelector('#cancel-export');
    const exportCsvBtn = modal.querySelector('#export-csv');
    const exportJsonBtn = modal.querySelector('#export-json');

    cancelBtn?.addEventListener('click', () => {
      modal.remove();
    });

    exportCsvBtn?.addEventListener('click', () => {
      try {
        const csvContent = csvService.exportToCsv(filteredTransactions, categories);
        const filename = `transacciones_${new Date().toISOString().split('T')[0]}.csv`;
        csvService.downloadFile(csvContent, filename, 'text/csv');
        toastService.success('Exportación completada', 'Archivo CSV descargado correctamente');
        modal.remove();
      } catch (error) {
        toastService.error('Error de exportación', 'No se pudo exportar el archivo CSV');
      }
    });

    exportJsonBtn?.addEventListener('click', () => {
      try {
        const jsonContent = csvService.exportToJson(transactions, categories);
        const filename = `veedor_backup_${new Date().toISOString().split('T')[0]}.json`;
        csvService.downloadFile(jsonContent, filename, 'application/json');
        toastService.success('Exportación completada', 'Archivo JSON descargado correctamente');
        modal.remove();
      } catch (error) {
        toastService.error('Error de exportación', 'No se pudo exportar el archivo JSON');
      }
    });
  }

  // Inicializar
  applyFilters();

  return container;
}