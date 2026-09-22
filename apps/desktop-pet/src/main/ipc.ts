import { ipcMain, BrowserWindow, screen, app } from 'electron';
import { loadSettings, saveSettings } from './store';
import { openSettingsWindow } from './settingsWindow';
import { exec } from 'child_process';
import { PlatformManager } from '@bubu/platform-engine';

export function setupIPC(mainWindow: BrowserWindow) {
    ipcMain.on('move-window', (event, x, y) => {
        mainWindow.setPosition(Math.round(x), Math.round(y));
    });

    ipcMain.handle('get-screen-bounds', () => {
        return screen.getPrimaryDisplay().workArea;
    });

    ipcMain.handle('get-all-displays', () => {
        const primary = screen.getPrimaryDisplay();
        return screen.getAllDisplays().map(d => ({
            id: String(d.id),
            name: `Display ${d.id}`,
            bounds: d.bounds,
            workArea: d.workArea,
            scaleFactor: d.scaleFactor,
            isPrimary: d.id === primary.id,
            rotation: d.rotation
        }));
    });

    ipcMain.on('set-window-position', (event, x, y) => {
        mainWindow.setPosition(Math.round(x), Math.round(y));
    });

    ipcMain.on('set-window-properties', (event, props) => {
        if (props.alwaysOnTop !== undefined) mainWindow.setAlwaysOnTop(props.alwaysOnTop);
        if (props.opacity !== undefined) mainWindow.setOpacity(props.opacity);
        if (props.clickThrough !== undefined) mainWindow.setIgnoreMouseEvents(props.clickThrough, { forward: true });
    });

    ipcMain.on('set-ignore-mouse-events', (event, ignore, forward) => {
        mainWindow.setIgnoreMouseEvents(ignore, { forward });
    });

    ipcMain.handle('get-settings', () => {
        return loadSettings();
    });

    ipcMain.on('save-settings', (event, settings) => {
        saveSettings(settings);
        mainWindow.setAlwaysOnTop(settings.alwaysOnTop);
        app.setLoginItemSettings({
            openAtLogin: settings.startWithWindows,
            path: app.getPath('exe')
        });
    });

    
    ipcMain.handle('get-workspaces', async () => {
        try {
            return await PlatformManager.getInstance().getWorkspaces();
        } catch { return []; }
    });

    ipcMain.handle('compositor-status', async () => {
        try {
            return await PlatformManager.getInstance().getCapabilities();
        } catch { return null; }
    });

    ipcMain.on('show-settings', () => {
        openSettingsWindow();
    });

    ipcMain.on('close-app', () => {
        app.quit();
    });

    // --- App Monitor (Fallback using PowerShell) ---
    ipcMain.handle('get-active-window', async () => {
        return new Promise((resolve) => {
            if (process.platform === 'win32') {
                const ps = `
                    Add-Type @"
                    using System;
                    using System.Runtime.InteropServices;
                    public class WindowActive {
                        [DllImport("user32.dll")]
                        public static extern IntPtr GetForegroundWindow();
                        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
                        public static extern int GetWindowText(IntPtr hWnd, System.Text.StringBuilder text, int count);
                    }
                    "@
                    $hwnd = [WindowActive]::GetForegroundWindow()
                    $text = New-Object System.Text.StringBuilder 256
                    $null = [WindowActive]::GetWindowText($hwnd, $text, 256)
                    $text.ToString()
                `;
                exec(`powershell -Command "${ps}"`, { windowsHide: true }, (err, stdout) => {
                    resolve(stdout ? stdout.trim() : '');
                });
            } else {
                // Mock for linux testing
                const apps = ['VS Code', 'Chrome', 'Spotify'];
                resolve(apps[Math.floor(Math.random() * apps.length)]);
            }
        });
    });

    // --- Media Monitor (Mock Simulation) ---
    let mediaInterval: NodeJS.Timeout | null = null;
    let mockPosition = 0;

    ipcMain.on('start-media-monitor', () => {
        console.log('Started Media Monitor (Mock mode)');
        
        setTimeout(() => {
            mainWindow.webContents.send('media-changed', {
                state: 'PLAYING',
                title: 'Never Gonna Give You Up',
                artist: 'Rick Astley'
            });

            mockPosition = 0;
            mediaInterval = setInterval(() => {
                mockPosition += 1;
                mainWindow.webContents.send('media-changed', {
                    state: 'PLAYING',
                    position: mockPosition,
                    title: 'Never Gonna Give You Up',
                    artist: 'Rick Astley'
                });
            }, 1000);
        }, 5000);
    });

    ipcMain.on('stop-media-monitor', () => {
        if (mediaInterval) clearInterval(mediaInterval);
    });

    ipcMain.on('media-control', (event, cmd) => {
        console.log(`Received media command: ${cmd}`);
    });
}
