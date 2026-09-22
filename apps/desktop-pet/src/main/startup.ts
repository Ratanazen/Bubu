import { app } from 'electron';
import { loadSettings } from './store';

export function setupStartup() {
    const settings = loadSettings();
    app.setLoginItemSettings({
        openAtLogin: settings.startWithWindows,
        path: app.getPath('exe')
    });
}
