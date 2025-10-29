export interface CardProps {
  children: HTMLElement | HTMLElement[] | string;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  'aria-label'?: string;
}

export function createCard(props: CardProps): HTMLElement {
  const {
    children,
    title,
    subtitle,
    variant = 'default',
    size = 'md',
    padding = 'md',
    className = '',
    onClick,
    'aria-label': ariaLabel,
  } = props;

  const card = document.createElement('div');
  card.className = `card card-${variant} card-${size} ${className}`.trim();

  if (ariaLabel) {
    card.setAttribute('aria-label', ariaLabel);
  }

  if (onClick) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', onClick);
  }

  // Crear header si hay título o subtítulo
  if (title || subtitle) {
    const header = document.createElement('div');
    header.className = 'card-header';

    if (title) {
      const titleElement = document.createElement('h3');
      titleElement.className = 'card-title';
      titleElement.textContent = title;
      header.appendChild(titleElement);
    }

    if (subtitle) {
      const subtitleElement = document.createElement('p');
      subtitleElement.className = 'card-subtitle';
      subtitleElement.textContent = subtitle;
      header.appendChild(subtitleElement);
    }

    card.appendChild(header);
  }

  // Crear body con contenido
  const body = document.createElement('div');
  body.className = `card-body card-padding-${padding}`;

  if (typeof children === 'string') {
    body.textContent = children;
  } else if (Array.isArray(children)) {
    children.forEach(child => body.appendChild(child));
  } else {
    body.appendChild(children);
  }

  card.appendChild(body);

  // Aplicar estilos
  applyCardStyles(card, variant, size, padding, onClick !== undefined);

  return card;
}

function applyCardStyles(
  card: HTMLElement,
  variant: string,
  size: string,
  padding: string,
  clickable: boolean
): void {
  const baseStyles = `
    display: flex;
    flex-direction: column;
    border-radius: var(--border-radius);
    font-family: var(--font-family);
    transition: all var(--transition-fast);
    overflow: hidden;
  `;

  const variantStyles = {
    default: `
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
    `,
    elevated: `
      background-color: var(--color-surface);
      box-shadow: var(--shadow-md);
      border: none;
    `,
    outlined: `
      background-color: transparent;
      border: 2px solid var(--color-border);
    `,
    filled: `
      background-color: var(--color-surface-hover);
      border: none;
    `,
  };

  const sizeStyles = {
    sm: `
      min-height: 120px;
    `,
    md: `
      min-height: 200px;
    `,
    lg: `
      min-height: 300px;
    `,
  };

  const clickableStyles = clickable ? `
    cursor: pointer;
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
    &:active {
      transform: translateY(0);
    }
  ` : '';

  const focusStyles = clickable ? `
    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  ` : '';

  const cardStyles = `
    ${baseStyles}
    ${variantStyles[variant as keyof typeof variantStyles]}
    ${sizeStyles[size as keyof typeof sizeStyles]}
    ${clickableStyles}
    ${focusStyles}
  `;

  card.style.cssText = cardStyles;

  // Estilos para el header
  const header = card.querySelector('.card-header') as HTMLElement;
  if (header) {
    const headerStyles = `
      padding: var(--space-4) var(--space-4) var(--space-2) var(--space-4);
      border-bottom: 1px solid var(--color-border-light);
    `;
    header.style.cssText = headerStyles;

    // Estilos para el título
    const title = header.querySelector('.card-title') as HTMLElement;
    if (title) {
      const titleStyles = `
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-primary);
        margin: 0 0 var(--space-1) 0;
      `;
      title.style.cssText = titleStyles;
    }

    // Estilos para el subtítulo
    const subtitle = header.querySelector('.card-subtitle') as HTMLElement;
    if (subtitle) {
      const subtitleStyles = `
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        margin: 0;
      `;
      subtitle.style.cssText = subtitleStyles;
    }
  }

  // Estilos para el body
  const body = card.querySelector('.card-body') as HTMLElement;
  if (body) {
    const paddingStyles = {
      none: 'padding: 0;',
      sm: 'padding: var(--space-2);',
      md: 'padding: var(--space-4);',
      lg: 'padding: var(--space-6);',
    };

    const bodyStyles = `
      flex: 1;
      display: flex;
      flex-direction: column;
      ${paddingStyles[padding as keyof typeof paddingStyles]}
    `;
    body.style.cssText = bodyStyles;
  }
}

// Funciones helper para crear cards comunes
export function createStatCard(title: string, value: string, subtitle?: string): HTMLElement {
  const valueElement = document.createElement('div');
  valueElement.className = 'stat-value';
  valueElement.textContent = value;

  const subtitleElement = subtitle ? document.createElement('div') : null;
  if (subtitleElement && subtitle) {
    subtitleElement.className = 'stat-subtitle';
    subtitleElement.textContent = subtitle;
  }

  const children = [valueElement];
  if (subtitleElement) {
    children.push(subtitleElement);
  }

  return createCard({
    title,
    children,
    variant: 'elevated',
    size: 'sm'
  });
}

export function createInfoCard(title: string, content: string): HTMLElement {
  return createCard({
    title,
    children: content,
    variant: 'outlined',
    size: 'md'
  });
}

export function createActionCard(
  title: string, 
  content: string, 
  onClick: () => void
): HTMLElement {
  return createCard({
    title,
    children: content,
    variant: 'elevated',
    size: 'md',
    onClick
  });
}
