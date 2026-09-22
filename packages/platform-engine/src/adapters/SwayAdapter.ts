import { execSync } from 'child_process';
import { LinuxWaylandAdapter } from './LinuxWaylandAdapter';
import { PlatformCapabilities } from '../types';

interface SwayNode {
    id: number;
    name?: string;
    app_id?: string;
    focused?: boolean;
    window_properties?: {
        class?: string;
        title?: string;
    };
    nodes?: SwayNode[];
    floating_nodes?: SwayNode[];
}

export class SwayAdapter extends LinuxWaylandAdapter {
    override getPlatform(): string {
        return 'linux-sway';
    }

    override getCapabilities(): PlatformCapabilities {
        return {
            ...super.getCapabilities(),
            panelIntegration: true,
            activeWindowTracking: true
        };
    }

    isSwayAvailable(): boolean {
        return Boolean(process.env.SWAYSOCK);
    }

    override async getActiveWindow(): Promise<string | null> {
        if (!process.env.SWAYSOCK) {
            return null;
        }

        try {
            const out = execSync('swaymsg -t get_tree', {
                timeout: 1500,
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'ignore']
            });
            const tree: SwayNode = JSON.parse(out);
            const focused = this.findFocusedNode(tree);
            if (focused) {
                return focused.name || focused.app_id || focused.window_properties?.class || null;
            }
        } catch {
            return null;
        }

        return null;
    }

    private findFocusedNode(node: SwayNode | null | undefined): SwayNode | null {
        if (!node) {
            return null;
        }
        if (node.focused) {
            return node;
        }
        if (Array.isArray(node.nodes)) {
            for (const child of node.nodes) {
                const found = this.findFocusedNode(child);
                if (found) {
                    return found;
                }
            }
        }
        if (Array.isArray(node.floating_nodes)) {
            for (const child of node.floating_nodes) {
                const found = this.findFocusedNode(child);
                if (found) {
                    return found;
                }
            }
        }
        return null;
    }
}
