import { Store, StoreState } from '../../shared/types';

export class SimpleStore implements Store<StoreState> {
  private state: StoreState;
  private subscribers: Set<(state: StoreState) => void> = new Set();

  constructor(initialState: StoreState) {
    this.state = initialState;
  }

  getState(): StoreState {
    return this.state;
  }

  setState(newState: StoreState): void {
    this.state = newState;
    this.notifySubscribers();
  }

  subscribe(callback: (state: StoreState) => void): () => void {
    this.subscribers.add(callback);
    
    // Devolver función de unsubscribe
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => {
      try {
        callback(this.state);
      } catch (error) {
        console.error('Error en subscriber del store:', error);
      }
    });
  }
}
