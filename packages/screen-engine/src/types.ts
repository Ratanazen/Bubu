export type ScreenZone =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'center'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'custom';

export type MultiMonitorMode =
  | 'fixed'
  | 'active'
  | 'primary'
  | 'random'
  | 'follow-mouse'
  | 'follow-app';

export interface DisplayBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MonitorDescriptor {
  id: string;
  name: string;
  bounds: DisplayBounds;
  workArea: DisplayBounds;
  scaleFactor: number;
  isPrimary: boolean;
  refreshRate?: number;
  rotation?: number; // 0, 90, 180, 270
}

export interface BubuScreenPosition {
  x: number;
  y: number;
  monitorId: string;
  zone: ScreenZone;
  relativeX: number; // 0.0 - 1.0 within monitor
  relativeY: number; // 0.0 - 1.0 within monitor
}

export interface ScreenMapState {
  monitors: MonitorDescriptor[];
  primaryMonitorId: string;
  activeMonitorId: string;
  bubuPosition: BubuScreenPosition;
  mode: MultiMonitorMode;
  alwaysOnTop: boolean;
  clickThrough: boolean;
  opacity: number;
  bubuSize: number;
}
