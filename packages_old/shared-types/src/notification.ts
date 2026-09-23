/**
 * Priority levels for notifications.
 */
export type NotificationPriority = 'low' | 'normal' | 'high';

/**
 * Standard notification structure received or displayed by Bubu.
 */
export interface BubuNotification {
  id: string;
  title: string;
  message: string;
  icon?: string;
  timestamp: number;
  source: string;
  priority: NotificationPriority;
}

/**
 * Notification handler settings and display duration.
 */
export interface NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  previewEnabled: boolean;
  reactionEnabled: boolean;
  durationMs: number;
}
