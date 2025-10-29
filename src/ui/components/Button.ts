export interface ButtonProps {
  children: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export function createButton(props: ButtonProps): HTMLButtonElement {
  const {
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    type = 'button',
    onClick,
    className = '',
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
  } = props;

  const button = document.createElement('button');
  button.type = type;
  button.textContent = children;
  button.disabled = disabled || loading;
  
  // Clases base
  button.className = `btn btn-${variant} btn-${size} ${className}`.trim();
  
  // Atributos de accesibilidad
  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }
  if (ariaDescribedby) {
    button.setAttribute('aria-describedby', ariaDescribedby);
  }
  if (loading) {
    button.setAttribute('aria-busy', 'true');
  }

  // Event listeners
  if (onClick) {
    button.addEventListener('click', onClick);
  }

  // Aplicar estilos
  applyButtonStyles(button, variant, size, disabled, loading);

  return button;
}

function applyButtonStyles(
  button: HTMLButtonElement, 
  variant: string, 
  size: string, 
  disabled: boolean, 
  loading: boolean
): void {
  const baseStyles = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: var(--border-radius);
    font-family: var(--font-family);
    font-weight: var(--font-weight-medium);
    text-decoration: none;
    cursor: pointer;
    transition: all var(--transition-fast);
    position: relative;
    outline: none;
  `;

  const sizeStyles = {
    sm: `
      padding: var(--space-2) var(--space-3);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-tight);
    `,
    md: `
      padding: var(--space-3) var(--space-4);
      font-size: var(--font-size-base);
      line-height: var(--line-height-normal);
    `,
    lg: `
      padding: var(--space-4) var(--space-6);
      font-size: var(--font-size-lg);
      line-height: var(--line-height-normal);
    `,
  };

  const variantStyles = {
    primary: `
      background-color: var(--color-primary);
      color: var(--color-text-inverse);
    `,
    secondary: `
      background-color: var(--color-secondary);
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
    ghost: `
      background-color: transparent;
      color: var(--color-primary);
      border: 1px solid var(--color-border);
    `,
  };

  const disabledStyles = disabled || loading ? `
    opacity: 0.6;
    cursor: not-allowed;
  ` : '';

  const hoverStyles = !disabled && !loading ? `
    &:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
  ` : '';

  const focusStyles = `
    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  `;

  // Aplicar estilos específicos por variante
  const variantHoverStyles = {
    primary: !disabled && !loading ? `
      &:hover {
        background-color: var(--color-primary-hover);
      }
    ` : '',
    secondary: !disabled && !loading ? `
      &:hover {
        background-color: var(--color-secondary-hover);
      }
    ` : '',
    success: !disabled && !loading ? `
      &:hover {
        background-color: var(--color-success-hover);
      }
    ` : '',
    warning: !disabled && !loading ? `
      &:hover {
        background-color: var(--color-warning-hover);
      }
    ` : '',
    danger: !disabled && !loading ? `
      &:hover {
        background-color: var(--color-danger-hover);
      }
    ` : '',
    ghost: !disabled && !loading ? `
      &:hover {
        background-color: var(--color-surface-hover);
      }
    ` : '',
  };

  const allStyles = `
    ${baseStyles}
    ${sizeStyles[size as keyof typeof sizeStyles]}
    ${variantStyles[variant as keyof typeof variantStyles]}
    ${disabledStyles}
    ${hoverStyles}
    ${focusStyles}
    ${variantHoverStyles[variant as keyof typeof variantHoverStyles]}
  `;

  button.style.cssText = allStyles;

  // Agregar indicador de loading si es necesario
  if (loading) {
    const spinner = document.createElement('span');
    spinner.className = 'btn-spinner';
    spinner.innerHTML = '⟳';
    spinner.style.cssText = `
      display: inline-block;
      margin-right: var(--space-2);
      animation: spin 1s linear infinite;
    `;
    
    // Insertar spinner antes del texto
    button.insertBefore(spinner, button.firstChild);
  }
}

// Función helper para crear botones con estilos predefinidos
export function createPrimaryButton(children: string, onClick?: () => void): HTMLButtonElement {
  return createButton({ children, variant: 'primary', onClick });
}

export function createSecondaryButton(children: string, onClick?: () => void): HTMLButtonElement {
  return createButton({ children, variant: 'secondary', onClick });
}

export function createDangerButton(children: string, onClick?: () => void): HTMLButtonElement {
  return createButton({ children, variant: 'danger', onClick });
}

export function createGhostButton(children: string, onClick?: () => void): HTMLButtonElement {
  return createButton({ children, variant: 'ghost', onClick });
}
