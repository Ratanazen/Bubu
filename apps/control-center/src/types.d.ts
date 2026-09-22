export interface IElectronAPI {
  moveWindow?: (x: number, y: number) => void;
  setWindowPosition?: (x: number, y: number) => void;
  setWindowProperties?: (props: any) => void;
  saveSettings?: (settings: any) => void;
  getSettings?: () => Promise<any>;
  getAllDisplays?: () => Promise<any[]>;
  getScreenBounds?: () => Promise<{ width: number; height: number; x: number; y: number }>;
}

declare global {
  interface Window {
    electronAPI?: IElectronAPI;
  }
}
