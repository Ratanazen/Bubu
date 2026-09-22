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

export interface PlatformCapabilities {
    transparentWindow: boolean;
    alwaysOnTop: boolean;
    globalShortcut: boolean;
    systemTray: boolean;
    panelIntegration: boolean;
    notifications: boolean;
    mediaSession: boolean;
    multiMonitor: boolean;
    activeWindowTracking: boolean;
}
