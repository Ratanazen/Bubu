import { ipcMain, BrowserWindow, screen } from 'electron';
import { loadSettings, saveSettings } from './store';
import { PlatformManager } from '@bubu/platform-engine';
import { UpdateEngine } from '@bubu/update-engine';

const platformAdapter = PlatformManager.getInstance().getAdapter();

export function setupIPC(mainWindow: BrowserWindow) {
  ipcMain.handle('get-settings', () => {
    return loadSettings();
  });

  ipcMain.handle('save-settings', (_event, settings) => {
    saveSettings(settings);
    return true;
  });

  ipcMain.handle('get-all-displays', async () => {
    if (platformAdapter) {
      try {
        const displays = await platformAdapter.getDisplayInfo();
        if (displays && displays.length > 0) return displays;
      } catch (e) {
        console.error("Platform Adapter getDisplayInfo error", e);
      }
    }
    return screen.getAllDisplays().map(d => ({
        id: d.id.toString(),
        name: d.label || 'Display',
        width: d.bounds.width,
        height: d.bounds.height,
        x: d.bounds.x,
        y: d.bounds.y,
        scaleFactor: d.scaleFactor,
        isPrimary: d.id === screen.getPrimaryDisplay().id
    }));
  });

  ipcMain.handle('get-primary-display', () => {
    return screen.getPrimaryDisplay();
  });

  ipcMain.handle('get-platform-info', async () => {
    const caps = platformAdapter ? platformAdapter.getCapabilities() : {};
    return {
      platform: process.platform,
      session: process.env.XDG_SESSION_TYPE || 'unknown',
      compositor: process.env.XDG_CURRENT_DESKTOP || 'unknown',
      capabilities: caps
    };
  });

  ipcMain.handle('get-windows', async () => {
    if (platformAdapter && platformAdapter.getWindows) {
      try {
        const windows = await platformAdapter.getWindows();
        return windows || [];
      } catch (e) { console.error('getWindows error', e); }
    }
    return [];
  });

  ipcMain.handle('get-workspaces', async () => {
    if (platformAdapter && platformAdapter.getWorkspaces) {
      try {
          const workspaces = await platformAdapter.getWorkspaces();
          if (workspaces && workspaces.length > 0) {
              return workspaces;
          }
      } catch (e) {
          console.error("Platform Adapter getWorkspaces error", e);
      }
    }
    return [];
  });
  
  ipcMain.handle('move-pet', async (_event, x: number, y: number) => {
    if (platformAdapter && platformAdapter.movePet) {
        try {
            await platformAdapter.movePet(x, y);
            const s = loadSettings();
            s.position.x = x;
            s.position.y = y;
            saveSettings(s);
            return true;
        } catch (e) {}
    }
    mainWindow.setBounds({ x: Math.round(x), y: Math.round(y), width: 150, height: 150 });
    const s = loadSettings();
    s.position.x = x;
    s.position.y = y;
    saveSettings(s);
    return true;
  });
}

// M16 Update Engine API
let updateEngine: UpdateEngine | null = null;

export function setupUpdateEngine(appDataDir: string, currentVersion: string, mainWindow: BrowserWindow) {
    updateEngine = new UpdateEngine(currentVersion, appDataDir, {
        enabled: true,
        channel: 'stable',
        checkOnStartup: false
    });

    updateEngine.subscribe((state, payload) => {
        if (!mainWindow.isDestroyed()) {
            mainWindow.webContents.send('update-state-changed', { state, payload });
        }
    });

    ipcMain.handle('check-for-updates', async () => {
        if (!updateEngine) return false;
        return await updateEngine.checkForUpdates();
    });

    ipcMain.handle('install-update', async () => {
        if (!updateEngine) return false;
        await updateEngine.installUpdate();
        return true;
    });

    ipcMain.handle('get-update-state', () => {
        return updateEngine ? updateEngine.getState() : 'IDLE';
    });
}
