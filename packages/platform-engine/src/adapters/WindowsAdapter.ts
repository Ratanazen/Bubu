import { execSync } from 'child_process';
import { PlatformAdapter } from '../PlatformAdapter';
import { DisplayInfo, PlatformCapabilities, SystemTheme } from '../types';

export class WindowsAdapter implements PlatformAdapter {
    getPlatform(): string {
        return 'windows';
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
            const psScript = [
                '$type = Add-Type -MemberDefinition \'[DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow(); [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr hWnd, System.Text.StringBuilder text, int count);\' -Name Win32 -Namespace Native -PassThru',
                '$h = [Native.Win32]::GetForegroundWindow()',
                '$sb = New-Object System.Text.StringBuilder 256',
                '$null = [Native.Win32]::GetWindowText($h, $sb, 256)',
                '$sb.ToString()'
            ].join('; ');

            const cmd = 'powershell -NoProfile -NonInteractive -Command "' + psScript + '"';
            const output = execSync(cmd, {
                timeout: 2000,
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'ignore']
            });

            const title = output.trim();
            return title.length > 0 ? title : null;
        } catch {
            return null;
        }
    }

    getSystemTheme(): SystemTheme {
        try {
            const cmd = 'reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v AppsUseLightTheme';
            const out = execSync(cmd, {
                timeout: 1000,
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'ignore']
            });
            if (out.includes('0x0')) return 'dark';
            if (out.includes('0x1')) return 'light';
        } catch {
            // ignore
        }
        return 'unknown';
    }

    async openUrl(url: string): Promise<void> {
        try {
            execSync('cmd.exe /c start "" "' + url + '"', { timeout: 3000, stdio: 'ignore' });
        } catch {
            // ignore
        }
    }
}
