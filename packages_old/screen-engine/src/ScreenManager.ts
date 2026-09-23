import {
  MonitorDescriptor,
  BubuScreenPosition,
  ScreenZone,
  MultiMonitorMode,
  ScreenMapState
} from './types';

export interface ScreenManagerDelegate {
  onPositionChanged?: (pos: BubuScreenPosition) => void;
  onMonitorsChanged?: (monitors: MonitorDescriptor[]) => void;
  onWindowBoundsChanged?: (bounds: { x: number; y: number; width: number; height: number }) => void;
}

export class ScreenManager {
  private monitors: Map<string, MonitorDescriptor> = new Map();
  private primaryMonitorId: string = '';
  private activeMonitorId: string = '';
  private bubuPosition: BubuScreenPosition;
  private mode: MultiMonitorMode = 'primary';
  private alwaysOnTop: boolean = true;
  private clickThrough: boolean = false;
  private opacity: number = 1.0;
  private bubuSize: number = 180;
  private listeners: Set<(state: ScreenMapState) => void> = new Set();
  private delegate?: ScreenManagerDelegate;

  constructor(delegate?: ScreenManagerDelegate) {
    this.delegate = delegate;
    this.bubuPosition = {
      x: 100,
      y: 100,
      monitorId: '',
      zone: 'bottom-right',
      relativeX: 0.8,
      relativeY: 0.8
    };
    this.initDefaultMonitors();
  }

  private initDefaultMonitors(): void {
    // Default fallback monitor layout (e.g. standard 1080p display)
    const primary: MonitorDescriptor = {
      id: 'DISPLAY-1',
      name: 'Primary Display',
      bounds: { x: 0, y: 0, width: 1920, height: 1080 },
      workArea: { x: 0, y: 0, width: 1920, height: 1040 },
      scaleFactor: 1.0,
      isPrimary: true,
      refreshRate: 60,
      rotation: 0
    };
    this.monitors.set(primary.id, primary);
    this.primaryMonitorId = primary.id;
    this.activeMonitorId = primary.id;
    this.bubuPosition.monitorId = primary.id;
    this.calculateZonePosition(primary, 'bottom-right');
  }

  public updateMonitors(monitors: MonitorDescriptor[]): void {
    this.monitors.clear();
    for (const m of monitors) {
      this.monitors.set(m.id, m);
      if (m.isPrimary) {
        this.primaryMonitorId = m.id;
      }
    }
    if (!this.monitors.has(this.activeMonitorId)) {
      this.activeMonitorId = this.primaryMonitorId;
    }
    if (!this.monitors.has(this.bubuPosition.monitorId)) {
      this.moveToMonitor(this.primaryMonitorId);
    }
    this.delegate?.onMonitorsChanged?.(Array.from(this.monitors.values()));
    this.notify();
  }

  public getMonitors(): MonitorDescriptor[] {
    return Array.from(this.monitors.values());
  }

  public getPrimaryMonitor(): MonitorDescriptor | undefined {
    return this.monitors.get(this.primaryMonitorId);
  }

  public getActiveMonitor(): MonitorDescriptor | undefined {
    return this.monitors.get(this.activeMonitorId);
  }

  public setActiveMonitor(id: string): void {
    if (this.monitors.has(id)) {
      this.activeMonitorId = id;
      if (this.mode === 'active') {
        this.moveToMonitor(id);
      }
      this.notify();
    }
  }

  public setMode(mode: MultiMonitorMode): void {
    this.mode = mode;
    if (mode === 'primary' && this.primaryMonitorId) {
      this.moveToMonitor(this.primaryMonitorId);
    } else if (mode === 'active' && this.activeMonitorId) {
      this.moveToMonitor(this.activeMonitorId);
    }
    this.notify();
  }

  public moveBubu(absX: number, absY: number): void {
    // Find which monitor contains these coordinates
    let targetMonitor: MonitorDescriptor | undefined;
    for (const m of this.monitors.values()) {
      if (
        absX >= m.bounds.x &&
        absX <= m.bounds.x + m.bounds.width &&
        absY >= m.bounds.y &&
        absY <= m.bounds.y + m.bounds.height
      ) {
        targetMonitor = m;
        break;
      }
    }

    if (!targetMonitor) {
      targetMonitor = this.getPrimaryMonitor();
    }

    if (targetMonitor) {
      const relX = (absX - targetMonitor.bounds.x) / targetMonitor.bounds.width;
      const relY = (absY - targetMonitor.bounds.y) / targetMonitor.bounds.height;

      this.bubuPosition = {
        x: Math.round(absX),
        y: Math.round(absY),
        monitorId: targetMonitor.id,
        zone: this.detectZone(relX, relY),
        relativeX: Math.max(0, Math.min(1, relX)),
        relativeY: Math.max(0, Math.min(1, relY))
      };

      this.delegate?.onPositionChanged?.(this.bubuPosition);
      this.notify();
    }
  }

  public moveToMonitor(monitorId: string): void {
    const target = this.monitors.get(monitorId);
    if (!target) return;

    this.calculateZonePosition(target, this.bubuPosition.zone);
    this.delegate?.onPositionChanged?.(this.bubuPosition);
    this.notify();
  }

  public moveToZone(zone: ScreenZone): void {
    const currentMonitor = this.monitors.get(this.bubuPosition.monitorId) || this.getPrimaryMonitor();
    if (!currentMonitor) return;

    this.calculateZonePosition(currentMonitor, zone);
    this.delegate?.onPositionChanged?.(this.bubuPosition);
    this.notify();
  }

  private calculateZonePosition(m: MonitorDescriptor, zone: ScreenZone): void {
    const margin = 20;
    const petW = this.bubuSize;
    const petH = this.bubuSize;
    const wa = m.workArea || m.bounds;

    let targetX = wa.x + (wa.width - petW) / 2;
    let targetY = wa.y + (wa.height - petH) / 2;

    switch (zone) {
      case 'top-left':
        targetX = wa.x + margin;
        targetY = wa.y + margin;
        break;
      case 'top':
      case 'top-right':
        targetX = wa.x + wa.width - petW - margin;
        targetY = wa.y + margin;
        break;
      case 'left':
      case 'bottom-left':
        targetX = wa.x + margin;
        targetY = wa.y + wa.height - petH - margin;
        break;
      case 'bottom':
      case 'bottom-right':
        targetX = wa.x + wa.width - petW - margin;
        targetY = wa.y + wa.height - petH - margin;
        break;
      case 'center':
      default:
        targetX = wa.x + (wa.width - petW) / 2;
        targetY = wa.y + (wa.height - petH) / 2;
        break;
    }

    const relX = (targetX - m.bounds.x) / m.bounds.width;
    const relY = (targetY - m.bounds.y) / m.bounds.height;

    this.bubuPosition = {
      x: Math.round(targetX),
      y: Math.round(targetY),
      monitorId: m.id,
      zone,
      relativeX: relX,
      relativeY: relY
    };
  }

  private detectZone(relX: number, relY: number): ScreenZone {
    if (relX < 0.33 && relY < 0.33) return 'top-left';
    if (relX > 0.66 && relY < 0.33) return 'top-right';
    if (relX < 0.33 && relY > 0.66) return 'bottom-left';
    if (relX > 0.66 && relY > 0.66) return 'bottom-right';
    if (relY < 0.25) return 'top';
    if (relY > 0.75) return 'bottom';
    if (relX < 0.25) return 'left';
    if (relX > 0.75) return 'right';
    return 'center';
  }

  public setWindowProperties(props: {
    alwaysOnTop?: boolean;
    clickThrough?: boolean;
    opacity?: number;
    size?: number;
  }): void {
    if (props.alwaysOnTop !== undefined) this.alwaysOnTop = props.alwaysOnTop;
    if (props.clickThrough !== undefined) this.clickThrough = props.clickThrough;
    if (props.opacity !== undefined) this.opacity = Math.max(0.1, Math.min(1.0, props.opacity));
    if (props.size !== undefined) {
      this.bubuSize = props.size;
      const m = this.monitors.get(this.bubuPosition.monitorId);
      if (m) this.calculateZonePosition(m, this.bubuPosition.zone);
    }
    this.notify();
  }

  public getState(): ScreenMapState {
    return {
      monitors: Array.from(this.monitors.values()),
      primaryMonitorId: this.primaryMonitorId,
      activeMonitorId: this.activeMonitorId,
      bubuPosition: { ...this.bubuPosition },
      mode: this.mode,
      alwaysOnTop: this.alwaysOnTop,
      clickThrough: this.clickThrough,
      opacity: this.opacity,
      bubuSize: this.bubuSize
    };
  }

  public subscribe(listener: (state: ScreenMapState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const s = this.getState();
    this.listeners.forEach(fn => fn(s));
  }
}
