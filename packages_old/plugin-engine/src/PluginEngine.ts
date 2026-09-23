export type PluginCategory = 'music' | 'lyrics' | 'browser' | 'skin' | 'animation' | 'integration' | 'ai';

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: PluginCategory;
  permissions: string[];
  capabilities: string[];
  entryPoint?: string;
}

export interface PluginInstance {
  manifest: PluginManifest;
  enabled: boolean;
  loadedAt: number;
  api?: any;
}

export class PluginEngine {
  private plugins: Map<string, PluginInstance> = new Map();
  private allowedPermissions: Set<string> = new Set([
    'lyrics.read',
    'music.read',
    'music.control',
    'pet.animation',
    'pet.skin',
    'theme.customize',
    'notification.send'
  ]);

  constructor() {
    this.registerBuiltinPlugins();
  }

  private registerBuiltinPlugins(): void {
    const defaultPlugins: PluginManifest[] = [
      {
        id: 'builtin-lrclib',
        name: 'LRCLIB Synced Lyrics',
        version: '1.0.0',
        description: 'Synchronized real-time lyrics integration via open LRCLIB database.',
        author: 'Bubu Team',
        category: 'lyrics',
        permissions: ['lyrics.read'],
        capabilities: ['synced-lyrics', 'lrc-parser']
      },
      {
        id: 'builtin-waybar',
        name: 'Waybar Integration',
        version: '1.0.0',
        description: 'Exposes Bubu pet status, mood, and music info as Waybar JSON modules.',
        author: 'Bubu Team',
        category: 'integration',
        permissions: ['pet.animation', 'music.read'],
        capabilities: ['status-bar', 'json-polling']
      },
      {
        id: 'builtin-browser-bridge',
        name: 'Browser Media Extension Bridge',
        version: '1.0.0',
        description: 'Connects YouTube Music & Spotify Web tabs via local WebSocket.',
        author: 'Bubu Team',
        category: 'browser',
        permissions: ['music.read', 'music.control'],
        capabilities: ['websocket-bridge', 'media-detection']
      }
    ];

    defaultPlugins.forEach(p => {
      this.plugins.set(p.id, {
        manifest: p,
        enabled: true,
        loadedAt: Date.now()
      });
    });
  }

  public registerPlugin(manifest: PluginManifest): { success: boolean; error?: string } {
    // Validate manifest
    if (!manifest.id || !manifest.name || !manifest.version) {
      return { success: false, error: 'Malformed plugin manifest: missing required fields' };
    }

    // Check permissions safety
    for (const perm of manifest.permissions) {
      if (!this.allowedPermissions.has(perm)) {
        return { success: false, error: `Unauthorized permission request: "${perm}"` };
      }
    }

    this.plugins.set(manifest.id, {
      manifest,
      enabled: true,
      loadedAt: Date.now()
    });

    return { success: true };
  }

  public enablePlugin(id: string): boolean {
    const p = this.plugins.get(id);
    if (p) {
      p.enabled = true;
      return true;
    }
    return false;
  }

  public disablePlugin(id: string): boolean {
    const p = this.plugins.get(id);
    if (p) {
      p.enabled = false;
      return true;
    }
    return false;
  }

  public listPlugins(category?: PluginCategory): PluginInstance[] {
    const all = Array.from(this.plugins.values());
    return category ? all.filter(p => p.manifest.category === category) : all;
  }

  public getPlugin(id: string): PluginInstance | undefined {
    return this.plugins.get(id);
  }
}
