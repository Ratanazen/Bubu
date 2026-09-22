import { IntegrationAdapter, IntegrationStatus } from './IntegrationEngine';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export class WaybarIntegration implements IntegrationAdapter {
    id = 'waybar';
    name = 'Waybar';

    async detect(): Promise<IntegrationStatus> {
        try {
            execSync('which waybar', { stdio: 'pipe' });
            const configPath = path.join(process.env.HOME || '~', '.config/waybar/config');
            const isConfigured = fs.existsSync(configPath) &&
                fs.readFileSync(configPath, 'utf-8').includes('bubu');

            return {
                id: this.id,
                name: this.name,
                status: isConfigured ? 'configured' : 'available',
                configSnippet: this.generateConfig()
            };
        } catch {
            return { id: this.id, name: this.name, status: 'not-installed' };
        }
    }

    generateConfig(): string {
        return JSON.stringify({
            "custom/bubu": {
                "exec": "bubu waybar",
                "return-type": "json",
                "interval": 1,
                "tooltip": true,
                "on-click": "bubu pet show",
                "on-click-right": "bubu pet pause"
            }
        }, null, 4);
    }

    getInstructions(): string {
        return `Add the following to your Waybar config (~/.config/waybar/config):

${this.generateConfig()}

Then add "custom/bubu" to your modules-right or modules-center array.`;
    }
}

export class HyprlandIntegration implements IntegrationAdapter {
    id = 'hyprland';
    name = 'Hyprland';

    async detect(): Promise<IntegrationStatus> {
        const sig = process.env.HYPRLAND_INSTANCE_SIGNATURE;
        if (sig) {
            return { id: this.id, name: this.name, status: 'active', configSnippet: this.generateConfig() };
        }
        try {
            execSync('which hyprctl', { stdio: 'pipe' });
            return { id: this.id, name: this.name, status: 'available', configSnippet: this.generateConfig() };
        } catch {
            return { id: this.id, name: this.name, status: 'not-installed' };
        }
    }

    generateConfig(): string {
        return `windowrulev2 = float,class:^(bubu-desktop-pet)$
windowrulev2 = noblur,class:^(bubu-desktop-pet)$
windowrulev2 = noshadow,class:^(bubu-desktop-pet)$
windowrulev2 = noborder,class:^(bubu-desktop-pet)$
windowrulev2 = pin,class:^(bubu-desktop-pet)$`;
    }

    getInstructions(): string {
        return `Add to your ~/.config/hypr/hyprland.conf:\n\n${this.generateConfig()}`;
    }
}

export class SwayIntegration implements IntegrationAdapter {
    id = 'sway';
    name = 'Sway';

    async detect(): Promise<IntegrationStatus> {
        if (process.env.SWAYSOCK) {
            return { id: this.id, name: this.name, status: 'active', configSnippet: this.generateConfig() };
        }
        try {
            execSync('which sway', { stdio: 'pipe' });
            return { id: this.id, name: this.name, status: 'available' };
        } catch {
            return { id: this.id, name: this.name, status: 'not-installed' };
        }
    }

    generateConfig(): string {
        return `for_window [app_id="bubu-desktop-pet"] floating enable
for_window [app_id="bubu-desktop-pet"] border none
for_window [app_id="bubu-desktop-pet"] sticky enable`;
    }

    getInstructions(): string {
        return `Add to your ~/.config/sway/config:\n\n${this.generateConfig()}`;
    }
}

export class NiriIntegration implements IntegrationAdapter {
    id = 'niri';
    name = 'Niri';

    async detect(): Promise<IntegrationStatus> {
        if (process.env.NIRI_SOCKET) {
            return { id: this.id, name: this.name, status: 'active', configSnippet: this.generateConfig() };
        }
        try {
            execSync('which niri', { stdio: 'pipe' });
            return { id: this.id, name: this.name, status: 'available' };
        } catch {
            return { id: this.id, name: this.name, status: 'not-installed' };
        }
    }

    generateConfig(): string {
        return `window-rule {
    match app-id="bubu-desktop-pet"
    open-floating true
}`;
    }

    getInstructions(): string {
        return `Add to your Niri config:\n\n${this.generateConfig()}`;
    }
}

export class I3Integration implements IntegrationAdapter {
    id = 'i3';
    name = 'i3';

    async detect(): Promise<IntegrationStatus> {
        if (process.env.I3SOCK) {
            return { id: this.id, name: this.name, status: 'active', configSnippet: this.generateConfig() };
        }
        try {
            execSync('which i3', { stdio: 'pipe' });
            return { id: this.id, name: this.name, status: 'available' };
        } catch {
            return { id: this.id, name: this.name, status: 'not-installed' };
        }
    }

    generateConfig(): string {
        return `for_window [class="bubu-desktop-pet"] floating enable
for_window [class="bubu-desktop-pet"] border none
for_window [class="bubu-desktop-pet"] sticky enable`;
    }

    getInstructions(): string {
        return `Add to your ~/.config/i3/config:\n\n${this.generateConfig()}`;
    }
}

export class KDEIntegration implements IntegrationAdapter {
    id = 'kde';
    name = 'KDE Plasma';

    async detect(): Promise<IntegrationStatus> {
        const desktop = process.env.XDG_CURRENT_DESKTOP || '';
        if (desktop.toLowerCase().includes('kde')) {
            return { id: this.id, name: this.name, status: 'active' };
        }
        return { id: this.id, name: this.name, status: 'not-installed' };
    }

    generateConfig(): string { return ''; }
    getInstructions(): string {
        return 'Bubu works natively under KDE Plasma with transparent window support.';
    }
}

export class GNOMEIntegration implements IntegrationAdapter {
    id = 'gnome';
    name = 'GNOME';

    async detect(): Promise<IntegrationStatus> {
        const desktop = process.env.XDG_CURRENT_DESKTOP || '';
        if (desktop.toLowerCase().includes('gnome')) {
            return { id: this.id, name: this.name, status: 'active' };
        }
        return { id: this.id, name: this.name, status: 'not-installed' };
    }

    generateConfig(): string { return ''; }
    getInstructions(): string {
        return 'Bubu works natively under GNOME. For best transparency, use GNOME on Xorg or ensure Mutter compositor transparency support.';
    }
}

export class XFCEIntegration implements IntegrationAdapter {
    id = 'xfce';
    name = 'XFCE';

    async detect(): Promise<IntegrationStatus> {
        const desktop = process.env.XDG_CURRENT_DESKTOP || '';
        if (desktop.toLowerCase().includes('xfce')) {
            return { id: this.id, name: this.name, status: 'active' };
        }
        return { id: this.id, name: this.name, status: 'not-installed' };
    }

    generateConfig(): string { return ''; }
    getInstructions(): string {
        return 'Bubu works under XFCE. Enable compositing in Window Manager Tweaks for transparency support.';
    }
}
