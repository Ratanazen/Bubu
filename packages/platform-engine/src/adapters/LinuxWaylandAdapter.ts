import { execSync } from 'child_process';
import { PlatformAdapter } from '../PlatformAdapter';
import { DisplayInfo, PlatformCapabilities, SystemTheme } from '../types';

export class LinuxWaylandAdapter implements PlatformAdapter {
    getPlatform(): string {
        return 'linux-wayland';
    }

    getCapabilities(): PlatformCapabilities {
        return {
            transparentWindow: true,
            alwaysOnTop: true,
            globalShortcut: false, // Restricted in Wayland without compositor specific protocols
            systemTray: true,
            panelIntegration: true, // Waybar / Panel support
            notifications: true,
            mediaSession: true,
            multiMonitor: true,
            activeWindowTracking: false
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
        // Generic Wayland does not permit querying foreign toplevel windows
        // Compositor-specific adapters (Sway, Hyprland, Niri) override this method
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
