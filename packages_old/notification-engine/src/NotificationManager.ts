import * as crypto from 'crypto';

/**
 * Priority levels for notifications.
 */
export type NotificationPriority = 'low' | 'normal' | 'high';

/**
 * Desktop notification item representation.
 * NOTE: Stored strictly in-memory during session lifecycle; never persisted to disk.
 */
export interface Notification {
  id: string;
  title: string;
  message: string;
  icon?: string;
  timestamp: number;
  source: string;
  priority: NotificationPriority;
}

/**
 * Payload provided when pushing a new notification.
 */
export interface PushNotificationInput {
  id?: string;
  title: string;
  message: string;
  icon?: string;
  timestamp?: number;
  source?: string;
  priority?: NotificationPriority;
  duration?: number;
}

export type NotificationCallback = (notification: Notification) => void;
export type DismissCallback = (id: string) => void;

/**
 * NotificationManager handles transient desktop notifications, auto-dismissal
 * timers, priority-based queuing, and privacy protection.
 */
export class NotificationManager {
  private queue: Map<string, Notification> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private defaultDurationMs: number = 5000;

  private pushListeners: Set<NotificationCallback> = new Set();
  private dismissListeners: Set<DismissCallback> = new Set();

  constructor(defaultDurationMs: number = 5000) {
    this.defaultDurationMs = Math.max(0, defaultDurationMs);
  }

  /**
   * Pushes a new notification to the active queue.
   * Dispatches event to registered listeners and begins auto-dismiss timer.
   */
  public push(input: PushNotificationInput): Notification {
    const id = input.id || crypto.randomUUID();
    const timestamp = input.timestamp ?? Date.now();
    const source = input.source ?? 'system';
    const priority: NotificationPriority = input.priority ?? 'normal';

    const notification: Notification = {
      id,
      title: input.title,
      message: input.message,
      icon: input.icon,
      timestamp,
      source,
      priority,
    };

    // Replace existing if ID matches
    if (this.timers.has(id)) {
      clearTimeout(this.timers.get(id)!);
      this.timers.delete(id);
    }

    this.queue.set(id, notification);

    // Determine auto-dismiss duration
    const duration = input.duration !== undefined ? input.duration : this.defaultDurationMs;
    if (duration > 0) {
      const timer = setTimeout(() => {
        this.dismiss(id);
      }, duration);
      this.timers.set(id, timer);
    }

    this.notifyPush(notification);
    return notification;
  }

  /**
   * Dismisses and removes a notification by its unique ID.
   * Returns true if found and removed, false otherwise.
   */
  public dismiss(id: string): boolean {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }

    const existed = this.queue.delete(id);
    if (existed) {
      this.notifyDismiss(id);
    }

    return existed;
  }

  /**
   * Returns all active notifications sorted by priority (high > normal > low)
   * and then by timestamp (newest first).
   */
  public getAll(): Notification[] {
    const priorityWeight: Record<NotificationPriority, number> = {
      high: 3,
      normal: 2,
      low: 1,
    };

    return Array.from(this.queue.values()).sort((a, b) => {
      const pDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (pDiff !== 0) return pDiff;
      return b.timestamp - a.timestamp;
    });
  }

  /**
   * Returns a specific notification by ID.
   */
  public getById(id: string): Notification | undefined {
    return this.queue.get(id);
  }

  /**
   * Returns the current total count of active notifications.
   */
  public getCount(): number {
    return this.queue.size;
  }

  /**
   * Registers a callback fired whenever a new notification is pushed.
   * Returns an unsubscribe function.
   */
  public onNotification(callback: NotificationCallback): () => void {
    this.pushListeners.add(callback);
    return () => {
      this.pushListeners.delete(callback);
    };
  }

  /**
   * Registers a callback fired whenever a notification is dismissed.
   * Returns an unsubscribe function.
   */
  public onDismiss(callback: DismissCallback): () => void {
    this.dismissListeners.add(callback);
    return () => {
      this.dismissListeners.delete(callback);
    };
  }

  /**
   * Clears all pending notifications and cancels all scheduled dismiss timers.
   */
  public clearAll(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();

    const ids = Array.from(this.queue.keys());
    this.queue.clear();

    for (const id of ids) {
      this.notifyDismiss(id);
    }
  }

  /**
   * Sets the global default auto-dismiss duration in milliseconds.
   * Set to 0 to disable automatic dismissal.
   */
  public setDefaultDuration(durationMs: number): void {
    this.defaultDurationMs = Math.max(0, durationMs);
  }

  /**
   * Retrieves the global default auto-dismiss duration in milliseconds.
   */
  public getDefaultDuration(): number {
    return this.defaultDurationMs;
  }

  private notifyPush(notification: Notification): void {
    for (const listener of this.pushListeners) {
      try {
        listener(notification);
      } catch (err) {
        console.error('Error in NotificationManager onNotification listener:', err);
      }
    }
  }

  private notifyDismiss(id: string): void {
    for (const listener of this.dismissListeners) {
      try {
        listener(id);
      } catch (err) {
        console.error('Error in NotificationManager onDismiss listener:', err);
      }
    }
  }
}
