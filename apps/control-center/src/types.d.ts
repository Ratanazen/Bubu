export interface IElectronAPI {
  moveWindow?: (x: number, y: number) => void;
  setWindowPosition?: (x: number, y: number) => void;
  setWindowProperties?: (props: any) => void;
  getAllDisplays?: () => Promise<any[]>;
  getScreenBounds?: () => Promise<{ width: number; height: number; x: number; y: number }>;
}

declare global {
  interface Window {
    electronAPI?: IElectronAPI;
  }
}
