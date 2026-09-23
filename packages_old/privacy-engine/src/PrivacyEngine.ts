export interface PermissionDetail {
  id: string;
  name: string;
  description: string;
  whatIsAccessed: string;
  whyNeeded: string;
  whereDataGoes: string;
  isDataStored: boolean;
  howToDisable: string;
  enabled: boolean;
}

export interface PrivacyReport {
  timestamp: number;
  activePermissions: string[];
  dataCollected: string[];
  leaksPrevented: number;
  privacyScore: number;
}

export class PrivacyEngine {
  private permissions: Map<string, PermissionDetail> = new Map();
  private preventedCount: number = 0;

  constructor() {
    this.registerDefaultPermissions();
  }

  private registerDefaultPermissions(): void {
    const defaults: PermissionDetail[] = [
      {
        id: 'appMonitoring',
        name: 'Application Monitoring',
        description: 'Detects active foreground application name to trigger contextual states.',
        whatIsAccessed: 'Only active window title/class via OS APIs.',
        whyNeeded: 'Enables pet focus mode when coding and hiding during fullscreen gaming.',
        whereDataGoes: 'Processed entirely in local memory. Never sent anywhere.',
        isDataStored: false,
        howToDisable: 'Toggle off in Privacy Center or Settings.',
        enabled: false
      },
      {
        id: 'browserIntegration',
        name: 'Browser Integration',
        description: 'Receives media titles and playback states from browser extension.',
        whatIsAccessed: 'Song title, artist name, playback position on supported music sites.',
        whyNeeded: 'Enables pet dancing and real-time lyrics syncing.',
        whereDataGoes: 'Local WebSocket (127.0.0.1) bridge only.',
        isDataStored: false,
        howToDisable: 'Disable extension in browser or toggle off in Privacy Center.',
        enabled: false
      },
      {
        id: 'musicDetection',
        name: 'Media Session Detection',
        description: 'Reads OS media session status for playing tracks.',
        whatIsAccessed: 'Track metadata from OS media controllers.',
        whyNeeded: 'Reactions to playback changes and mood syncing.',
        whereDataGoes: 'Local memory only.',
        isDataStored: false,
        howToDisable: 'Toggle off in Privacy Center.',
        enabled: true
      },
      {
        id: 'lyrics',
        name: 'Lyrics Fetching',
        description: 'Queries open lyrics provider (lrclib.net) for synced lyrics.',
        whatIsAccessed: 'Search query containing only track title and artist name.',
        whyNeeded: 'Displays floating synchronized lyrics.',
        whereDataGoes: 'Sent to public HTTPS endpoint (lrclib.net).',
        isDataStored: true,
        howToDisable: 'Toggle off in Privacy Center or switch to Local LRC mode.',
        enabled: true
      },
      {
        id: 'notifications',
        name: 'System Notifications',
        description: 'Listens for system alerts to show cute speech bubble notifications.',
        whatIsAccessed: 'Notification summary and app name.',
        whyNeeded: 'Pet alerts user to incoming events.',
        whereDataGoes: 'Local display memory only. Cleared automatically.',
        isDataStored: false,
        howToDisable: 'Toggle off in Privacy Center.',
        enabled: false
      },
      {
        id: 'telemetry',
        name: 'Anonymous Telemetry',
        description: 'Crash reporting and usage diagnostics.',
        whatIsAccessed: 'None by default. Strictly opt-in.',
        whyNeeded: 'Bug tracking and stability improvements.',
        whereDataGoes: 'Nowhere currently. Default is completely OFF.',
        isDataStored: false,
        howToDisable: 'Always toggleable off.',
        enabled: false
      },
      {
        id: 'aiGeneration',
        name: 'AI Image Generation',
        description: 'Optional sprite variation generator.',
        whatIsAccessed: 'Custom prompt and character reference image.',
        whyNeeded: 'Generates new character variants and styles.',
        whereDataGoes: 'User-configured external AI provider endpoint with user API key.',
        isDataStored: false,
        howToDisable: 'Clear API credentials or toggle off.',
        enabled: false
      }
    ];

    defaults.forEach(p => this.permissions.set(p.id, p));
  }

  public getPermission(id: string): PermissionDetail | undefined {
    return this.permissions.get(id);
  }

  public isAllowed(id: string): boolean {
    const p = this.permissions.get(id);
    return p ? p.enabled : false;
  }

  public setPermission(id: string, enabled: boolean): void {
    const p = this.permissions.get(id);
    if (p) {
      p.enabled = enabled;
    }
  }

  public getAllPermissions(): PermissionDetail[] {
    return Array.from(this.permissions.values());
  }

  public redactSensitiveData(input: string): string {
    let sanitized = input;
    // Redact tokens, keys, passwords, bearer headers
    sanitized = sanitized.replace(/(bearer\s+)[a-zA-Z0-9_\-\.]+/gi, '$1[REDACTED]');
    sanitized = sanitized.replace(/(api[_-]?key["']?\s*[:=]\s*["']?)[a-zA-Z0-9_\-\.]+/gi, '$1[REDACTED]');
    sanitized = sanitized.replace(/(password["']?\s*[:=]\s*["']?)[^\s"']+/gi, '$1[REDACTED]');
    sanitized = sanitized.replace(/(token["']?\s*[:=]\s*["']?)[a-zA-Z0-9_\-\.]+/gi, '$1[REDACTED]');
    sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL REDACTED]');
    return sanitized;
  }

  public generateReport(): PrivacyReport {
    const active = Array.from(this.permissions.values())
      .filter(p => p.enabled)
      .map(p => p.id);

    return {
      timestamp: Date.now(),
      activePermissions: active,
      dataCollected: ['Local settings', 'Cached skins', 'Active theme preferences'],
      leaksPrevented: this.preventedCount,
      privacyScore: active.length <= 2 ? 100 : Math.max(60, 100 - active.length * 8)
    };
  }
}
