export interface WindowInfo {
  id: string;
  title: string;
  application: string;
  pid?: number;
  geometry: { x: number; y: number; width: number; height: number };
  monitorId: string;
  workspaceId: string;
  focused: boolean;
  visible: boolean;
  floating: boolean;
}

export class WindowEngine {
  private windows: Map<string, WindowInfo> = new Map();
  private activeWindowId: string = '';
  private listeners: Set<(windows: WindowInfo[], activeId: string) => void> = new Set();

  public updateWindows(windows: WindowInfo[]): void {
    this.windows.clear();
    for (const w of windows) {
      this.windows.set(w.id, w);
      if (w.focused) {
        this.activeWindowId = w.id;
      }
    }
    this.notify();
  }

  public getWindows(): WindowInfo[] {
    return Array.from(this.windows.values());
  }

  public getActiveWindow(): WindowInfo | undefined {
    return this.windows.get(this.activeWindowId);
  }

  public subscribe(listener: (windows: WindowInfo[], activeId: string) => void): () => void {
    this.listeners.add(listener);
    listener(this.getWindows(), this.activeWindowId);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const list = this.getWindows();
    this.listeners.forEach(fn => fn(list, this.activeWindowId));
  }
}
