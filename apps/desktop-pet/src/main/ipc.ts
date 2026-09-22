import { ipcMain, BrowserWindow, screen } from 'electron';
import { loadSettings, saveSettings } from './store';

export function setupIPC(mainWindow: BrowserWindow) {
  ipcMain.handle('get-settings', () => {
    return loadSettings();
  });

  ipcMain.handle('save-settings', (_event, settings) => {
    saveSettings(settings);
    return true;
  });

  ipcMain.handle('get-displays', () => {
    return screen.getAllDisplays();
  });

  ipcMain.handle('get-primary-display', () => {
    return screen.getPrimaryDisplay();
  });

  ipcMain.handle('get-platform-info', async () => {
    return {
      platform: process.platform,
      session: process.env.XDG_SESSION_TYPE || 'wayland',
      compositor: process.env.XDG_CURRENT_DESKTOP || 'hyprland',
      capabilities: {
        'transparent-window': 'SUPPORTED',
        'always-on-top': 'SUPPORTED',
        'multi-monitor': 'SUPPORTED',
        'screen-map': 'SUPPORTED'
      }
    };
  });

  ipcMain.handle('get-workspaces', async () => {
    return [
      { id: '1', name: '1', active: true, monitorId: '1' },
      { id: '2', name: '2', active: false, monitorId: '1' }
    ];
  });
}
