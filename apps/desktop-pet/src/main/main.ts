import { app, BrowserWindow, screen } from 'electron';
import { createMainWindow } from './window';
import { setupIPC, setupUpdateEngine } from './ipc';
import { setupTray } from './tray';
import { setupStartup } from './startup';
import { setupSocketServer } from './socket';

let mainWindow: BrowserWindow | null = null;

// Fix for transparent windows on some Linux compositors
if (process.platform === 'linux') {
    app.disableHardwareAcceleration();
    app.commandLine.appendSwitch('enable-transparent-visuals');
}

app.whenReady().then(() => {
    mainWindow = createMainWindow();
    setupIPC(mainWindow);
    const { setupDeveloperEngineIPC } = require('./ipc');
    setupDeveloperEngineIPC(mainWindow);
    setupUpdateEngine(app.getPath('userData'), app.getVersion(), mainWindow);
    setupTray(mainWindow);
    setupStartup();
    setupSocketServer(mainWindow);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            mainWindow = createMainWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
