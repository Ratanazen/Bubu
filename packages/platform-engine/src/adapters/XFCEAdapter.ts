import { execSync } from 'child_process';
import { LinuxX11Adapter } from './LinuxX11Adapter';
import { PlatformCapabilities, SystemTheme } from '../types';

export class XFCEAdapter extends LinuxX11Adapter {
    override getPlatform(): string {
        return 'linux-xfce';
    }

    override getCapabilities(): PlatformCapabilities {
        return {
            ...super.getCapabilities(),
            panelIntegration: true,
            activeWindowTracking: true
        };
    }

    override getSystemTheme(): SystemTheme {
        try {
            const theme = execSync('xfconf-query -c xsettings -p /Net/ThemeName', {
                timeout: 1000,
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'ignore']
            }).toLowerCase();
            if (theme.includes('dark')) return 'dark';
            if (theme.includes('light')) return 'light';
        } catch {
            // Ignore and fallback
        }

        return super.getSystemTheme();
    }
}
