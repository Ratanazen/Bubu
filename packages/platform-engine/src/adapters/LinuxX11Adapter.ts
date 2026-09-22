import { execSync } from 'child_process';
import { PlatformAdapter } from '../PlatformAdapter';
import { DisplayInfo, PlatformCapabilities, SystemTheme } from '../types';

export class LinuxX11Adapter implements PlatformAdapter {
    getPlatform(): string {
        return 'linux-x11';
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
            const out = execSync('xdotool getactivewindow getwindowname', {
                timeout: 1000,
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'ignore']
            }).trim();
            if (out.length > 0) {
                return out;
            }
        } catch {
            // Try xprop fallback
            try {
                const winId = execSync('xdotool getactivewindow', {
                    timeout: 1000,
                    encoding: 'utf8',
                    stdio: ['ignore', 'pipe', 'ignore']
                }).trim();

                if (winId.length > 0) {
                    const prop = execSync('xprop -id ' + winId + ' WM_NAME', {
                        timeout: 1000,
                        encoding: 'utf8',
                        stdio: ['ignore', 'pipe', 'ignore']
                    });
                    const match = prop.match(/WM_NAME\([^)]+\)\s*=\s*"(.*)"/);
                    if (match && match[1]) {
                        return match[1];
                    }
                }
            } catch {
                // ignore
            }
        }
        return null;
    }

    getSystemTheme(): SystemTheme {
        try {
            const out = execSync('gsettings get org.gnome.desktop.interface color-scheme', {
                timeout: 1000,
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'ignore']
            }).toLowerCase();
            if (out.includes('dark')) return 'dark';
            if (out.includes('light') || out.includes('default')) return 'light';
        } catch {
            // ignore
        }
        return 'unknown';
    }

    async openUrl(url: string): Promise<void> {
        try {
            execSync('xdg-open "' + url + '"', { timeout: 3000, stdio: 'ignore' });
        } catch {
            // ignore
        }
    }
}
