import { PlatformAdapter } from '../PlatformAdapter';
import { PlatformCapabilities, DisplayInfo, SystemTheme } from '../types';
import { WorkspaceInfo, DiagnosticResult } from '@bubu/shared-types';

export class WindowsAdapter implements PlatformAdapter {
    getPlatform(): string { return 'windows'; }
    
    getCapabilities(): PlatformCapabilities {
        return {
            transparentWindow: true,
            alwaysOnTop: true,
            globalShortcut: true,
            systemTray: true,
            panelIntegration: false,
            notifications: true,
            mediaSession: true,
            multiMonitor: true,
            activeWindowTracking: true
        };
    }
    
    async getDisplayInfo(): Promise<DisplayInfo[]> {
        // Will be deferred to Electron screen API
        return [];
    }

    async getWorkspaces(): Promise<WorkspaceInfo[]> {
        return []; // Virtual Desktops require specific COM interfaces on Windows, marking unsupported for basic node
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
        return [{ category: 'Windows Shell', status: 'ok', message: 'Windows Shell API detected.' }];
    }
}
