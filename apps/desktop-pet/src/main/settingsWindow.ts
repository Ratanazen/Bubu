import { BrowserWindow } from 'electron';
import path from 'path';

let settingsWin: BrowserWindow | null = null;

export function openSettingsWindow() {
    if (settingsWin) {
        settingsWin.focus();
        return;
    }
    settingsWin = new BrowserWindow({
        width: 400,
        height: 500,
        title: 'Bubu Settings',
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, '../preload/preload.js'),
            contextIsolation: true
        }
    });
    
    settingsWin.loadFile(path.join(__dirname, '../renderer/settings.html'));
    
    settingsWin.on('closed', () => {
        settingsWin = null;
    });
}
