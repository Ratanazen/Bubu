export type PerformanceProfile = 'normal' | 'low-power' | 'battery-saver' | 'game-mode' | 'focus-mode';

export interface PerformanceMetrics {
  cpuPercent: number;
  memoryMb: number;
  fps: number;
  activeAnimations: number;
  activeTimers: number;
  profile: PerformanceProfile;
  blurEffectsEnabled: boolean;
  maxFps: number;
}

export interface PerformanceConfig {
  profile: PerformanceProfile;
  targetFps: number;
  enableBlur: boolean;
  pauseInFullscreen: boolean;
  lazyLoadAssets: boolean;
}

export class PerformanceEngine {
  private config: PerformanceConfig;
  private currentMetrics: PerformanceMetrics;
  private listeners: Set<(metrics: PerformanceMetrics) => void> = new Set();
  private lastCpuUsage: NodeJS.CpuUsage | null = null;
  private lastCpuTime: number = 0;

  constructor(initialProfile: PerformanceProfile = 'normal') {
    this.config = this.getProfileConfig(initialProfile);
    this.currentMetrics = {
      cpuPercent: 0,
      memoryMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      fps: this.config.targetFps,
      activeAnimations: 1,
      activeTimers: 2,
      profile: initialProfile,
      blurEffectsEnabled: this.config.enableBlur,
      maxFps: this.config.targetFps
    };

    this.lastCpuUsage = process.cpuUsage();
    this.lastCpuTime = Date.now();
  }

  public getProfileConfig(profile: PerformanceProfile): PerformanceConfig {
    switch (profile) {
      case 'game-mode':
        return {
          profile: 'game-mode',
          targetFps: 10,
          enableBlur: false,
          pauseInFullscreen: true,
          lazyLoadAssets: true
        };
      case 'battery-saver':
        return {
          profile: 'battery-saver',
          targetFps: 15,
          enableBlur: false,
          pauseInFullscreen: true,
          lazyLoadAssets: true
        };
      case 'low-power':
        return {
          profile: 'low-power',
          targetFps: 24,
          enableBlur: false,
          pauseInFullscreen: false,
          lazyLoadAssets: true
        };
      case 'focus-mode':
        return {
          profile: 'focus-mode',
          targetFps: 20,
          enableBlur: true,
          pauseInFullscreen: false,
          lazyLoadAssets: false
        };
      case 'normal':
      default:
        return {
          profile: 'normal',
          targetFps: 60,
          enableBlur: true,
          pauseInFullscreen: false,
          lazyLoadAssets: false
        };
    }
  }

  public setProfile(profile: PerformanceProfile): void {
    this.config = this.getProfileConfig(profile);
    this.currentMetrics.profile = profile;
    this.currentMetrics.maxFps = this.config.targetFps;
    this.currentMetrics.blurEffectsEnabled = this.config.enableBlur;
    this.notifyListeners();
  }

  public getMetrics(): PerformanceMetrics {
    // Non-blocking compute on demand
    const now = Date.now();
    const elapsedMs = now - this.lastCpuTime;

    if (this.lastCpuUsage && elapsedMs > 500) {
      const diff = process.cpuUsage(this.lastCpuUsage);
      const totalMicroseconds = diff.user + diff.system;
      const percent = (totalMicroseconds / (elapsedMs * 1000)) * 100;
      this.currentMetrics.cpuPercent = Math.min(100, Math.max(0, Math.round(percent * 10) / 10));
      this.lastCpuUsage = process.cpuUsage();
      this.lastCpuTime = now;
    }

    this.currentMetrics.memoryMb = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    return { ...this.currentMetrics };
  }

  public updateAnimationCount(count: number): void {
    this.currentMetrics.activeAnimations = count;
  }

  public onMetrics(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    const metrics = this.getMetrics();
    this.listeners.forEach(cb => cb(metrics));
  }
}
