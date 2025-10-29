export interface TableColumn<T = any> {
  key: string;
  title: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: any, row: T, index: number) => HTMLElement | string;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'striped' | 'bordered';
  hoverable?: boolean;
  selectable?: boolean;
  className?: string;
  onRowClick?: (row: T, index: number) => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onSelect?: (selectedRows: T[]) => void;
}

export function createTable<T = any>(props: TableProps<T>): HTMLElement {
  const {
    columns,
    data,
    loading = false,
    emptyMessage = 'No hay datos disponibles',
    size = 'md',
    variant = 'default',
    hoverable = false,
    selectable = false,
    className = '',
    onRowClick,
    onSort,
    onSelect,
  } = props;

  const container = document.createElement('div');
  container.className = `table-container ${className}`.trim();

  const table = document.createElement('table');
  table.className = `table table-${size} table-${variant}`;

  // Crear header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.className = 'table-header-row';

  // Checkbox para selección múltiple
  if (selectable) {
    const th = document.createElement('th');
    th.className = 'table-header-cell table-header-checkbox';
    th.style.width = '40px';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'table-select-all';
    checkbox.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      const checkboxes = table.querySelectorAll('.table-row-checkbox') as NodeListOf<HTMLInputElement>;
      checkboxes.forEach(cb => cb.checked = target.checked);
      
      if (onSelect) {
        const selectedRows = target.checked ? [...data] : [];
        onSelect(selectedRows);
      }
    });
    
    th.appendChild(checkbox);
    headerRow.appendChild(th);
  }

  // Columnas del header
  columns.forEach(column => {
    const th = document.createElement('th');
    th.className = 'table-header-cell';
    th.textContent = column.title;
    th.style.textAlign = column.align || 'left';
    th.style.width = column.width || 'auto';

    if (column.sortable) {
      th.style.cursor = 'pointer';
      th.setAttribute('data-sortable', 'true');
      th.setAttribute('data-column', column.key);
      
      // Agregar indicador de ordenamiento
      const sortIcon = document.createElement('span');
      sortIcon.className = 'table-sort-icon';
      sortIcon.textContent = '↕';
      sortIcon.style.marginLeft = 'var(--space-1)';
      th.appendChild(sortIcon);

      th.addEventListener('click', () => {
        if (onSort) {
          // Alternar entre asc, desc, y sin ordenar
          const currentDirection = th.getAttribute('data-sort-direction');
          let newDirection: 'asc' | 'desc' | null = null;
          
          if (currentDirection === 'asc') {
            newDirection = 'desc';
          } else if (currentDirection === 'desc') {
            newDirection = null;
          } else {
            newDirection = 'asc';
          }
          
          if (newDirection) {
            onSort(column.key, newDirection);
            th.setAttribute('data-sort-direction', newDirection);
            sortIcon.textContent = newDirection === 'asc' ? '↑' : '↓';
          } else {
            th.removeAttribute('data-sort-direction');
            sortIcon.textContent = '↕';
          }
        }
      });
    }

    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Crear body
  const tbody = document.createElement('tbody');
  tbody.className = 'table-body';

  if (loading) {
    const loadingRow = document.createElement('tr');
    const loadingCell = document.createElement('td');
    loadingCell.colSpan = columns.length + (selectable ? 1 : 0);
    loadingCell.className = 'table-loading-cell';
    loadingCell.textContent = 'Cargando...';
    loadingRow.appendChild(loadingCell);
    tbody.appendChild(loadingRow);
  } else if (data.length === 0) {
    const emptyRow = document.createElement('tr');
    const emptyCell = document.createElement('td');
    emptyCell.colSpan = columns.length + (selectable ? 1 : 0);
    emptyCell.className = 'table-empty-cell';
    emptyCell.textContent = emptyMessage;
    emptyRow.appendChild(emptyCell);
    tbody.appendChild(emptyRow);
  } else {
    data.forEach((row, index) => {
      const tr = document.createElement('tr');
      tr.className = 'table-row';
      tr.setAttribute('data-index', index.toString());

      if (hoverable) {
        tr.style.cursor = 'pointer';
      }

      if (onRowClick) {
        tr.addEventListener('click', (e) => {
          // No activar si se hace clic en checkbox
          if (!(e.target as HTMLElement).closest('.table-row-checkbox')) {
            onRowClick(row, index);
          }
        });
      }

      // Checkbox para selección de fila
      if (selectable) {
        const td = document.createElement('td');
        td.className = 'table-cell table-cell-checkbox';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'table-row-checkbox';
        checkbox.addEventListener('change', () => {
          const checkboxes = table.querySelectorAll('.table-row-checkbox:checked') as NodeListOf<HTMLInputElement>;
          const selectedRows = Array.from(checkboxes).map(cb => {
            const rowIndex = parseInt(cb.closest('tr')?.getAttribute('data-index') || '0');
            return data[rowIndex];
          });
          
          if (onSelect) {
            onSelect(selectedRows);
          }
        });
        
        td.appendChild(checkbox);
        tr.appendChild(td);
      }

      // Celdas de datos
      columns.forEach(column => {
        const td = document.createElement('td');
        td.className = 'table-cell';
        td.style.textAlign = column.align || 'left';

        const value = (row as any)[column.key];
        
        if (column.render) {
          const rendered = column.render(value, row, index);
          if (typeof rendered === 'string') {
            td.textContent = rendered;
          } else {
            td.appendChild(rendered);
          }
        } else {
          td.textContent = value?.toString() || '';
        }

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  }

  table.appendChild(tbody);
  container.appendChild(table);

  // Aplicar estilos
  applyTableStyles(container, table, size, variant, hoverable);

  return container;
}

function applyTableStyles(
  container: HTMLElement,
  table: HTMLTableElement,
  size: string,
  variant: string,
  hoverable: boolean
): void {
  const containerStyles = `
    width: 100%;
    overflow-x: auto;
    border-radius: var(--border-radius);
    border: 1px solid var(--color-border);
  `;

  const tableBaseStyles = `
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-family);
    background-color: var(--color-surface);
  `;

  const sizeStyles = {
    sm: `
      font-size: var(--font-size-sm);
    `,
    md: `
      font-size: var(--font-size-base);
    `,
    lg: `
      font-size: var(--font-size-lg);
    `,
  };

  const variantStyles = {
    default: `
      .table-row:not(:last-child) {
        border-bottom: 1px solid var(--color-border-light);
      }
    `,
    striped: `
      .table-row:nth-child(even) {
        background-color: var(--color-surface-hover);
      }
      .table-row:not(:last-child) {
        border-bottom: 1px solid var(--color-border-light);
      }
    `,
    bordered: `
      .table-cell {
        border: 1px solid var(--color-border-light);
      }
    `,
  };

  const hoverStyles = hoverable ? `
    .table-row:hover {
      background-color: var(--color-surface-hover);
    }
  ` : '';

  const headerStyles = `
    .table-header-row {
      background-color: var(--color-surface-hover);
      font-weight: var(--font-weight-semibold);
    }
    .table-header-cell {
      padding: var(--space-3) var(--space-4);
      text-align: left;
      color: var(--color-text-primary);
      border-bottom: 2px solid var(--color-border);
    }
    .table-header-cell[data-sortable="true"]:hover {
      background-color: var(--color-surface);
    }
    .table-sort-icon {
      opacity: 0.5;
      transition: opacity var(--transition-fast);
    }
    .table-header-cell[data-sortable="true"]:hover .table-sort-icon {
      opacity: 1;
    }
  `;

  const cellStyles = `
    .table-cell {
      padding: var(--space-3) var(--space-4);
      color: var(--color-text-primary);
      vertical-align: middle;
    }
    .table-cell-checkbox {
      text-align: center;
      width: 40px;
    }
  `;

  const loadingStyles = `
    .table-loading-cell,
    .table-empty-cell {
      padding: var(--space-8);
      text-align: center;
      color: var(--color-text-secondary);
      font-style: italic;
    }
  `;

  const checkboxStyles = `
    .table-select-all,
    .table-row-checkbox {
      cursor: pointer;
    }
  `;

  // Aplicar estilos al contenedor
  container.style.cssText = containerStyles;

  // Aplicar estilos a la tabla
  const tableStyles = `
    ${tableBaseStyles}
    ${sizeStyles[size as keyof typeof sizeStyles]}
  `;
  table.style.cssText = tableStyles;

  // Crear estilos CSS dinámicos
  const style = document.createElement('style');
  style.textContent = `
    ${variantStyles[variant as keyof typeof variantStyles]}
    ${hoverStyles}
    ${headerStyles}
    ${cellStyles}
    ${loadingStyles}
    ${checkboxStyles}
  `;
  document.head.appendChild(style);
}

// Funciones helper para crear tablas comunes
export function createTransactionsTable(
  transactions: Array<{
    id: string;
    descripcion: string;
    importeEUR: number;
    fecha: Date;
    categoria?: string;
  }>,
  onRowClick?: (transaction: any) => void
): HTMLElement {
  const columns: TableColumn[] = [
    {
      key: 'fecha',
      title: 'Fecha',
      width: '120px',
      render: (value: Date) => {
        const span = document.createElement('span');
        span.textContent = new Intl.DateTimeFormat('es-ES').format(value);
        return span;
      }
    },
    {
      key: 'descripcion',
      title: 'Descripción',
      sortable: true
    },
    {
      key: 'categoria',
      title: 'Categoría',
      width: '150px'
    },
    {
      key: 'importeEUR',
      title: 'Importe',
      width: '120px',
      align: 'right',
      sortable: true,
      render: (value: number) => {
        const span = document.createElement('span');
        span.textContent = new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'EUR'
        }).format(value);
        span.style.color = value >= 0 ? 'var(--color-success)' : 'var(--color-danger)';
        return span;
      }
    }
  ];

  return createTable({
    columns,
    data: transactions,
    hoverable: true,
    onRowClick
  });
}
