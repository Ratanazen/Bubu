import { PlatformAdapter } from '../PlatformAdapter';
import { PlatformCapabilities, DisplayInfo, SystemTheme } from '../types';
import { WorkspaceInfo, DiagnosticResult } from '@bubu/shared-types';

export class MacOSAdapter implements PlatformAdapter {
    getPlatform(): string { return 'macos'; }
    
    getCapabilities(): PlatformCapabilities {
        return {
            transparentWindow: true,
            alwaysOnTop: true,
            globalShortcut: true,
            systemTray: true,
            panelIntegration: true, // Menu Bar
            notifications: true,
            mediaSession: true,
            multiMonitor: true,
            activeWindowTracking: true
        };
    }
    
    async getDisplayInfo(): Promise<DisplayInfo[]> {
        return [];
    }

    async getWorkspaces(): Promise<WorkspaceInfo[]> {
        return []; // Spaces API is private on macOS
    }

    async getActiveWorkspace(): Promise<WorkspaceInfo | null> {
        return null;
    }

    async showPet(): Promise<void> {}
    async hidePet(): Promise<void> {}
    async movePet(x: number, y: number): Promise<void> {}
    async setAlwaysOnTop(enabled: boolean): Promise<void> {}
    async startIntegration(): Promise<void> {}
    async stopIntegration(): Promise<void> {}
    
    async getActiveWindow(): Promise<string | null> {
        return null; 
    }
    
    getSystemTheme(): SystemTheme { return 'unknown'; }
    async openUrl(url: string): Promise<void> {}

    async configure(): Promise<void> {}

    async doctor(): Promise<DiagnosticResult[]> {
        return [{ category: 'macOS Spaces', status: 'warning', message: 'macOS Spaces API is private and unsupported.' }];
    }
}
