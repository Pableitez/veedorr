export interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  label?: string;
  className?: string;
  'aria-label'?: string;
}

export function createProgress(props: ProgressProps): HTMLElement {
  const {
    value,
    max = 100,
    size = 'md',
    variant = 'default',
    showLabel = false,
    label,
    className = '',
    'aria-label': ariaLabel,
  } = props;

  const container = document.createElement('div');
  container.className = `progress-container ${className}`.trim();

  // Crear label si se proporciona
  if (label) {
    const labelElement = document.createElement('div');
    labelElement.className = 'progress-label';
    labelElement.textContent = label;
    container.appendChild(labelElement);
  }

  // Crear contenedor de la barra de progreso
  const progressWrapper = document.createElement('div');
  progressWrapper.className = 'progress-wrapper';

  // Crear barra de progreso
  const progressBar = document.createElement('div');
  progressBar.className = `progress-bar progress-${size} progress-${variant}`;
  progressBar.setAttribute('role', 'progressbar');
  progressBar.setAttribute('aria-valuenow', value.toString());
  progressBar.setAttribute('aria-valuemin', '0');
  progressBar.setAttribute('aria-valuemax', max.toString());

  if (ariaLabel) {
    progressBar.setAttribute('aria-label', ariaLabel);
  }

  // Crear barra de progreso interna
  const progressFill = document.createElement('div');
  progressFill.className = 'progress-fill';
  progressFill.style.width = `${Math.min(100, Math.max(0, (value / max) * 100))}%`;

  progressBar.appendChild(progressFill);
  progressWrapper.appendChild(progressBar);

  // Crear label de valor si se solicita
  if (showLabel) {
    const valueLabel = document.createElement('div');
    valueLabel.className = 'progress-value-label';
    valueLabel.textContent = `${Math.round((value / max) * 100)}%`;
    progressWrapper.appendChild(valueLabel);
  }

  container.appendChild(progressWrapper);

  // Aplicar estilos
  applyProgressStyles(container, size, variant);

  return container;
}

function applyProgressStyles(
  container: HTMLElement,
  size: string,
  variant: string
): void {
  const containerStyles = `
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  `;

  const labelStyles = `
    .progress-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
    }
  `;

  const wrapperStyles = `
    .progress-wrapper {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }
  `;

  const baseStyles = `
    .progress-bar {
      position: relative;
      background-color: var(--color-surface-hover);
      border-radius: var(--border-radius-full);
      overflow: hidden;
      flex: 1;
    }
    .progress-fill {
      height: 100%;
      border-radius: var(--border-radius-full);
      transition: width var(--transition-normal);
      position: relative;
    }
    .progress-fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      animation: progressShimmer 2s infinite;
    }
  `;

  const sizeStyles = {
    sm: `
      .progress-bar {
        height: 4px;
      }
    `,
    md: `
      .progress-bar {
        height: 8px;
      }
    `,
    lg: `
      .progress-bar {
        height: 12px;
      }
    `,
  };

  const variantStyles = {
    default: `
      .progress-fill {
        background-color: var(--color-primary);
      }
    `,
    success: `
      .progress-fill {
        background-color: var(--color-success);
      }
    `,
    warning: `
      .progress-fill {
        background-color: var(--color-warning);
      }
    `,
    danger: `
      .progress-fill {
        background-color: var(--color-danger);
      }
    `,
  };

  const valueLabelStyles = `
    .progress-value-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-secondary);
      min-width: 40px;
      text-align: right;
    }
  `;

  const animationStyles = `
    @keyframes progressShimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }
  `;

  // Aplicar estilos al contenedor
  container.style.cssText = containerStyles;

  // Crear estilos CSS dinámicos
  const style = document.createElement('style');
  style.textContent = `
    ${labelStyles}
    ${wrapperStyles}
    ${baseStyles}
    ${sizeStyles[size as keyof typeof sizeStyles]}
    ${variantStyles[variant as keyof typeof variantStyles]}
    ${valueLabelStyles}
    ${animationStyles}
  `;
  document.head.appendChild(style);
}

// Función para crear barra de progreso circular
export function createCircularProgress(props: Omit<ProgressProps, 'size'> & { size?: number }): HTMLElement {
  const {
    value,
    max = 100,
    variant = 'default',
    showLabel = true,
    label,
    className = '',
    'aria-label': ariaLabel,
  } = props;

  const size = props.size || 80;
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, (value / max) * 100));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const container = document.createElement('div');
  container.className = `circular-progress-container ${className}`.trim();
  container.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
  `;

  // Crear label si se proporciona
  if (label) {
    const labelElement = document.createElement('div');
    labelElement.className = 'circular-progress-label';
    labelElement.textContent = label;
    labelElement.style.cssText = `
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
    `;
    container.appendChild(labelElement);
  }

  // Crear SVG
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', size.toString());
  svg.setAttribute('height', size.toString());
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.style.cssText = `
    transform: rotate(-90deg);
  `;

  // Círculo de fondo
  const backgroundCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  backgroundCircle.setAttribute('cx', (size / 2).toString());
  backgroundCircle.setAttribute('cy', (size / 2).toString());
  backgroundCircle.setAttribute('r', radius.toString());
  backgroundCircle.setAttribute('fill', 'none');
  backgroundCircle.setAttribute('stroke', 'var(--color-surface-hover)');
  backgroundCircle.setAttribute('stroke-width', '8');
  svg.appendChild(backgroundCircle);

  // Círculo de progreso
  const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  progressCircle.setAttribute('cx', (size / 2).toString());
  progressCircle.setAttribute('cy', (size / 2).toString());
  progressCircle.setAttribute('r', radius.toString());
  progressCircle.setAttribute('fill', 'none');
  progressCircle.setAttribute('stroke', `var(--color-${variant})`);
  progressCircle.setAttribute('stroke-width', '8');
  progressCircle.setAttribute('stroke-linecap', 'round');
  progressCircle.setAttribute('stroke-dasharray', circumference.toString());
  progressCircle.setAttribute('stroke-dashoffset', strokeDashoffset.toString());
  progressCircle.style.cssText = `
    transition: stroke-dashoffset var(--transition-normal);
  `;
  svg.appendChild(progressCircle);

  container.appendChild(svg);

  // Crear label de valor si se solicita
  if (showLabel) {
    const valueLabel = document.createElement('div');
    valueLabel.className = 'circular-progress-value';
    valueLabel.textContent = `${Math.round(progress)}%`;
    valueLabel.style.cssText = `
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    `;
    
    const relativeContainer = document.createElement('div');
    relativeContainer.style.cssText = `
      position: relative;
      display: inline-block;
    `;
    relativeContainer.appendChild(svg);
    relativeContainer.appendChild(valueLabel);
    
    container.replaceChild(relativeContainer, svg);
  }

  // Atributos de accesibilidad
  svg.setAttribute('role', 'progressbar');
  svg.setAttribute('aria-valuenow', value.toString());
  svg.setAttribute('aria-valuemin', '0');
  svg.setAttribute('aria-valuemax', max.toString());
  if (ariaLabel) {
    svg.setAttribute('aria-label', ariaLabel);
  }

  return container;
}

// Funciones helper para crear progress bars comunes
export function createBudgetProgress(
  spent: number,
  limit: number,
  label?: string
): HTMLElement {
  const percentage = (spent / limit) * 100;
  const variant = percentage >= 100 ? 'danger' : percentage >= 80 ? 'warning' : 'success';
  
  return createProgress({
    value: spent,
    max: limit,
    variant,
    showLabel: true,
    label: label || 'Presupuesto'
  });
}

export function createLoadingProgress(): HTMLElement {
  return createProgress({
    value: 0,
    variant: 'default',
    showLabel: true,
    label: 'Cargando...'
  });
}
