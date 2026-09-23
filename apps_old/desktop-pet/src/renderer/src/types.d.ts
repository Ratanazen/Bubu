// Shared Types for the expanded API
export interface IElectronAPI {
    moveWindow: (x: number, y: number) => void;
    setWindowPosition: (x: number, y: number) => void;
    setWindowProperties: (props: any) => void;
    getAllDisplays: () => Promise<any[]>;
    getScreenBounds: () => Promise<{width: number, height: number, x: number, y: number}>;
    setIgnoreMouseEvents: (ignore: boolean, forward?: boolean) => void;
    getSettings: () => Promise<any>;
    saveSettings: (settings: any) => void;
    onPauseStateChanged: (callback: (paused: boolean) => void) => void;
    
    // New APIs
    getActiveWindow: () => Promise<string>;
    onMediaChanged: (callback: (mediaInfo: any) => void) => void;
    startMediaMonitor: () => void;
    stopMediaMonitor: () => void;
    mediaControl: (command: string) => void;
    showSettings: () => void;
    closeApp: () => void;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}
