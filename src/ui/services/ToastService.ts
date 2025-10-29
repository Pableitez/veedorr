import { showToast } from '../components/Toast';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

class ToastService {
  private container: HTMLElement | null = null;

  constructor() {
    this.createContainer();
  }

  private createContainer(): void {
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(this.container);
  }

  show(options: ToastOptions): void {
    showToast({
      message: options.title + (options.message ? `: ${options.message}` : ''),
      type: options.type,
      duration: options.duration || 5000
    });
  }

  success(title: string, message?: string, duration?: number): void {
    this.show({ type: 'success', title, message, duration });
  }

  error(title: string, message?: string, duration?: number): void {
    this.show({ type: 'error', title, message, duration });
  }

  warning(title: string, message?: string, duration?: number): void {
    this.show({ type: 'warning', title, message, duration });
  }

  info(title: string, message?: string, duration?: number): void {
    this.show({ type: 'info', title, message, duration });
  }
}

export const toastService = new ToastService();
