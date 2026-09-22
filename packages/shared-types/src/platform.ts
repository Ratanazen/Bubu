/**
 * Supported runtime host platforms and desktop environment variations.
 */
export type Platform =
  | 'windows'
  | 'macos'
  | 'linux-x11'
  | 'linux-wayland'
  | 'linux-niri'
  | 'linux-sway'
  | 'linux-hyprland'
  | 'linux-i3'
  | 'linux-kde'
  | 'linux-gnome'
  | 'linux-xfce'
  | 'unknown';

/**
 * Platform feature capability flags detected at runtime.
 */
export interface PlatformCapabilities {
  transparentWindow: boolean;
  alwaysOnTop: boolean;
  globalShortcut: boolean;
  systemTray: boolean;
  panelIntegration: boolean;
  notifications: boolean;
  mediaSession: boolean;
  multiMonitor: boolean;
}

/**
 * Display monitor information and coordinate bounds.
 */
export interface DisplayInfo {
  id: string | number;
  width: number;
  height: number;
  x: number;
  y: number;
  isPrimary: boolean;
  scaleFactor: number;
}

/**
 * Known Linux desktop environment and window manager identifiers.
 */
export type LinuxDesktopEnvironment =
  | 'gnome'
  | 'kde'
  | 'xfce'
  | 'sway'
  | 'hyprland'
  | 'niri'
  | 'i3'
  | 'cinnamon'
  | 'mate'
  | 'lxqt'
  | 'other'
  | 'unknown';

/**
 * Linux display server session types.
 */
export type LinuxSessionType = 'x11' | 'wayland' | 'unknown';

export interface WorkspaceInfo {
  id: string | number;
  name: string;
  monitorId: string | number;
  isActive: boolean;
  isVisible: boolean;
}

export interface WindowInfo {
  id: string | number;
  title: string;
  appClass: string;
  workspaceId: string | number;
  monitorId: string | number;
  isFocused: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PetPosition {
  monitorId?: string | number;
  workspaceId?: string | number;
  x: number;
  y: number;
  anchor: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'custom';
  scale: number;
  opacity: number;
}

export interface DiagnosticResult {
  category: string;
  status: 'ok' | 'warning' | 'error' | 'unknown';
  message: string;
  details?: string;
}
