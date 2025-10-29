export interface ModalProps {
  title?: string;
  children: HTMLElement | HTMLElement[] | string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  backdrop?: boolean;
  className?: string;
  onClose?: () => void;
  'aria-label'?: string;
}

export function createModal(props: ModalProps): HTMLElement {
  const {
    title,
    children,
    size = 'md',
    closable = true,
    backdrop = true,
    className = '',
    onClose,
    'aria-label': ariaLabel,
  } = props;

  const modal = document.createElement('div');
  modal.className = `modal modal-${size} ${className}`.trim();
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('tabindex', '-1');

  if (ariaLabel) {
    modal.setAttribute('aria-label', ariaLabel);
  } else if (title) {
    modal.setAttribute('aria-labelledby', 'modal-title');
  }

  // Crear backdrop
  if (backdrop) {
    const backdropElement = document.createElement('div');
    backdropElement.className = 'modal-backdrop';
    backdropElement.addEventListener('click', () => {
      if (onClose) onClose();
    });
    modal.appendChild(backdropElement);
  }

  // Crear contenedor del modal
  const modalContainer = document.createElement('div');
  modalContainer.className = 'modal-container';

  // Crear header si hay título
  if (title || closable) {
    const header = document.createElement('div');
    header.className = 'modal-header';

    if (title) {
      const titleElement = document.createElement('h2');
      titleElement.id = 'modal-title';
      titleElement.className = 'modal-title';
      titleElement.textContent = title;
      header.appendChild(titleElement);
    }

    if (closable) {
      const closeButton = document.createElement('button');
      closeButton.className = 'modal-close';
      closeButton.innerHTML = '×';
      closeButton.setAttribute('aria-label', 'Cerrar modal');
      closeButton.addEventListener('click', () => {
        if (onClose) onClose();
      });
      header.appendChild(closeButton);
    }

    modalContainer.appendChild(header);
  }

  // Crear body con contenido
  const body = document.createElement('div');
  body.className = 'modal-body';

  if (typeof children === 'string') {
    body.textContent = children;
  } else if (Array.isArray(children)) {
    children.forEach(child => body.appendChild(child));
  } else {
    body.appendChild(children);
  }

  modalContainer.appendChild(body);
  modal.appendChild(modalContainer);

  // Aplicar estilos
  applyModalStyles(modal, size);

  // Manejar teclado
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && onClose) {
      onClose();
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  // Limpiar event listener cuando se cierre el modal
  const originalOnClose = onClose;
  if (originalOnClose) {
    modal.addEventListener('close', () => {
      document.removeEventListener('keydown', handleKeyDown);
    });
  }

  return modal;
}

function applyModalStyles(modal: HTMLElement, size: string): void {
  const baseStyles = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: var(--z-modal);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-4);
  `;

  const backdropStyles = `
    .modal-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(2px);
    }
  `;

  const containerStyles = `
    .modal-container {
      position: relative;
      background-color: var(--color-surface);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-xl);
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: modalSlideIn 0.3s ease-out;
    }
  `;

  const sizeStyles = {
    sm: `
      .modal-container {
        width: 100%;
        max-width: 400px;
      }
    `,
    md: `
      .modal-container {
        width: 100%;
        max-width: 600px;
      }
    `,
    lg: `
      .modal-container {
        width: 100%;
        max-width: 800px;
      }
    `,
    xl: `
      .modal-container {
        width: 100%;
        max-width: 1000px;
      }
    `,
    full: `
      .modal-container {
        width: 100vw;
        height: 100vh;
        max-width: none;
        max-height: none;
        border-radius: 0;
      }
    `,
  };

  const headerStyles = `
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-4) var(--space-6);
      border-bottom: 1px solid var(--color-border-light);
    }
    .modal-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin: 0;
    }
    .modal-close {
      background: none;
      border: none;
      font-size: var(--font-size-2xl);
      color: var(--color-text-secondary);
      cursor: pointer;
      padding: var(--space-1);
      border-radius: var(--border-radius);
      transition: all var(--transition-fast);
    }
    .modal-close:hover {
      background-color: var(--color-surface-hover);
      color: var(--color-text-primary);
    }
  `;

  const bodyStyles = `
    .modal-body {
      padding: var(--space-6);
      overflow-y: auto;
      flex: 1;
    }
  `;

  const animationStyles = `
    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `;

  // Aplicar estilos al modal
  modal.style.cssText = baseStyles;

  // Crear estilos CSS dinámicos
  const style = document.createElement('style');
  style.textContent = `
    ${backdropStyles}
    ${containerStyles}
    ${sizeStyles[size as keyof typeof sizeStyles]}
    ${headerStyles}
    ${bodyStyles}
    ${animationStyles}
  `;
  document.head.appendChild(style);
}

// Funciones helper para crear modales comunes
export function createConfirmModal(
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
): HTMLElement {
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'flex gap-3 justify-end';

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancelar';
  cancelButton.className = 'btn btn-secondary';
  cancelButton.addEventListener('click', () => {
    if (onCancel) onCancel();
    closeModal();
  });

  const confirmButton = document.createElement('button');
  confirmButton.textContent = 'Confirmar';
  confirmButton.className = 'btn btn-danger';
  confirmButton.addEventListener('click', () => {
    onConfirm();
    closeModal();
  });

  buttonsContainer.appendChild(cancelButton);
  buttonsContainer.appendChild(confirmButton);

  const modal = createModal({
    title,
    children: [message, buttonsContainer],
    size: 'sm',
    onClose: onCancel
  });

  const closeModal = () => {
    modal.remove();
  };

  return modal;
}

export function createAlertModal(
  title: string,
  message: string,
  onClose?: () => void
): HTMLElement {
  const button = document.createElement('button');
  button.textContent = 'Aceptar';
  button.className = 'btn btn-primary';
  button.addEventListener('click', () => {
    if (onClose) onClose();
    modal.remove();
  });

  const modal = createModal({
    title,
    children: [message, button],
    size: 'sm',
    onClose
  });

  return modal;
}

// Función para mostrar modal
export function showModal(modal: HTMLElement): void {
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  
  // Focus en el modal
  const focusableElement = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
  if (focusableElement) {
    focusableElement.focus();
  }
}

// Función para cerrar modal
export function closeModal(modal: HTMLElement): void {
  modal.remove();
  document.body.style.overflow = '';
}
