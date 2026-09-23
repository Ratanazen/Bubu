/**
 * Global system and interaction event types across Bubu applications.
 */
export type BubuEventType =
  | 'APP_OPENED'
  | 'APP_FOCUSED'
  | 'APP_CLOSED'
  | 'NOTIFICATION_RECEIVED'
  | 'MUSIC_STARTED'
  | 'MUSIC_PAUSED'
  | 'MUSIC_CHANGED'
  | 'MUSIC_STOPPED'
  | 'MUSIC_POSITION'
  | 'LYRICS_READY'
  | 'LYRICS_UNAVAILABLE'
  | 'LYRICS_LINE_CHANGED'
  | 'USER_CLICKED'
  | 'USER_DRAGGED'
  | 'USER_DOUBLE_CLICKED'
  | 'SKIN_CHANGED'
  | 'STYLE_CHANGED'
  | 'SETTINGS_CHANGED'
  | 'BROWSER_CONNECTED'
  | 'BROWSER_DISCONNECTED'
  | 'SLEEP'
  | 'WAKE'
  | 'PET_SHOW'
  | 'PET_HIDE'
  | 'PET_PAUSE'
  | 'PET_RESUME';

/**
 * Standard event envelope passed across event buses and window communication.
 */
export interface BubuEvent<T = any> {
  type: BubuEventType;
  payload?: T;
  timestamp: number;
}
