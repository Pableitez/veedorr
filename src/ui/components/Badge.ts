export interface BadgeProps {
  children: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function createBadge(props: BadgeProps): HTMLElement {
  const {
    children,
    variant = 'default',
    size = 'md',
    rounded = false,
    className = '',
    'aria-label': ariaLabel,
  } = props;

  const badge = document.createElement('span');
  badge.className = `badge badge-${variant} badge-${size} ${rounded ? 'badge-rounded' : ''} ${className}`.trim();
  badge.textContent = children;

  if (ariaLabel) {
    badge.setAttribute('aria-label', ariaLabel);
  }

  // Aplicar estilos
  applyBadgeStyles(badge, variant, size, rounded);

  return badge;
}

function applyBadgeStyles(
  badge: HTMLElement,
  variant: string,
  size: string,
  rounded: boolean
): void {
  const baseStyles = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-family);
    font-weight: var(--font-weight-medium);
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    user-select: none;
    transition: all var(--transition-fast);
  `;

  const sizeStyles = {
    sm: `
      padding: var(--space-1) var(--space-2);
      font-size: var(--font-size-xs);
      line-height: var(--line-height-tight);
    `,
    md: `
      padding: var(--space-2) var(--space-3);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-normal);
    `,
    lg: `
      padding: var(--space-3) var(--space-4);
      font-size: var(--font-size-base);
      line-height: var(--line-height-normal);
    `,
  };

  const variantStyles = {
    default: `
      background-color: var(--color-secondary);
      color: var(--color-text-inverse);
    `,
    primary: `
      background-color: var(--color-primary);
      color: var(--color-text-inverse);
    `,
    success: `
      background-color: var(--color-success);
      color: var(--color-text-inverse);
    `,
    warning: `
      background-color: var(--color-warning);
      color: var(--color-text-inverse);
    `,
    danger: `
      background-color: var(--color-danger);
      color: var(--color-text-inverse);
    `,
    info: `
      background-color: var(--color-info);
      color: var(--color-text-inverse);
    `,
    outline: `
      background-color: transparent;
      color: var(--color-text-primary);
      border: 1px solid var(--color-border);
    `,
  };

  const roundedStyles = rounded ? `
    border-radius: var(--border-radius-full);
  ` : `
    border-radius: var(--border-radius);
  `;

  const allStyles = `
    ${baseStyles}
    ${sizeStyles[size as keyof typeof sizeStyles]}
    ${variantStyles[variant as keyof typeof variantStyles]}
    ${roundedStyles}
  `;

  badge.style.cssText = allStyles;
}

// Funciones helper para crear badges comunes
export function createStatusBadge(status: 'active' | 'inactive' | 'pending' | 'completed'): HTMLElement {
  const statusConfig = {
    active: { text: 'Activo', variant: 'success' as const },
    inactive: { text: 'Inactivo', variant: 'default' as const },
    pending: { text: 'Pendiente', variant: 'warning' as const },
    completed: { text: 'Completado', variant: 'success' as const },
  };

  const config = statusConfig[status];
  return createBadge({
    children: config.text,
    variant: config.variant,
    size: 'sm',
    rounded: true
  });
}

export function createCountBadge(count: number, max?: number): HTMLElement {
  const displayCount = max && count > max ? `${max}+` : count.toString();
  
  return createBadge({
    children: displayCount,
    variant: 'primary',
    size: 'sm',
    rounded: true
  });
}

export function createCategoryBadge(category: string, color?: string): HTMLElement {
  const badge = createBadge({
    children: category,
    variant: 'outline',
    size: 'sm',
    rounded: true
  });

  if (color) {
    badge.style.borderColor = color;
    badge.style.color = color;
  }

  return badge;
}

export function createPriorityBadge(priority: 'low' | 'medium' | 'high' | 'urgent'): HTMLElement {
  const priorityConfig = {
    low: { text: 'Baja', variant: 'info' as const },
    medium: { text: 'Media', variant: 'warning' as const },
    high: { text: 'Alta', variant: 'danger' as const },
    urgent: { text: 'Urgente', variant: 'danger' as const },
  };

  const config = priorityConfig[priority];
  return createBadge({
    children: config.text,
    variant: config.variant,
    size: 'sm',
    rounded: true
  });
}

export function createTypeBadge(type: 'income' | 'expense'): HTMLElement {
  const typeConfig = {
    income: { text: 'Ingreso', variant: 'success' as const },
    expense: { text: 'Gasto', variant: 'danger' as const },
  };

  const config = typeConfig[type];
  return createBadge({
    children: config.text,
    variant: config.variant,
    size: 'sm',
    rounded: true
  });
}
