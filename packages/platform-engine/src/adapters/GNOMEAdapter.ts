import { execSync } from 'child_process';
import { LinuxX11Adapter } from './LinuxX11Adapter';
import { LinuxWaylandAdapter } from './LinuxWaylandAdapter';
import { PlatformDetector } from '../PlatformDetector';
import { PlatformCapabilities, SystemTheme } from '../types';

export class GNOMEAdapter extends (PlatformDetector.getLinuxSessionType() === 'x11' ? LinuxX11Adapter : LinuxWaylandAdapter) {
    override getPlatform(): string {
        return 'linux-gnome';
    }

    override getCapabilities(): PlatformCapabilities {
        return {
            ...super.getCapabilities(),
            panelIntegration: false,
            activeWindowTracking: true
        };
    }

    override async getActiveWindow(): Promise<string | null> {
        const baseResult = await super.getActiveWindow();
        if (baseResult) {
            return baseResult;
        }

        // Try GNOME Shell via gdbus evaluation if enabled
        try {
            const script = 'global.display.focus_window ? global.display.focus_window.get_title() : ""';
            const cmd = 'gdbus call --session --dest org.gnome.Shell --object-path /org/gnome/Shell --method org.gnome.Shell.Eval "' + script + '"';
            const out = execSync(cmd, {
                timeout: 1000,
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'ignore']
            });
            const match = out.match(/\(true,\s*'(.*)'\)/);
            if (match && match[1]) {
                return match[1];
            }
        } catch {
            // Evaluator disabled or unreachable
        }

        return null;
    }

    override getSystemTheme(): SystemTheme {
        try {
            const out = execSync('gsettings get org.gnome.desktop.interface color-scheme', {
                timeout: 1000,
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'ignore']
            }).toLowerCase();
            if (out.includes('dark')) return 'dark';
            if (out.includes('light') || out.includes('default')) return 'light';
        } catch {
            // Ignore and fallback
        }

        return super.getSystemTheme();
    }

    async getWorkspaces() { return []; }
    async getActiveWorkspace() { return null; }
    async configure() { return; }
    async doctor() { return []; }

}
