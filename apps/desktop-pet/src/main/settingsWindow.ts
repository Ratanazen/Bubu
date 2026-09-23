import { app, BrowserWindow } from 'electron';
import path from 'path';

let settingsWin: BrowserWindow | null = null;
let controlCenterWin: BrowserWindow | null = null;

export function openControlCenterWindow() {
    if (controlCenterWin) {
        controlCenterWin.focus();
        return;
    }
    controlCenterWin = new BrowserWindow({
        width: 1100,
        height: 750,
        minWidth: 800,
        minHeight: 600,
        title: 'Bubu Control Center',
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, '../preload/preload.js'),
            contextIsolation: true
        }
    });

    const possiblePaths = [
        path.join(app.getAppPath(), 'dist/control-center/index.html'),
        path.join(__dirname, '../../../../dist/control-center/index.html'),
        path.join(__dirname, '../../dist/control-center/index.html'),
        path.join(__dirname, '../control-center/index.html')
    ];

    let foundPath = possiblePaths.find(p => require('fs').existsSync(p));

    if (foundPath) {
        controlCenterWin.loadFile(foundPath);
    } else {
        controlCenterWin.loadURL('http://localhost:5173');
    }


    controlCenterWin.on('closed', () => {
        controlCenterWin = null;
    });
}

export function openSettingsWindow() {
    openControlCenterWindow();
}
