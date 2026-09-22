import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    moveWindow: (x: number, y: number) => ipcRenderer.send('move-window', x, y),
    getScreenBounds: () => ipcRenderer.invoke('get-screen-bounds'),
    setIgnoreMouseEvents: (ignore: boolean, forward: boolean = false) => ipcRenderer.send('set-ignore-mouse-events', ignore, forward),
    getSettings: () => ipcRenderer.invoke('get-settings'),
    saveSettings: (settings: any) => ipcRenderer.send('save-settings', settings),
    onPauseStateChanged: (callback: (paused: boolean) => void) => {
        ipcRenderer.on('pause-state-changed', (_event, paused) => callback(paused));
    },
    getActiveWindow: () => ipcRenderer.invoke('get-active-window'),
    onMediaChanged: (callback: (mediaInfo: any) => void) => {
        ipcRenderer.on('media-changed', (_event, mediaInfo) => callback(mediaInfo));
    },
    startMediaMonitor: () => ipcRenderer.send('start-media-monitor'),
    stopMediaMonitor: () => ipcRenderer.send('stop-media-monitor'),
    mediaControl: (command: string) => ipcRenderer.send('media-control', command),
    showSettings: () => ipcRenderer.send('show-settings'),
    closeApp: () => ipcRenderer.send('close-app')
});
