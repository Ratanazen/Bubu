import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    moveWindow: (x: number, y: number) => ipcRenderer.send('move-window', x, y),
    setWindowPosition: (x: number, y: number) => ipcRenderer.send('set-window-position', x, y),
    setWindowProperties: (props: any) => ipcRenderer.send('set-window-properties', props),
    getAllDisplays: () => ipcRenderer.invoke('get-all-displays'),
    getScreenBounds: () => ipcRenderer.invoke('get-screen-bounds'),
    getWorkspaces: () => ipcRenderer.invoke('get-workspaces'),
    getWindows: () => ipcRenderer.invoke('get-windows'),
    getPlatformInfo: () => ipcRenderer.invoke('get-platform-info'),
    movePet: (x: number, y: number) => ipcRenderer.invoke('move-pet', x, y),
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
    onShowNotification: (callback: (args: any) => void) => ipcRenderer.on('show-notification', (_event, args) => callback(args)),
    closeApp: () => ipcRenderer.send('close-app'),
    checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
    installUpdate: () => ipcRenderer.invoke('install-update'),
    getUpdateState: () => ipcRenderer.invoke('get-update-state'),
    onUpdateStateChanged: (callback: (data: any) => void) => ipcRenderer.on('update-state-changed', (_event, data) => callback(data))
});

contextBridge.exposeInMainWorld('developerAPI', {
    detectToolchains: () => ipcRenderer.invoke('detect-toolchains'),
    scanProject: (dir: string) => ipcRenderer.invoke('scan-project', dir),
    runProcess: (cmd: string, args: string[], cwd: string) => ipcRenderer.invoke('run-process', cmd, args, cwd),
    killProcess: (pid: number) => ipcRenderer.invoke('kill-process', pid),
    onProcessOutput: (callback: (payload: any) => void) => ipcRenderer.on('process-output', (_event, payload) => callback(payload)),
    onProcessExit: (callback: (payload: any) => void) => ipcRenderer.on('process-exit', (_event, payload) => callback(payload)),
    // V6.0 Terminal
    createTerminal: (id: string, cwd: string) => ipcRenderer.invoke('terminal-create', id, cwd),
    writeTerminal: (id: string, data: string) => ipcRenderer.invoke('terminal-write', id, data),
    killTerminal: (id: string) => ipcRenderer.invoke('terminal-kill', id),
    onTerminalData: (callback: (payload: any) => void) => ipcRenderer.on('terminal-data', (_event, payload) => callback(payload)),
    onTerminalExit: (callback: (payload: any) => void) => ipcRenderer.on('terminal-exit', (_event, payload) => callback(payload)),
    // V6.0 Git
    getGitStatus: (cwd: string) => ipcRenderer.invoke('git-status', cwd),
    getGitDiff: (cwd: string) => ipcRenderer.invoke('git-diff', cwd),
    gitCommit: (message: string, cwd: string) => ipcRenderer.invoke('git-commit', message, cwd),
    getGitLog: (cwd: string, count?: number) => ipcRenderer.invoke('git-log', cwd, count)
});

