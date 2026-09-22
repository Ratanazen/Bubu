import { execSync } from 'child_process';
import { PlatformAdapter } from '../PlatformAdapter';
import { DisplayInfo, PlatformCapabilities, SystemTheme } from '../types';

export class MacOSAdapter implements PlatformAdapter {
    getPlatform(): string {
        return 'macos';
    }

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

    getDisplayInfo(): DisplayInfo[] {
        return [];
    }

    async showPet(): Promise<void> {}
    async hidePet(): Promise<void> {}
    async movePet(_x: number, _y: number): Promise<void> {}
    async setAlwaysOnTop(_enabled: boolean): Promise<void> {}
    async startIntegration(): Promise<void> {}
    async stopIntegration(): Promise<void> {}

    async getActiveWindow(): Promise<string | null> {
        try {
            const script = 'tell application "System Events" to get name of first application process whose frontmost is true';
            const output = execSync('osascript -e "' + script + '"', {
                timeout: 1500,
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'ignore']
            });
            const app = output.trim();
            return app.length > 0 ? app : null;
        } catch {
            return null;
        }
    }

    getSystemTheme(): SystemTheme {
        try {
            const out = execSync('defaults read -g AppleInterfaceStyle', {
                timeout: 1000,
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'ignore']
            }).trim();
            if (out.toLowerCase() === 'dark') {
                return 'dark';
            }
            return 'light';
        } catch {
            // When key does not exist on macOS, theme is light
            return 'light';
        }
    }

    async openUrl(url: string): Promise<void> {
        try {
            execSync('open "' + url + '"', { timeout: 3000, stdio: 'ignore' });
        } catch {
            // ignore
        }
    }
}
