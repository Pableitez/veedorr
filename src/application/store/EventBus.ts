export type EventHandler<T = any> = (payload: T) => void;

export class EventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map();

  on<T = any>(event: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    
    this.handlers.get(event)!.add(handler);
    
    // Devolver función de unsubscribe
    return () => {
      this.handlers.get(event)?.delete(handler);
    };
  }

  off(event: string, handler: EventHandler): void {
    this.handlers.get(event)?.delete(handler);
  }

  emit<T = any>(event: string, payload: T): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      eventHandlers.forEach(handler => {
        try {
          handler(payload);
        } catch (error) {
          console.error(`Error en handler del evento ${event}:`, error);
        }
      });
    }
  }

  once<T = any>(event: string, handler: EventHandler<T>): void {
    const onceHandler = (payload: T) => {
      handler(payload);
      this.off(event, onceHandler);
    };
    
    this.on(event, onceHandler);
  }

  clear(): void {
    this.handlers.clear();
  }

  getEventNames(): string[] {
    return Array.from(this.handlers.keys());
  }

  getHandlerCount(event: string): number {
    return this.handlers.get(event)?.size || 0;
  }
}
