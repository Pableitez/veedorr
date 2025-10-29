import { 
  createButton, 
  createInput, 
  createSelect, 
  createCard, 
  createTable,
  createModal,
  showToast,
  createProgress,
  createBadge,
  createSidebar,
  createAppSidebar
} from '../components';

export function createPlaygroundPage(): HTMLElement {
  const page = document.createElement('div');
  page.className = 'playground-page';
  page.innerHTML = `
    <div class="playground-header">
      <h1>Componentes UI - Playground</h1>
      <p>Vista de desarrollo para probar todos los componentes</p>
    </div>
    <div class="playground-content" id="playground-content">
      <!-- Los componentes se renderizarán aquí -->
    </div>
  `;

  const content = page.querySelector('#playground-content') as HTMLElement;
  
  // Aplicar estilos
  applyPlaygroundStyles(page);

  // Crear secciones de componentes
  createButtonSection(content);
  createInputSection(content);
  createSelectSection(content);
  createCardSection(content);
  createTableSection(content);
  createModalSection(content);
  createToastSection(content);
  createProgressSection(content);
  createBadgeSection(content);
  createSidebarSection(content);

  return page;
}

function createButtonSection(container: HTMLElement): void {
  const section = document.createElement('div');
  section.className = 'playground-section';
  
  const title = document.createElement('h2');
  title.textContent = 'Botones';
  section.appendChild(title);

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'playground-grid';

  // Botones primarios
  const primaryButton = createButton({
    children: 'Primario',
    variant: 'primary',
    onClick: () => showToast({ message: 'Botón primario clickeado', type: 'success' })
  });
  buttonContainer.appendChild(primaryButton);

  const secondaryButton = createButton({
    children: 'Secundario',
    variant: 'secondary',
    onClick: () => showToast({ message: 'Botón secundario clickeado', type: 'info' })
  });
  buttonContainer.appendChild(secondaryButton);

  const dangerButton = createButton({
    children: 'Peligro',
    variant: 'danger',
    onClick: () => showToast({ message: 'Botón de peligro clickeado', type: 'error' })
  });
  buttonContainer.appendChild(dangerButton);

  const ghostButton = createButton({
    children: 'Fantasma',
    variant: 'ghost',
    onClick: () => showToast({ message: 'Botón fantasma clickeado', type: 'warning' })
  });
  buttonContainer.appendChild(ghostButton);

  // Botones de diferentes tamaños
  const smallButton = createButton({
    children: 'Pequeño',
    size: 'sm',
    variant: 'primary'
  });
  buttonContainer.appendChild(smallButton);

  const largeButton = createButton({
    children: 'Grande',
    size: 'lg',
    variant: 'primary'
  });
  buttonContainer.appendChild(largeButton);

  // Botón deshabilitado
  const disabledButton = createButton({
    children: 'Deshabilitado',
    variant: 'primary',
    disabled: true
  });
  buttonContainer.appendChild(disabledButton);

  section.appendChild(buttonContainer);
  container.appendChild(section);
}

function createInputSection(container: HTMLElement): void {
  const section = document.createElement('div');
  section.className = 'playground-section';
  
  const title = document.createElement('h2');
  title.textContent = 'Inputs';
  section.appendChild(title);

  const inputContainer = document.createElement('div');
  inputContainer.className = 'playground-grid';

  // Input de texto
  const textInput = createInput({
    label: 'Nombre',
    placeholder: 'Ingresa tu nombre',
    onChange: (value) => console.log('Texto:', value)
  });
  inputContainer.appendChild(textInput);

  // Input de email
  const emailInput = createInput({
    type: 'email',
    label: 'Email',
    placeholder: 'tu@email.com',
    onChange: (value) => console.log('Email:', value)
  });
  inputContainer.appendChild(emailInput);

  // Input de contraseña
  const passwordInput = createInput({
    type: 'password',
    label: 'Contraseña',
    placeholder: '••••••••',
    onChange: (value) => console.log('Contraseña:', value)
  });
  inputContainer.appendChild(passwordInput);

  // Input con error
  const errorInput = createInput({
    label: 'Con error',
    placeholder: 'Este campo tiene error',
    variant: 'error',
    errorText: 'Este campo es requerido',
    onChange: (value) => console.log('Error input:', value)
  });
  inputContainer.appendChild(errorInput);

  section.appendChild(inputContainer);
  container.appendChild(section);
}

function createSelectSection(container: HTMLElement): void {
  const section = document.createElement('div');
  section.className = 'playground-section';
  
  const title = document.createElement('h2');
  title.textContent = 'Selects';
  section.appendChild(title);

  const selectContainer = document.createElement('div');
  selectContainer.className = 'playground-grid';

  // Select de categorías
  const categorySelect = createSelect({
    label: 'Categoría',
    placeholder: 'Selecciona una categoría',
    options: [
      { value: 'food', label: 'Comida' },
      { value: 'transport', label: 'Transporte' },
      { value: 'entertainment', label: 'Entretenimiento' },
      { value: 'health', label: 'Salud' }
    ],
    onChange: (value) => console.log('Categoría:', value)
  });
  selectContainer.appendChild(categorySelect);

  // Select de tipo
  const typeSelect = createSelect({
    label: 'Tipo',
    placeholder: 'Selecciona el tipo',
    options: [
      { value: 'income', label: 'Ingreso' },
      { value: 'expense', label: 'Gasto' }
    ],
    onChange: (value) => console.log('Tipo:', value)
  });
  selectContainer.appendChild(typeSelect);

  section.appendChild(selectContainer);
  container.appendChild(section);
}

function createCardSection(container: HTMLElement): void {
  const section = document.createElement('div');
  section.className = 'playground-section';
  
  const title = document.createElement('h2');
  title.textContent = 'Cards';
  section.appendChild(title);

  const cardContainer = document.createElement('div');
  cardContainer.className = 'playground-grid';

  // Card básica
  const basicCard = createCard({
    title: 'Card Básica',
    children: 'Este es el contenido de una card básica.',
    variant: 'default'
  });
  cardContainer.appendChild(basicCard);

  // Card elevada
  const elevatedCard = createCard({
    title: 'Card Elevada',
    children: 'Esta card tiene sombra y se ve más prominente.',
    variant: 'elevated'
  });
  cardContainer.appendChild(elevatedCard);

  // Card con subtítulo
  const cardWithSubtitle = createCard({
    title: 'Card con Subtítulo',
    subtitle: 'Información adicional',
    children: 'Esta card incluye un subtítulo descriptivo.',
    variant: 'outlined'
  });
  cardContainer.appendChild(cardWithSubtitle);

  // Card clickeable
  const clickableCard = createCard({
    title: 'Card Clickeable',
    children: 'Haz clic en esta card para ver una notificación.',
    variant: 'elevated',
    onClick: () => showToast({ message: 'Card clickeada!', type: 'info' })
  });
  cardContainer.appendChild(clickableCard);

  section.appendChild(cardContainer);
  container.appendChild(section);
}

function createTableSection(container: HTMLElement): void {
  const section = document.createElement('div');
  section.className = 'playground-section';
  
  const title = document.createElement('h2');
  title.textContent = 'Tablas';
  section.appendChild(title);

  const tableContainer = document.createElement('div');
  tableContainer.className = 'playground-full-width';

  // Datos de ejemplo
  const sampleData = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', edad: 30, activo: true },
    { id: 2, nombre: 'María García', email: 'maria@email.com', edad: 25, activo: false },
    { id: 3, nombre: 'Carlos López', email: 'carlos@email.com', edad: 35, activo: true }
  ];

  const columns = [
    { key: 'id', title: 'ID', width: '80px' },
    { key: 'nombre', title: 'Nombre', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'edad', title: 'Edad', width: '100px', align: 'right' as const },
    { 
      key: 'activo', 
      title: 'Activo', 
      width: '100px',
      render: (value: boolean) => {
        const badge = document.createElement('span');
        badge.textContent = value ? 'Sí' : 'No';
        badge.style.color = value ? 'var(--color-success)' : 'var(--color-danger)';
        return badge;
      }
    }
  ];

  const table = createTable({
    columns,
    data: sampleData,
    hoverable: true,
    onRowClick: (row) => showToast({ message: `Fila clickeada: ${row.nombre}`, type: 'info' }),
    onSort: (column, direction) => showToast({ message: `Ordenando por ${column}: ${direction}`, type: 'info' })
  });

  tableContainer.appendChild(table);
  section.appendChild(tableContainer);
  container.appendChild(section);
}

function createModalSection(container: HTMLElement): void {
  const section = document.createElement('div');
  section.className = 'playground-section';
  
  const title = document.createElement('h2');
  title.textContent = 'Modales';
  section.appendChild(title);

  const modalContainer = document.createElement('div');
  modalContainer.className = 'playground-grid';

  // Botón para abrir modal
  const openModalButton = createButton({
    children: 'Abrir Modal',
    variant: 'primary',
    onClick: () => {
      const modal = createModal({
        title: 'Modal de Ejemplo',
        children: 'Este es el contenido del modal. Puedes incluir cualquier elemento aquí.',
        size: 'md',
        onClose: () => showToast({ message: 'Modal cerrado', type: 'info' })
      });
      
      document.body.appendChild(modal);
      
      // Mostrar modal
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  });
  modalContainer.appendChild(openModalButton);

  // Botón para modal de confirmación
  const confirmModalButton = createButton({
    children: 'Modal de Confirmación',
    variant: 'warning',
    onClick: () => {
      const modal = createModal({
        title: 'Confirmar Acción',
        children: '¿Estás seguro de que quieres realizar esta acción?',
        size: 'sm',
        onClose: () => showToast({ message: 'Acción cancelada', type: 'warning' })
      });
      
      document.body.appendChild(modal);
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  });
  modalContainer.appendChild(confirmModalButton);

  section.appendChild(modalContainer);
  container.appendChild(section);
}

function createToastSection(container: HTMLElement): void {
  const section = document.createElement('div');
  section.className = 'playground-section';
  
  const title = document.createElement('h2');
  title.textContent = 'Notificaciones (Toast)';
  section.appendChild(title);

  const toastContainer = document.createElement('div');
  toastContainer.className = 'playground-grid';

  // Botones para diferentes tipos de toast
  const successButton = createButton({
    children: 'Éxito',
    variant: 'success',
    onClick: () => showToast({ message: 'Operación exitosa!', type: 'success' })
  });
  toastContainer.appendChild(successButton);

  const errorButton = createButton({
    children: 'Error',
    variant: 'danger',
    onClick: () => showToast({ message: 'Ha ocurrido un error', type: 'error' })
  });
  toastContainer.appendChild(errorButton);

  const warningButton = createButton({
    children: 'Advertencia',
    variant: 'warning',
    onClick: () => showToast({ message: 'Ten cuidado con esto', type: 'warning' })
  });
  toastContainer.appendChild(warningButton);

  const infoButton = createButton({
    children: 'Información',
    variant: 'primary',
    onClick: () => showToast({ message: 'Información importante', type: 'info' })
  });
  toastContainer.appendChild(infoButton);

  section.appendChild(toastContainer);
  container.appendChild(section);
}

function createProgressSection(container: HTMLElement): void {
  const section = document.createElement('div');
  section.className = 'playground-section';
  
  const title = document.createElement('h2');
  title.textContent = 'Barras de Progreso';
  section.appendChild(title);

  const progressContainer = document.createElement('div');
  progressContainer.className = 'playground-grid';

  // Progreso básico
  const basicProgress = createProgress({
    value: 60,
    max: 100,
    label: 'Progreso Básico',
    showLabel: true
  });
  progressContainer.appendChild(basicProgress);

  // Progreso de éxito
  const successProgress = createProgress({
    value: 80,
    max: 100,
    variant: 'success',
    label: 'Progreso de Éxito',
    showLabel: true
  });
  progressContainer.appendChild(successProgress);

  // Progreso de advertencia
  const warningProgress = createProgress({
    value: 90,
    max: 100,
    variant: 'warning',
    label: 'Progreso de Advertencia',
    showLabel: true
  });
  progressContainer.appendChild(warningProgress);

  // Progreso de peligro
  const dangerProgress = createProgress({
    value: 100,
    max: 100,
    variant: 'danger',
    label: 'Progreso de Peligro',
    showLabel: true
  });
  progressContainer.appendChild(dangerProgress);

  section.appendChild(progressContainer);
  container.appendChild(section);
}

function createBadgeSection(container: HTMLElement): void {
  const section = document.createElement('div');
  section.className = 'playground-section';
  
  const title = document.createElement('h2');
  title.textContent = 'Badges';
  section.appendChild(title);

  const badgeContainer = document.createElement('div');
  badgeContainer.className = 'playground-grid';

  // Badges de diferentes variantes
  const defaultBadge = createBadge({ children: 'Default' });
  badgeContainer.appendChild(defaultBadge);

  const primaryBadge = createBadge({ children: 'Primario', variant: 'primary' });
  badgeContainer.appendChild(primaryBadge);

  const successBadge = createBadge({ children: 'Éxito', variant: 'success' });
  badgeContainer.appendChild(successBadge);

  const warningBadge = createBadge({ children: 'Advertencia', variant: 'warning' });
  badgeContainer.appendChild(warningBadge);

  const dangerBadge = createBadge({ children: 'Peligro', variant: 'danger' });
  badgeContainer.appendChild(dangerBadge);

  const infoBadge = createBadge({ children: 'Info', variant: 'info' });
  badgeContainer.appendChild(infoBadge);

  const outlineBadge = createBadge({ children: 'Outline', variant: 'outline' });
  badgeContainer.appendChild(outlineBadge);

  // Badge redondeado
  const roundedBadge = createBadge({ 
    children: 'Redondeado', 
    variant: 'primary', 
    rounded: true 
  });
  badgeContainer.appendChild(roundedBadge);

  section.appendChild(badgeContainer);
  container.appendChild(section);
}

function createSidebarSection(container: HTMLElement): void {
  const section = document.createElement('div');
  section.className = 'playground-section';
  
  const title = document.createElement('h2');
  title.textContent = 'Sidebar';
  section.appendChild(title);

  const sidebarContainer = document.createElement('div');
  sidebarContainer.className = 'playground-full-width';

  const sidebar = createAppSidebar('/playground', (path) => {
    showToast({ message: `Navegando a: ${path}`, type: 'info' });
  });

  sidebarContainer.appendChild(sidebar);
  section.appendChild(sidebarContainer);
  container.appendChild(section);
}

function applyPlaygroundStyles(page: HTMLElement): void {
  const styles = `
    .playground-page {
      padding: var(--space-6);
      max-width: 1200px;
      margin: 0 auto;
    }
    .playground-header {
      text-align: center;
      margin-bottom: var(--space-8);
    }
    .playground-header h1 {
      font-size: var(--font-size-3xl);
      color: var(--color-text-primary);
      margin-bottom: var(--space-2);
    }
    .playground-header p {
      color: var(--color-text-secondary);
      font-size: var(--font-size-lg);
    }
    .playground-section {
      margin-bottom: var(--space-8);
      padding: var(--space-6);
      background-color: var(--color-surface);
      border-radius: var(--border-radius-lg);
      border: 1px solid var(--color-border);
    }
    .playground-section h2 {
      font-size: var(--font-size-2xl);
      color: var(--color-text-primary);
      margin-bottom: var(--space-4);
      padding-bottom: var(--space-2);
      border-bottom: 2px solid var(--color-border-light);
    }
    .playground-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-4);
      align-items: start;
    }
    .playground-full-width {
      width: 100%;
    }
  `;

  const style = document.createElement('style');
  style.textContent = styles;
  document.head.appendChild(style);
}
