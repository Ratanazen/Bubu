import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { LinuxSessionType, LinuxDesktopEnvironment } from './types';

export class PlatformDetector {
    static getOS(): 'windows' | 'macos' | 'linux' {
        const platform = process.platform;
        if (platform === 'win32') {
            return 'windows';
        }
        if (platform === 'darwin') {
            return 'macos';
        }
        return 'linux';
    }

    static getLinuxSessionType(): LinuxSessionType {
        if (process.platform !== 'linux') {
            return 'unknown';
        }

        const sessionType = (process.env.XDG_SESSION_TYPE || '').toLowerCase();
        if (sessionType === 'wayland') {
            return 'wayland';
        }
        if (sessionType === 'x11') {
            return 'x11';
        }

        if (process.env.WAYLAND_DISPLAY) {
            return 'wayland';
        }

        if (process.env.DISPLAY) {
            return 'x11';
        }

        return 'unknown';
    }

    static getLinuxDesktopEnvironment(): LinuxDesktopEnvironment {
        if (process.platform !== 'linux') {
            return 'unknown';
        }

        // Socket and signature based detection (compositor-specific)
        if (process.env.NIRI_SOCKET) {
            return 'niri';
        }
        if (process.env.HYPRLAND_INSTANCE_SIGNATURE) {
            return 'hyprland';
        }
        if (process.env.SWAYSOCK) {
            return 'sway';
        }
        if (process.env.I3SOCK) {
            return 'i3';
        }

        // Standard desktop environment variables
        const rawDesktops = [
            process.env.XDG_CURRENT_DESKTOP,
            process.env.DESKTOP_SESSION,
            process.env.XDG_SESSION_DESKTOP,
            process.env.GDMSESSION
        ].filter(Boolean).join(':').toLowerCase();

        if (rawDesktops.includes('hyprland')) return 'hyprland';
        if (rawDesktops.includes('sway')) return 'sway';
        if (rawDesktops.includes('niri')) return 'niri';
        if (rawDesktops.includes('kde') || rawDesktops.includes('plasma')) return 'kde';
        if (rawDesktops.includes('gnome') || rawDesktops.includes('unity')) return 'gnome';
        if (rawDesktops.includes('xfce')) return 'xfce';
        if (rawDesktops.includes('i3')) return 'i3';
        if (rawDesktops.includes('cinnamon')) return 'cinnamon';
        if (rawDesktops.includes('mate')) return 'mate';
        if (rawDesktops.includes('lxqt')) return 'lxqt';
        if (rawDesktops.includes('lxde')) return 'lxde';

        return 'unknown';
    }

    static isWaybar(): boolean {
        if (process.platform !== 'linux') {
            return false;
        }

        try {
            const home = os.homedir();
            if (fs.existsSync(path.join(home, '.config', 'waybar'))) {
                return true;
            }
            if (fs.existsSync('/etc/xdg/waybar')) {
                return true;
            }
        } catch {
            // Ignore filesystem errors
        }

        try {
            execSync('pgrep -x waybar', { stdio: 'ignore', timeout: 500 });
            return true;
        } catch {
            return false;
        }
    }

    static isSwaybar(): boolean {
        if (process.platform !== 'linux') {
            return false;
        }

        try {
            execSync('pgrep -x swaybar', { stdio: 'ignore', timeout: 500 });
            return true;
        } catch {
            return false;
        }
    }

    static detectPlatform(): string {
        const osType = this.getOS();
        if (osType === 'windows') {
            return 'windows';
        }
        if (osType === 'macos') {
            return 'macos';
        }

        const de = this.getLinuxDesktopEnvironment();
        const session = this.getLinuxSessionType();

        if (de === 'niri') return 'linux-niri';
        if (de === 'sway') return 'linux-sway';
        if (de === 'hyprland') return 'linux-hyprland';
        if (de === 'kde') return 'linux-kde';
        if (de === 'gnome') return 'linux-gnome';
        if (de === 'xfce') return 'linux-xfce';

        if (session === 'wayland') {
            return 'linux-wayland';
        }
        if (session === 'x11') {
            return 'linux-x11';
        }

        return 'linux-x11';
    }
}
