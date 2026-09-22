import { BubuIntegration } from './IntegrationManager';
import { globalEventBus } from '../events/EventBus';

export class AppMonitor implements BubuIntegration {
    id = 'app-monitor';
    name = 'App Monitor';
    private interval: number | null = null;
    private lastApp: string = '';

    isAvailable() { return true; }

    async initialize() {}

    async start() {
        // Poll for active window. In a real native integration, we'd use 'active-win' or a C++ hook.
        // We'll simulate fetching the active window or use IPC to main process.
        this.interval = window.setInterval(async () => {
            const activeApp = await window.electronAPI.getActiveWindow();
            if (activeApp && activeApp !== this.lastApp) {
                this.lastApp = activeApp;
                globalEventBus.emit('APP_FOCUSED', activeApp);
            }
        }, 2000);
    }

    async stop() {
        if (this.interval) clearInterval(this.interval);
    }
}
