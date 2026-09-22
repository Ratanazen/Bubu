import { execSync } from 'child_process';
import { LinuxX11Adapter } from './LinuxX11Adapter';
import { LinuxWaylandAdapter } from './LinuxWaylandAdapter';
import { PlatformDetector } from '../PlatformDetector';
import { PlatformCapabilities, SystemTheme } from '../types';

export class KDEAdapter extends (PlatformDetector.getLinuxSessionType() === 'x11' ? LinuxX11Adapter : LinuxWaylandAdapter) {
    override getPlatform(): string {
        return 'linux-kde';
    }

    override getCapabilities(): PlatformCapabilities {
        return {
            ...super.getCapabilities(),
            panelIntegration: true,
            activeWindowTracking: true
        };
    }

    override async getActiveWindow(): Promise<string | null> {
        // Try KDE Plasma KWin via qdbus
        try {
            const out = execSync('qdbus org.kde.KWin /KWin org.kde.KWin.activeWindow', {
                timeout: 1000,
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'ignore']
            }).trim();
            if (out && out !== '0') {
                return out;
            }
        } catch {
            // Ignore and fallback
        }

        return super.getActiveWindow();
    }

    override getSystemTheme(): SystemTheme {
        try {
            const out5 = execSync('kreadconfig5 --group "General" --key "ColorScheme"', {
                timeout: 1000,
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'ignore']
            }).toLowerCase();
            if (out5.includes('dark')) return 'dark';
            if (out5.includes('light')) return 'light';
        } catch {
            try {
                const out6 = execSync('kreadconfig6 --group "General" --key "ColorScheme"', {
                    timeout: 1000,
                    encoding: 'utf8',
                    stdio: ['ignore', 'pipe', 'ignore']
                }).toLowerCase();
                if (out6.includes('dark')) return 'dark';
                if (out6.includes('light')) return 'light';
            } catch {
                // Ignore and fallback
            }
        }

        return super.getSystemTheme();
    }
}
