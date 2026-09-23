import type { BehaviorSettings } from './behavior';
import type { LyricsDisplayConfig } from './lyrics';
import type { NotificationSettings } from './notification';
import type { MusicSource } from './music';

/**
 * General application and pet presentation preferences.
 */
export interface GeneralSettings {
  alwaysOnTop: boolean;
  startWithOS: boolean;
  petSize: number;
  skin: string;
  style: string;
  language: string;
}

/**
 * UI theme and window styling preferences.
 */
export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  opacity: number;
  cornerRadius: number;
  reducedMotion: boolean;
  reducedTransparency: boolean;
}

/**
 * Music integration and widget display preferences.
 */
export interface MusicSettings {
  enabled: boolean;
  source: MusicSource | string;
  showWidget: boolean;
  showLyrics: boolean;
}

/**
 * Browser extension integration configuration.
 */
export interface BrowserSettings {
  enabled: boolean;
  autoConnect: boolean;
  allowedBrowsers: string[];
}

/**
 * Privacy and monitoring consent flags.
 */
export interface PrivacySettings {
  appMonitoring: boolean;
  browserIntegration: boolean;
  musicDetection: boolean;
  lyrics: boolean;
  notifications: boolean;
  telemetry: boolean;
}

/**
 * Desktop placement, monitor targeting, and fullscreen game avoidance mode.
 */
export interface DesktopSettings {
  position: 'free' | 'bottom' | 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'custom';
  monitor: 'primary' | 'follow-active' | string;
  gameMode: 'hide' | 'stay' | 'move' | 'transparent' | 'pause';
}

/**
 * Root configuration object containing all user settings.
 */
export interface BubuSettings {
  general: GeneralSettings;
  appearance: AppearanceSettings;
  behavior: BehaviorSettings;
  music: MusicSettings;
  lyrics: LyricsDisplayConfig;
  browser: BrowserSettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  desktop: DesktopSettings;
}
