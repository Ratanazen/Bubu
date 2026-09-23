export type LinuxSessionType = 'x11' | 'wayland' | 'unknown';

export type LinuxDesktopEnvironment =
    | 'gnome'
    | 'kde'
    | 'xfce'
    | 'sway'
    | 'hyprland'
    | 'niri'
    | 'i3'
    | 'wlroots'
    | 'cinnamon'
    | 'mate'
    | 'lxde'
    | 'lxqt'
    | 'unknown'
    | string;

export type Platform =
    | 'windows'
    | 'macos'
    | 'linux-x11'
    | 'linux-wayland'
    | 'linux-niri'
    | 'linux-sway'
    | 'linux-hyprland'
    | 'linux-kde'
    | 'linux-gnome'
    | 'linux-xfce'
    | 'unknown'
    | string;

export type SystemTheme = 'light' | 'dark' | 'unknown';

export interface DisplayInfo {
    id: string;
    width: number;
    height: number;
    x: number;
    y: number;
    scaleFactor?: number;
    isPrimary: boolean;
}

export type CapabilityStatus = 
    | "SUPPORTED" 
    | "IMPLEMENTED_NOT_VERIFIED" 
    | "BEST_EFFORT" 
    | "PERMISSION_REQUIRED" 
    | "UNSUPPORTED" 
    | "NOT_VERIFIED" 
    | "BLOCKED" 
    | "ERROR";

export interface CapabilityResult {
    id: string;
    platform: string;
    status: CapabilityStatus;
    reason?: string;
    permission?: string;
    fallback?: string;
    version?: string;
    detected: boolean;
    verified: boolean;
}

export interface PlatformCapabilities {
    transparentWindow: boolean | CapabilityStatus;
    alwaysOnTop: boolean | CapabilityStatus;
    globalShortcut: boolean | CapabilityStatus;
    systemTray: boolean | CapabilityStatus;
    panelIntegration: boolean | CapabilityStatus;
    notifications: boolean | CapabilityStatus;
    mediaSession: boolean | CapabilityStatus;
    multiMonitor: boolean | CapabilityStatus;
    activeWindowTracking: boolean | CapabilityStatus;
}
