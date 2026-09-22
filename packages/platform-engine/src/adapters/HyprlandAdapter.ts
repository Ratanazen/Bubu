import { execSync } from 'child_process';
import { LinuxWaylandAdapter } from './LinuxWaylandAdapter';
import { PlatformCapabilities } from '../types';

interface HyprlandActiveWindow {
    title?: string;
    class?: string;
    initialTitle?: string;
    initialClass?: string;
}

export class HyprlandAdapter extends LinuxWaylandAdapter {
    override getPlatform(): string {
        return 'linux-hyprland';
    }

    override getCapabilities(): PlatformCapabilities {
        return {
            ...super.getCapabilities(),
            panelIntegration: true,
            activeWindowTracking: true
        };
    }

    isHyprlandAvailable(): boolean {
        return Boolean(process.env.HYPRLAND_INSTANCE_SIGNATURE);
    }

    override async getActiveWindow(): Promise<string | null> {
        try {
            const out = execSync('hyprctl activewindow -j', {
                timeout: 1000,
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'ignore']
            });
            const parsed: HyprlandActiveWindow = JSON.parse(out);
            return parsed.title || parsed.class || parsed.initialTitle || null;
        } catch {
            return null;
        }
    }
}
