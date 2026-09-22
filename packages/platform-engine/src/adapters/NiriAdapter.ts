import { execSync } from 'child_process';
import { LinuxWaylandAdapter } from './LinuxWaylandAdapter';
import { PlatformCapabilities } from '../types';

export class NiriAdapter extends LinuxWaylandAdapter {
    override getPlatform(): string {
        return 'linux-niri';
    }

    override getCapabilities(): PlatformCapabilities {
        return {
            ...super.getCapabilities(),
            panelIntegration: true,
            activeWindowTracking: true
        };
    }

    isNiriAvailable(): boolean {
        return Boolean(process.env.NIRI_SOCKET);
    }

    override async getActiveWindow(): Promise<string | null> {
        if (!process.env.NIRI_SOCKET) {
            return null;
        }

        try {
            const out = execSync('niri msg --json focused-window', {
                timeout: 1000,
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'ignore']
            });
            const parsed = JSON.parse(out);
            return parsed.title || parsed.app_id || null;
        } catch {
            return null;
        }
    }
}
