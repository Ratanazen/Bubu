import { PlatformCapabilities, DisplayInfo, SystemTheme } from './types';

export interface PlatformAdapter {
    getPlatform(): string;
    getCapabilities(): PlatformCapabilities;
    getDisplayInfo(): DisplayInfo[];
    showPet(): Promise<void>;
    hidePet(): Promise<void>;
    movePet(x: number, y: number): Promise<void>;
    setAlwaysOnTop(enabled: boolean): Promise<void>;
    startIntegration(): Promise<void>;
    stopIntegration(): Promise<void>;
    getActiveWindow(): Promise<string | null>;
    getSystemTheme(): SystemTheme;
    openUrl(url: string): Promise<void>;
}

// Backwards compatibility alias
export type DesktopPlatformAdapter = PlatformAdapter;
