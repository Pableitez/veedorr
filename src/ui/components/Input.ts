export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
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

export function createInput(props: InputProps): HTMLElement {
  const {
    type = 'text',
    placeholder,
    value = '',
    disabled = false,
    required = false,
    readonly = false,
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
  container.className = `input-container ${className}`.trim();

  // Crear label si se proporciona
  if (label) {
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.className = 'input-label';
    if (required) {
      labelElement.innerHTML += ' <span class="required-asterisk">*</span>';
    }
    container.appendChild(labelElement);
  }

  // Crear input
  const input = document.createElement('input');
  input.type = type;
  input.value = value;
  input.placeholder = placeholder || '';
  input.disabled = disabled;
  input.readOnly = readonly;
  input.required = required;
  input.className = `input input-${size} input-${variant}`;

  // Atributos de accesibilidad
  if (ariaLabel) {
    input.setAttribute('aria-label', ariaLabel);
  }
  if (ariaDescribedby) {
    input.setAttribute('aria-describedby', ariaDescribedby);
  }
  if (ariaInvalid !== undefined) {
    input.setAttribute('aria-invalid', ariaInvalid.toString());
  }
  if (required) {
    input.setAttribute('aria-required', 'true');
  }

  // Generar ID único para asociar label e input
  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
  input.id = inputId;
  
  if (label) {
    const labelElement = container.querySelector('.input-label') as HTMLElement;
    if (labelElement) {
      labelElement.setAttribute('for', inputId);
    }
  }

  // Event listeners
  if (onChange) {
    input.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      onChange(target.value);
    });
  }

  if (onFocus) {
    input.addEventListener('focus', onFocus);
  }

  if (onBlur) {
    input.addEventListener('blur', onBlur);
  }

  container.appendChild(input);

  // Crear texto de ayuda o error
  if (helperText || errorText) {
    const textElement = document.createElement('div');
    textElement.className = errorText ? 'input-error-text' : 'input-helper-text';
    textElement.textContent = errorText || helperText || '';
    container.appendChild(textElement);
  }

  // Aplicar estilos
  applyInputStyles(container, input, size, variant, disabled, readonly);

  return container;
}

function applyInputStyles(
  container: HTMLElement,
  input: HTMLInputElement,
  size: string,
  variant: string,
  disabled: boolean,
  readonly: boolean
): void {
  const containerStyles = `
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
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

  const inputBaseStyles = `
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

  const readonlyStyles = readonly ? `
    background-color: var(--color-surface);
    cursor: default;
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
  const label = container.querySelector('.input-label') as HTMLElement;
  if (label) {
    label.style.cssText = labelStyles;
    
    const asterisk = label.querySelector('.required-asterisk') as HTMLElement;
    if (asterisk) {
      asterisk.style.cssText = requiredAsteriskStyles;
    }
  }

  // Aplicar estilos al input
  const inputStyles = `
    ${inputBaseStyles}
    ${sizeStyles[size as keyof typeof sizeStyles]}
    ${variantStyles[variant as keyof typeof variantStyles]}
    ${disabledStyles}
    ${readonlyStyles}
  `;
  input.style.cssText = inputStyles;

  // Aplicar estilos al texto de ayuda/error
  const helperText = container.querySelector('.input-helper-text') as HTMLElement;
  const errorText = container.querySelector('.input-error-text') as HTMLElement;
  
  if (helperText) {
    helperText.style.cssText = helperTextStyles;
  }
  if (errorText) {
    errorText.style.cssText = errorTextStyles;
  }
}

// Funciones helper para crear inputs comunes
export function createTextInput(placeholder?: string, onChange?: (value: string) => void): HTMLElement {
  return createInput({ type: 'text', placeholder, onChange });
}

export function createEmailInput(placeholder?: string, onChange?: (value: string) => void): HTMLElement {
  return createInput({ type: 'email', placeholder, onChange });
}

export function createPasswordInput(placeholder?: string, onChange?: (value: string) => void): HTMLElement {
  return createInput({ type: 'password', placeholder, onChange });
}

export function createNumberInput(placeholder?: string, onChange?: (value: string) => void): HTMLElement {
  return createInput({ type: 'number', placeholder, onChange });
}
