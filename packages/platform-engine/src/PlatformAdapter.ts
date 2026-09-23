import { PlatformCapabilities, DisplayInfo, SystemTheme } from './types';
import { WorkspaceInfo, DiagnosticResult } from '@bubu/shared-types';

export interface PlatformAdapter {
    getWindows?(): Promise<any[]>;
    getPlatform(): string;
    getCapabilities(): PlatformCapabilities;
    getDisplayInfo(): Promise<DisplayInfo[]>;
    showPet(): Promise<void>;
    hidePet(): Promise<void>;
    movePet(x: number, y: number): Promise<void>;
    setAlwaysOnTop(enabled: boolean): Promise<void>;
    startIntegration(): Promise<void>;
    stopIntegration(): Promise<void>;
    getActiveWindow(): Promise<string | null>;
    getSystemTheme(): SystemTheme;
    openUrl(url: string): Promise<void>;
    
    // New V4 methods
    getWorkspaces(): Promise<WorkspaceInfo[]>;
    getActiveWorkspace(): Promise<WorkspaceInfo | null>;
    configure(): Promise<void>;
    doctor(): Promise<DiagnosticResult[]>;
}

// Backwards compatibility alias
export type DesktopPlatformAdapter = PlatformAdapter;
