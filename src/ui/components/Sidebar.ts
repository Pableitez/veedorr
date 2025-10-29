export interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  badge?: string;
  children?: SidebarItem[];
  onClick?: () => void;
}

export interface SidebarProps {
  items: SidebarItem[];
  collapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
  onItemClick?: (item: SidebarItem) => void;
  className?: string;
  'aria-label'?: string;
}

export function createSidebar(props: SidebarProps): HTMLElement {
  const {
    items,
    collapsed = false,
    onToggle,
    onItemClick,
    className = '',
    'aria-label': ariaLabel,
  } = props;

  const sidebar = document.createElement('nav');
  sidebar.className = `sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${className}`.trim();
  sidebar.setAttribute('aria-label', ariaLabel || 'Navegación principal');

  // Crear header del sidebar
  const header = document.createElement('div');
  header.className = 'sidebar-header';

  const logo = document.createElement('div');
  logo.className = 'sidebar-logo';
  logo.textContent = 'Veedor';

  const toggleButton = document.createElement('button');
  toggleButton.className = 'sidebar-toggle';
  toggleButton.innerHTML = collapsed ? '→' : '←';
  toggleButton.setAttribute('aria-label', collapsed ? 'Expandir sidebar' : 'Colapsar sidebar');
  toggleButton.addEventListener('click', () => {
    const newCollapsed = !collapsed;
    sidebar.classList.toggle('sidebar-collapsed', newCollapsed);
    toggleButton.innerHTML = newCollapsed ? '→' : '←';
    if (onToggle) onToggle(newCollapsed);
  });

  header.appendChild(logo);
  header.appendChild(toggleButton);
  sidebar.appendChild(header);

  // Crear navegación
  const nav = document.createElement('ul');
  nav.className = 'sidebar-nav';
  nav.setAttribute('role', 'menubar');

  items.forEach(item => {
    const navItem = createSidebarItem(item, collapsed, onItemClick);
    nav.appendChild(navItem);
  });

  sidebar.appendChild(nav);

  // Aplicar estilos
  applySidebarStyles(sidebar, collapsed);

  return sidebar;
}

function createSidebarItem(
  item: SidebarItem,
  collapsed: boolean,
  onItemClick?: (item: SidebarItem) => void
): HTMLElement {
  const li = document.createElement('li');
  li.className = 'sidebar-item';

  const link = document.createElement('a');
  link.className = 'sidebar-link';
  link.href = item.href || '#';
  link.setAttribute('role', 'menuitem');
  link.setAttribute('tabindex', '0');

  // Prevenir navegación por defecto si hay onClick
  if (item.onClick || onItemClick) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (item.onClick) item.onClick();
      if (onItemClick) onItemClick(item);
    });
  }

  // Crear contenido del enlace
  const linkContent = document.createElement('div');
  linkContent.className = 'sidebar-link-content';

  // Icono
  if (item.icon) {
    const icon = document.createElement('span');
    icon.className = 'sidebar-icon';
    icon.textContent = item.icon;
    linkContent.appendChild(icon);
  }

  // Label
  const label = document.createElement('span');
  label.className = 'sidebar-label';
  label.textContent = item.label;
  linkContent.appendChild(label);

  // Badge
  if (item.badge) {
    const badge = document.createElement('span');
    badge.className = 'sidebar-badge';
    badge.textContent = item.badge;
    linkContent.appendChild(badge);
  }

  link.appendChild(linkContent);

  // Crear submenu si hay children
  if (item.children && item.children.length > 0) {
    const submenu = document.createElement('ul');
    submenu.className = 'sidebar-submenu';
    submenu.setAttribute('role', 'menu');

    item.children.forEach(child => {
      const subItem = createSidebarItem(child, collapsed, onItemClick);
      subItem.classList.add('sidebar-subitem');
      submenu.appendChild(subItem);
    });

    li.appendChild(submenu);

    // Toggle submenu
    link.addEventListener('click', (e) => {
      e.preventDefault();
      submenu.classList.toggle('sidebar-submenu-open');
    });
  }

  li.appendChild(link);

  return li;
}

function applySidebarStyles(sidebar: HTMLElement, collapsed: boolean): void {
  const baseStyles = `
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    background-color: var(--color-surface);
    border-right: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    z-index: var(--z-fixed);
    transition: width var(--transition-normal);
    overflow: hidden;
  `;

  const expandedStyles = `
    width: 280px;
  `;

  const collapsedStyles = `
    width: 64px;
  `;

  const headerStyles = `
    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-4);
      border-bottom: 1px solid var(--color-border-light);
      min-height: 64px;
    }
    .sidebar-logo {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-primary);
      white-space: nowrap;
      overflow: hidden;
    }
    .sidebar-toggle {
      background: none;
      border: none;
      font-size: var(--font-size-lg);
      color: var(--color-text-secondary);
      cursor: pointer;
      padding: var(--space-2);
      border-radius: var(--border-radius);
      transition: all var(--transition-fast);
    }
    .sidebar-toggle:hover {
      background-color: var(--color-surface-hover);
      color: var(--color-text-primary);
    }
  `;

  const navStyles = `
    .sidebar-nav {
      flex: 1;
      list-style: none;
      padding: var(--space-2);
      margin: 0;
      overflow-y: auto;
    }
    .sidebar-item {
      margin-bottom: var(--space-1);
    }
    .sidebar-link {
      display: flex;
      align-items: center;
      padding: var(--space-3);
      color: var(--color-text-primary);
      text-decoration: none;
      border-radius: var(--border-radius);
      transition: all var(--transition-fast);
      position: relative;
    }
    .sidebar-link:hover {
      background-color: var(--color-surface-hover);
      color: var(--color-text-primary);
    }
    .sidebar-link:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
    .sidebar-link-content {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      width: 100%;
    }
    .sidebar-icon {
      font-size: var(--font-size-lg);
      width: 20px;
      text-align: center;
      flex-shrink: 0;
    }
    .sidebar-label {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sidebar-badge {
      background-color: var(--color-primary);
      color: var(--color-text-inverse);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--border-radius-full);
      min-width: 20px;
      text-align: center;
    }
  `;

  const submenuStyles = `
    .sidebar-submenu {
      list-style: none;
      padding: 0;
      margin: var(--space-2) 0 0 var(--space-6);
      max-height: 0;
      overflow: hidden;
      transition: max-height var(--transition-normal);
    }
    .sidebar-submenu-open {
      max-height: 500px;
    }
    .sidebar-subitem .sidebar-link {
      padding: var(--space-2) var(--space-3);
      font-size: var(--font-size-sm);
    }
  `;

  const collapsedStylesCSS = `
    .sidebar-collapsed .sidebar-logo {
      display: none;
    }
    .sidebar-collapsed .sidebar-label {
      display: none;
    }
    .sidebar-collapsed .sidebar-badge {
      position: absolute;
      top: var(--space-1);
      right: var(--space-1);
      font-size: var(--font-size-xs);
      padding: var(--space-1);
      min-width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .sidebar-collapsed .sidebar-submenu {
      display: none;
    }
    .sidebar-collapsed .sidebar-link {
      justify-content: center;
    }
  `;

  const responsiveStyles = `
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        width: 280px !important;
      }
      .sidebar.sidebar-mobile-open {
        transform: translateX(0);
      }
    }
  `;

  // Aplicar estilos base
  sidebar.style.cssText = `
    ${baseStyles}
    ${collapsed ? collapsedStyles : expandedStyles}
  `;

  // Crear estilos CSS dinámicos
  const style = document.createElement('style');
  style.textContent = `
    ${headerStyles}
    ${navStyles}
    ${submenuStyles}
    ${collapsedStylesCSS}
    ${responsiveStyles}
  `;
  document.head.appendChild(style);
}

// Función para crear sidebar con items de navegación comunes
export function createAppSidebar(
  currentPath: string,
  onNavigate?: (path: string) => void
): HTMLElement {
  const items: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      href: '/dashboard',
      onClick: () => onNavigate?.('/dashboard')
    },
    {
      id: 'transactions',
      label: 'Transacciones',
      icon: '💰',
      href: '/transactions',
      onClick: () => onNavigate?.('/transactions')
    },
    {
      id: 'budgets',
      label: 'Presupuestos',
      icon: '📋',
      href: '/budgets',
      onClick: () => onNavigate?.('/budgets')
    },
    {
      id: 'categories',
      label: 'Categorías',
      icon: '🏷️',
      href: '/categories',
      onClick: () => onNavigate?.('/categories')
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: '⚙️',
      href: '/settings',
      onClick: () => onNavigate?.('/settings')
    }
  ];

  return createSidebar({
    items,
    onItemClick: (item) => {
      if (onNavigate && item.href) {
        onNavigate(item.href);
      }
    }
  });
}

// Función para mostrar/ocultar sidebar en móvil
export function toggleMobileSidebar(sidebar: HTMLElement): void {
  sidebar.classList.toggle('sidebar-mobile-open');
}

// Función para cerrar sidebar en móvil
export function closeMobileSidebar(sidebar: HTMLElement): void {
  sidebar.classList.remove('sidebar-mobile-open');
}
