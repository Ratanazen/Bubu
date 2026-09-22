import { PlatformAdapter } from './PlatformAdapter';
import { PlatformDetector } from './PlatformDetector';
import { WindowsAdapter } from './adapters/WindowsAdapter';
import { MacOSAdapter } from './adapters/MacOSAdapter';
import { LinuxX11Adapter } from './adapters/LinuxX11Adapter';
import { LinuxWaylandAdapter } from './adapters/LinuxWaylandAdapter';
import { NiriAdapter } from './adapters/NiriAdapter';
import { SwayAdapter } from './adapters/SwayAdapter';
import { HyprlandAdapter } from './adapters/HyprlandAdapter';
import { KDEAdapter } from './adapters/KDEAdapter';
import { GNOMEAdapter } from './adapters/GNOMEAdapter';
import { XFCEAdapter } from './adapters/XFCEAdapter';
import { DisplayInfo, PlatformCapabilities, SystemTheme } from './types';

export class PlatformManager {
    private static instance: PlatformManager | null = null;
    private adapter: PlatformAdapter;

    private constructor() {
        this.adapter = this.createAdapter();
    }

    public static getInstance(): PlatformManager {
        if (!PlatformManager.instance) {
            PlatformManager.instance = new PlatformManager();
        }
        return PlatformManager.instance;
    }

    private createAdapter(): PlatformAdapter {
        const os = PlatformDetector.getOS();

        if (os === 'windows') {
            return new WindowsAdapter();
        }

        if (os === 'macos') {
            return new MacOSAdapter();
        }

        const de = PlatformDetector.getLinuxDesktopEnvironment();
        const session = PlatformDetector.getLinuxSessionType();

        switch (de) {
            case 'niri':
                return new NiriAdapter();
            case 'sway':
                return new SwayAdapter();
            case 'hyprland':
                return new HyprlandAdapter();
            case 'kde':
                return new KDEAdapter();
            case 'gnome':
                return new GNOMEAdapter();
            case 'xfce':
                return new XFCEAdapter();
        }

        if (session === 'wayland') {
            return new LinuxWaylandAdapter();
        }

        return new LinuxX11Adapter();
    }

    public getAdapter(): PlatformAdapter {
        return this.adapter;
    }

    public setAdapter(adapter: PlatformAdapter): void {
        this.adapter = adapter;
    }

    // Convenience delegates
    public getPlatform(): string {
        return this.adapter.getPlatform();
    }

    public getCapabilities(): PlatformCapabilities {
        return this.adapter.getCapabilities();
    }

    public getDisplayInfo(): DisplayInfo[] {
        return this.adapter.getDisplayInfo();
    }

    public async showPet(): Promise<void> {
        return this.adapter.showPet();
    }

    public async hidePet(): Promise<void> {
        return this.adapter.hidePet();
    }

    public async movePet(x: number, y: number): Promise<void> {
        return this.adapter.movePet(x, y);
    }

    public async setAlwaysOnTop(enabled: boolean): Promise<void> {
        return this.adapter.setAlwaysOnTop(enabled);
    }

    public async startIntegration(): Promise<void> {
        return this.adapter.startIntegration();
    }

    public async stopIntegration(): Promise<void> {
        return this.adapter.stopIntegration();
    }

    public async getActiveWindow(): Promise<string | null> {
        return this.adapter.getActiveWindow();
    }

    public getSystemTheme(): SystemTheme {
        return this.adapter.getSystemTheme();
    }

    public async openUrl(url: string): Promise<void> {
        return this.adapter.openUrl(url);
    }
}
