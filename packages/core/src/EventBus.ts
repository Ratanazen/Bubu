/**
 * EventBus - A typed, production-quality publish/subscribe event bus
 * with historical tracking and error boundary per listener.
 */

export interface BusEvent<T = any> {
  type: string;
  payload?: T;
  timestamp: number;
}

export type EventHandler<T = any> = (event: BusEvent<T>) => void;

export class EventBus {
  private listeners: Map<string, Set<EventHandler>> = new Map();
  private history: Array<BusEvent> = [];
  private maxHistory: number = 100;

  constructor(maxHistory: number = 100) {
    if (maxHistory >= 0) {
      this.maxHistory = maxHistory;
    }
  }

  /**
   * Subscribes an event handler for the given event type.
   * Supports wildcard '*' to listen to all events.
   * Returns an unsubscribe function.
   */
  subscribe<T = any>(type: string, handler: EventHandler<T>): () => void {
    if (!type || typeof type !== 'string') {
      throw new TypeError('Event type must be a non-empty string');
    }
    if (typeof handler !== 'function') {
      throw new TypeError('Event handler must be a function');
    }

    let set = this.listeners.get(type);
    if (!set) {
      set = new Set<EventHandler>();
      this.listeners.set(type, set);
    }

    set.add(handler as EventHandler);

    let unsubscribed = false;
    return () => {
      if (unsubscribed) return;
      unsubscribed = true;
      const currentSet = this.listeners.get(type);
      if (currentSet) {
        currentSet.delete(handler as EventHandler);
        if (currentSet.size === 0) {
          this.listeners.delete(type);
        }
      }
    };
  }

  /**
   * Emits an event with the given type and optional payload.
   * Stores the emitted event in the event history.
   */
  emit<T = any>(type: string, payload?: T): void {
    if (!type || typeof type !== 'string') {
      throw new TypeError('Event type must be a non-empty string');
    }

    const event: BusEvent<T> = {
      type,
      payload,
      timestamp: Date.now()
    };

    // Store in history
    if (this.maxHistory > 0) {
      this.history.push(event);
      if (this.history.length > this.maxHistory) {
        this.history.splice(0, this.history.length - this.maxHistory);
      }
    }

    // Call direct listeners
    const directListeners = this.listeners.get(type);
    if (directListeners && directListeners.size > 0) {
      const snapshot = Array.from(directListeners);
      for (const listener of snapshot) {
        try {
          listener(event);
        } catch (error) {
          console.error(`[EventBus] Error in listener for event "${type}":`, error);
        }
      }
    }

    // Call wildcard listeners
    if (type !== '*') {
      const wildcardListeners = this.listeners.get('*');
      if (wildcardListeners && wildcardListeners.size > 0) {
        const snapshot = Array.from(wildcardListeners);
        for (const listener of snapshot) {
          try {
            listener(event);
          } catch (error) {
            console.error(`[EventBus] Error in wildcard listener for event "${type}":`, error);
          }
        }
      }
    }
  }

  /**
   * Subscribes a handler that executes once and then unsubscribes itself.
   */
  once<T = any>(type: string, handler: EventHandler<T>): () => void {
    let unsubscribe: () => void;
    const onceWrapper: EventHandler<T> = (event) => {
      try {
        unsubscribe();
      } finally {
        handler(event);
      }
    };
    unsubscribe = this.subscribe(type, onceWrapper);
    return unsubscribe;
  }

  /**
   * Returns a copy of the event history, optionally filtered by type.
   */
  getHistory(type?: string): Array<BusEvent> {
    if (type) {
      return this.history.filter((e) => e.type === type).map((e) => ({ ...e }));
    }
    return this.history.map((e) => ({ ...e }));
  }

  /**
   * Clears event history.
   */
  clearHistory(): void {
    this.history = [];
  }

  /**
   * Clears all listeners and event history.
   */
  clear(): void {
    this.listeners.clear();
    this.history = [];
  }

  /**
   * Removes all listeners for a given event type, or all listeners if no type is passed.
   */
  removeAllListeners(type?: string): void {
    if (type) {
      this.listeners.delete(type);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Returns the count of active listeners for a type, or total across all types.
   */
  listenerCount(type?: string): number {
    if (type) {
      return this.listeners.get(type)?.size ?? 0;
    }
    let total = 0;
    for (const set of this.listeners.values()) {
      total += set.size;
    }
    return total;
  }

  /**
   * Updates the maximum history capacity.
   */
  setMaxHistory(max: number): void {
    this.maxHistory = Math.max(0, max);
    if (this.history.length > this.maxHistory) {
      this.history.splice(0, this.history.length - this.maxHistory);
    }
  }
}

export const globalEventBus = new EventBus();
