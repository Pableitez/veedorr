export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'error' | 'success';
  label?: string;
  helperText?: string;
  errorText?: string;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function createSelect(props: SelectProps): HTMLElement {
  const {
    options,
    value = '',
    placeholder,
    disabled = false,
    required = false,
    size = 'md',
    variant = 'default',
    label,
    helperText,
    errorText,
    className = '',
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
    'aria-invalid': ariaInvalid,
    onChange,
    onFocus,
    onBlur,
  } = props;

  const container = document.createElement('div');
  container.className = `select-container ${className}`.trim();

  // Crear label si se proporciona
  if (label) {
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.className = 'select-label';
    if (required) {
      labelElement.innerHTML += ' <span class="required-asterisk">*</span>';
    }
    container.appendChild(labelElement);
  }

  // Crear select
  const select = document.createElement('select');
  select.value = value;
  select.disabled = disabled;
  select.required = required;
  select.className = `select select-${size} select-${variant}`;

  // Atributos de accesibilidad
  if (ariaLabel) {
    select.setAttribute('aria-label', ariaLabel);
  }
  if (ariaDescribedby) {
    select.setAttribute('aria-describedby', ariaDescribedby);
  }
  if (ariaInvalid !== undefined) {
    select.setAttribute('aria-invalid', ariaInvalid.toString());
  }
  if (required) {
    select.setAttribute('aria-required', 'true');
  }

  // Generar ID único para asociar label e select
  const selectId = `select-${Math.random().toString(36).substr(2, 9)}`;
  select.id = selectId;
  
  if (label) {
    const labelElement = container.querySelector('.select-label') as HTMLElement;
    if (labelElement) {
      labelElement.setAttribute('for', selectId);
    }
  }

  // Crear opciones
  if (placeholder) {
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = placeholder;
    placeholderOption.disabled = true;
    placeholderOption.selected = !value;
    select.appendChild(placeholderOption);
  }

  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.textContent = option.label;
    optionElement.disabled = option.disabled || false;
    optionElement.selected = option.value === value;
    select.appendChild(optionElement);
  });

  // Event listeners
  if (onChange) {
    select.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      onChange(target.value);
    });
  }

  if (onFocus) {
    select.addEventListener('focus', onFocus);
  }

  if (onBlur) {
    select.addEventListener('blur', onBlur);
  }

  container.appendChild(select);

  // Crear texto de ayuda o error
  if (helperText || errorText) {
    const textElement = document.createElement('div');
    textElement.className = errorText ? 'select-error-text' : 'select-helper-text';
    textElement.textContent = errorText || helperText || '';
    container.appendChild(textElement);
  }

  // Aplicar estilos
  applySelectStyles(container, select, size, variant, disabled);

  return container;
}

function applySelectStyles(
  container: HTMLElement,
  select: HTMLSelectElement,
  size: string,
  variant: string,
  disabled: boolean
): void {
  const containerStyles = `
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    position: relative;
  `;

  const labelStyles = `
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
  `;

  const requiredAsteriskStyles = `
    color: var(--color-danger);
    margin-left: var(--space-1);
  `;

  const selectBaseStyles = `
    width: 100%;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    font-family: var(--font-family);
    font-size: var(--font-size-base);
    line-height: var(--line-height-normal);
    color: var(--color-text-primary);
    background-color: var(--color-background);
    transition: all var(--transition-fast);
    outline: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-position: right var(--space-3) center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: var(--space-10);
  `;

  const sizeStyles = {
    sm: `
      padding: var(--space-2) var(--space-3);
      font-size: var(--font-size-sm);
    `,
    md: `
      padding: var(--space-3) var(--space-4);
      font-size: var(--font-size-base);
    `,
    lg: `
      padding: var(--space-4) var(--space-5);
      font-size: var(--font-size-lg);
    `,
  };

  const variantStyles = {
    default: `
      border-color: var(--color-border);
      &:focus {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px var(--color-primary-light);
      }
    `,
    error: `
      border-color: var(--color-danger);
      &:focus {
        border-color: var(--color-danger);
        box-shadow: 0 0 0 3px var(--color-danger-light);
      }
    `,
    success: `
      border-color: var(--color-success);
      &:focus {
        border-color: var(--color-success);
        box-shadow: 0 0 0 3px var(--color-success-light);
      }
    `,
  };

  const disabledStyles = disabled ? `
    background-color: var(--color-surface);
    color: var(--color-text-tertiary);
    cursor: not-allowed;
    opacity: 0.6;
  ` : '';

  const helperTextStyles = `
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
  `;

  const errorTextStyles = `
    font-size: var(--font-size-xs);
    color: var(--color-danger);
  `;

  // Aplicar estilos al contenedor
  container.style.cssText = containerStyles;

  // Aplicar estilos al label
  const label = container.querySelector('.select-label') as HTMLElement;
  if (label) {
    label.style.cssText = labelStyles;
    
    const asterisk = label.querySelector('.required-asterisk') as HTMLElement;
    if (asterisk) {
      asterisk.style.cssText = requiredAsteriskStyles;
    }
  }

  // Aplicar estilos al select
  const selectStyles = `
    ${selectBaseStyles}
    ${sizeStyles[size as keyof typeof sizeStyles]}
    ${variantStyles[variant as keyof typeof variantStyles]}
    ${disabledStyles}
  `;
  select.style.cssText = selectStyles;

  // Aplicar estilos al texto de ayuda/error
  const helperText = container.querySelector('.select-helper-text') as HTMLElement;
  const errorText = container.querySelector('.select-error-text') as HTMLElement;
  
  if (helperText) {
    helperText.style.cssText = helperTextStyles;
  }
  if (errorText) {
    errorText.style.cssText = errorTextStyles;
  }
}

// Funciones helper para crear selects comunes
export function createCategorySelect(
  categories: Array<{ id: string; nombre: string }>,
  onChange?: (value: string) => void
): HTMLElement {
  const options: SelectOption[] = [
    { value: '', label: 'Seleccionar categoría' },
    ...categories.map(cat => ({
      value: cat.id,
      label: cat.nombre
    }))
  ];

  return createSelect({
    options,
    placeholder: 'Seleccionar categoría',
    onChange
  });
}

export function createTypeSelect(onChange?: (value: string) => void): HTMLElement {
  const options: SelectOption[] = [
    { value: '', label: 'Seleccionar tipo' },
    { value: 'income', label: 'Ingreso' },
    { value: 'expense', label: 'Gasto' }
  ];

  return createSelect({
    options,
    placeholder: 'Seleccionar tipo',
    onChange
  });
}
