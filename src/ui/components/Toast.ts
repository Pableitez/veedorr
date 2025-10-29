export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  closable?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  className?: string;
  onClose?: () => void;
}

export class ToastManager {
  private static instance: ToastManager;
  private container: HTMLElement;
  private toasts: Map<string, HTMLElement> = new Map();

  private constructor() {
    this.container = this.createContainer();
    document.body.appendChild(this.container);
  }

  static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    return container;
  }

  show(props: ToastProps): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toast = this.createToast(id, props);
    
    this.toasts.set(id, toast);
    this.container.appendChild(toast);

    // Auto-remove si tiene duración
    if (props.duration && props.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, props.duration);
    }

    return id;
  }

  remove(id: string): void {
    const toast = this.toasts.get(id);
    if (toast) {
      toast.classList.add('toast-removing');
      setTimeout(() => {
        toast.remove();
        this.toasts.delete(id);
      }, 300);
    }
  }

  clear(): void {
    this.toasts.forEach((toast) => {
      toast.classList.add('toast-removing');
      setTimeout(() => toast.remove(), 300);
    });
    this.toasts.clear();
  }

  private createToast(id: string, props: ToastProps): HTMLElement {
    const {
      message,
      type = 'info',
      closable = true,
      position = 'top-right',
      className = '',
      onClose,
    } = props;

    const toast = document.createElement('div');
    toast.id = id;
    toast.className = `toast toast-${type} ${className}`.trim();
    toast.setAttribute('role', 'alert');

    // Crear contenido del toast
    const content = document.createElement('div');
    content.className = 'toast-content';

    // Icono según el tipo
    const icon = this.createIcon(type);
    content.appendChild(icon);

    // Mensaje
    const messageElement = document.createElement('span');
    messageElement.className = 'toast-message';
    messageElement.textContent = message;
    content.appendChild(messageElement);

    toast.appendChild(content);

    // Botón de cerrar
    if (closable) {
      const closeButton = document.createElement('button');
      closeButton.className = 'toast-close';
      closeButton.innerHTML = '×';
      closeButton.setAttribute('aria-label', 'Cerrar notificación');
      closeButton.addEventListener('click', () => {
        this.remove(id);
        if (onClose) onClose();
      });
      toast.appendChild(closeButton);
    }

    // Aplicar estilos
    this.applyToastStyles(toast, type, position);

    // Animación de entrada
    setTimeout(() => {
      toast.classList.add('toast-show');
    }, 10);

    return toast;
  }

  private createIcon(type: string): HTMLElement {
    const icon = document.createElement('span');
    icon.className = 'toast-icon';

    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };

    icon.textContent = icons[type as keyof typeof icons] || icons.info;
    return icon;
  }

  private applyToastStyles(toast: HTMLElement, type: string, position: string): void {
    const baseStyles = `
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4);
      margin-bottom: var(--space-2);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-lg);
      font-family: var(--font-family);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-normal);
      max-width: 400px;
      opacity: 0;
      transform: translateX(100%);
      transition: all var(--transition-normal);
    `;

    const typeStyles = {
      success: `
        background-color: var(--color-success-light);
        color: var(--color-success-dark);
        border-left: 4px solid var(--color-success);
      `,
      error: `
        background-color: var(--color-danger-light);
        color: var(--color-danger-dark);
        border-left: 4px solid var(--color-danger);
      `,
      warning: `
        background-color: var(--color-warning-light);
        color: var(--color-warning-dark);
        border-left: 4px solid var(--color-warning);
      `,
      info: `
        background-color: var(--color-info-light);
        color: var(--color-info-dark);
        border-left: 4px solid var(--color-info);
      `,
    };

    const positionStyles = {
      'top-right': `
        position: fixed;
        top: var(--space-4);
        right: var(--space-4);
        z-index: var(--z-toast);
      `,
      'top-left': `
        position: fixed;
        top: var(--space-4);
        left: var(--space-4);
        z-index: var(--z-toast);
      `,
      'bottom-right': `
        position: fixed;
        bottom: var(--space-4);
        right: var(--space-4);
        z-index: var(--z-toast);
        transform: translateX(100%);
      `,
      'bottom-left': `
        position: fixed;
        bottom: var(--space-4);
        left: var(--space-4);
        z-index: var(--z-toast);
        transform: translateX(-100%);
      `,
      'top-center': `
        position: fixed;
        top: var(--space-4);
        left: 50%;
        transform: translateX(-50%);
        z-index: var(--z-toast);
      `,
      'bottom-center': `
        position: fixed;
        bottom: var(--space-4);
        left: 50%;
        transform: translateX(-50%);
        z-index: var(--z-toast);
      `,
    };

    const showStyles = `
      .toast-show {
        opacity: 1;
        transform: translateX(0);
      }
    `;

    const removingStyles = `
      .toast-removing {
        opacity: 0;
        transform: translateX(100%);
      }
    `;

    const contentStyles = `
      .toast-content {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        flex: 1;
      }
      .toast-icon {
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-base);
      }
      .toast-message {
        flex: 1;
      }
      .toast-close {
        background: none;
        border: none;
        font-size: var(--font-size-lg);
        color: inherit;
        cursor: pointer;
        padding: var(--space-1);
        border-radius: var(--border-radius-sm);
        transition: background-color var(--transition-fast);
        opacity: 0.7;
      }
      .toast-close:hover {
        background-color: rgba(0, 0, 0, 0.1);
        opacity: 1;
      }
    `;

    // Aplicar estilos al toast
    const toastStyles = `
      ${baseStyles}
      ${typeStyles[type as keyof typeof typeStyles]}
      ${positionStyles[position as keyof typeof positionStyles]}
    `;
    toast.style.cssText = toastStyles;

    // Crear estilos CSS dinámicos
    const style = document.createElement('style');
    style.textContent = `
      ${showStyles}
      ${removingStyles}
      ${contentStyles}
    `;
    document.head.appendChild(style);
  }
}

// Funciones de conveniencia
export function showToast(props: ToastProps): string {
  return ToastManager.getInstance().show(props);
}

export function showSuccess(message: string, duration?: number): string {
  return showToast({ message, type: 'success', duration });
}

export function showError(message: string, duration?: number): string {
  return showToast({ message, type: 'error', duration });
}

export function showWarning(message: string, duration?: number): string {
  return showToast({ message, type: 'warning', duration });
}

export function showInfo(message: string, duration?: number): string {
  return showToast({ message, type: 'info', duration });
}

export function removeToast(id: string): void {
  ToastManager.getInstance().remove(id);
}

export function clearToasts(): void {
  ToastManager.getInstance().clear();
}
