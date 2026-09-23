import { execFile } from "child_process";
import { PlatformAdapter } from '../PlatformAdapter';
import { PlatformCapabilities, DisplayInfo, SystemTheme, CapabilityStatus } from '../types';
import { WorkspaceInfo, DiagnosticResult } from '@bubu/shared-types';
import { exec } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

export class HyprlandAdapter implements PlatformAdapter {
    getPlatform(): string { return 'linux-hyprland'; }
    
    getCapabilities(): PlatformCapabilities {
        return {
            transparentWindow: "SUPPORTED",
            alwaysOnTop: "SUPPORTED",
            globalShortcut: "SUPPORTED",
            systemTray: "SUPPORTED",
            panelIntegration: "SUPPORTED",
            notifications: "SUPPORTED",
            mediaSession: "SUPPORTED",
            multiMonitor: "SUPPORTED",
            activeWindowTracking: "SUPPORTED"
        };
    }
    
    async getDisplayInfo(): Promise<DisplayInfo[]> {
        return new Promise((resolve) => {
            exec('hyprctl monitors -j', (err, stdout) => {
                try {
                    const monitors = JSON.parse(stdout);
                    resolve(monitors.map((m: any) => ({
                        id: m.id.toString(),
                        name: m.name,
                        width: m.width,
                        height: m.height,
                        x: m.x,
                        y: m.y,
                        scaleFactor: m.scale,
                        isPrimary: m.focused
                    })));
                } catch { resolve([]); }
            });
        });
    }

    async getWorkspaces(): Promise<WorkspaceInfo[]> {
        return new Promise((resolve) => {
            exec('hyprctl workspaces -j', (err, stdout) => {
                try {
                    const workspaces = JSON.parse(stdout);
                    resolve(workspaces.map((w: any) => ({
                        id: w.id.toString(),
                        name: w.name,
                        monitorId: w.monitor,
                        isActive: w.hasfullscreen, 
                        isVisible: true
                    })));
                } catch { resolve([]); }
            });
        });
    }

    async getActiveWorkspace(): Promise<WorkspaceInfo | null> {
        return new Promise((resolve) => {
            exec('hyprctl activeworkspace -j', (err, stdout) => {
                try {
                    const w = JSON.parse(stdout);
                    resolve({
                        id: w.id.toString(),
                        name: w.name,
                        monitorId: w.monitor,
                        isActive: true,
                        isVisible: true
                    });
                } catch { resolve(null); }
            });
        });
    }

    async getWindows(): Promise<any[]> {
        return new Promise((resolve) => {
            exec('hyprctl clients -j', (err, stdout) => {
                try {
                    const clients = JSON.parse(stdout);
                    resolve(clients.map((c: any) => ({
                        id: c.address,
                        title: c.title,
                        application: c.class,
                        pid: c.pid,
                        geometry: { x: c.at[0], y: c.at[1], width: c.size[0], height: c.size[1] },
                        monitorId: c.monitor.toString(),
                        workspaceId: c.workspace.id.toString(),
                        focused: c.focusHistoryID === 0,
                        visible: !c.hidden,
                        floating: c.floating
                    })));
                } catch { resolve([]); }
            });
        });
    }

    async showPet(): Promise<void> {}
    async hidePet(): Promise<void> {}
    
    async movePet(x: number, y: number): Promise<void> {
        return new Promise((resolve) => {
            exec(`hyprctl dispatch movewindowpixel exact ${x} ${y},^(bubu-desktop-pet)$`, () => {
                resolve();
            });
        });
    }
    
    async setAlwaysOnTop(enabled: boolean): Promise<void> {
        return new Promise((resolve) => {
            exec(`hyprctl dispatch pin ^(bubu-desktop-pet)$`, () => {
                resolve();
            });
        });
    }
    
    async startIntegration(): Promise<void> {}
    async stopIntegration(): Promise<void> {}
    
    async getActiveWindow(): Promise<string | null> {
        return new Promise((resolve) => {
            exec('hyprctl activewindow -j', (err, stdout) => {
                try {
                    resolve(JSON.parse(stdout).title);
                } catch { resolve(null); }
            });
        });
    }
    
    getSystemTheme(): SystemTheme { return 'dark'; }
    async openUrl(url: string): Promise<void> {
        return new Promise((resolve) => {
            execFile("xdg-open", [url], () => resolve());
        });
    }

    async configure(): Promise<void> {
        const confPath = path.join(os.homedir(), '.config', 'hypr', 'hyprland.conf');
        if (!fs.existsSync(confPath)) return;
        
        let conf = fs.readFileSync(confPath, 'utf8');
        if (conf.includes('# BUBU MANAGED START')) return;

        const block = `\n# BUBU MANAGED START
windowrule = float, ^(bubu-desktop-pet)$
windowrule = noblur, ^(bubu-desktop-pet)$
windowrule = pin, ^(bubu-desktop-pet)$
# BUBU MANAGED END\n`;
        fs.copyFileSync(confPath, confPath + '.bak');
        fs.writeFileSync(confPath, conf + block);
    }

    async doctor(): Promise<DiagnosticResult[]> {
        return new Promise((resolve) => {
            exec('hyprctl version -j', (err, stdout) => {
                if (err) {
                    resolve([{ category: 'Hyprland', status: 'error', message: 'hyprctl not found or not running' }]);
                } else {
                    resolve([{ category: 'Hyprland', status: 'ok', message: 'Hyprland is running correctly' }]);
                }
            });
        });
    }
}
