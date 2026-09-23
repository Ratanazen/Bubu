import { BrowserWindow, screen } from 'electron';
import path from 'path';
import { loadSettings } from './store';

export function createMainWindow() {
    const settings = loadSettings();
    const win = new BrowserWindow({
        width: 150,
        x: settings.position?.x ?? 100,
        y: settings.position?.y ?? 100,
        height: 150,
        frame: false,
        transparent: true,
        alwaysOnTop: settings.alwaysOnTop,
        resizable: false,
        skipTaskbar: true,
        hasShadow: false,
        backgroundColor: '#00000000',
        webPreferences: {
            preload: path.join(__dirname, '../preload/preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
    });

    win.loadFile(path.join(__dirname, '../renderer/index.html'));
    
    // Ignore mouse events initially, let the renderer tell us when to un-ignore
    win.setIgnoreMouseEvents(true, { forward: true });

    return win;
}
