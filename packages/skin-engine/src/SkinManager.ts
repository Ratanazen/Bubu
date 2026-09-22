import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

/**
 * Animation frame configuration within a skin.
 */
export interface SkinAnimationEntry {
  frames: string[];
  fps: number;
  loop: boolean;
}

/**
 * Skin manifest describing skin identity, author, style, and state-to-animation mapping.
 */
export interface SkinManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  style?: string;
  animations: Record<string, SkinAnimationEntry>;
  preview?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

/**
 * Binary bundle structure for exported skins.
 */
interface SerializedSkinPackage {
  formatVersion: number;
  manifest: SkinManifest;
  files: Array<{
    relativePath: string;
    contentBase64: string;
  }>;
}

/**
 * SkinManager handles loading, switching, creating, deleting, exporting,
 * and importing skins from folders containing manifest.json descriptors.
 */
export class SkinManager {
  private skins: Map<string, SkinManifest> = new Map();
  private skinPaths: Map<string, string> = new Map();
  private activeSkinId: string | null = null;
  private baseDirectory: string | null = null;
  private listeners: Set<(skin: SkinManifest | null) => void> = new Set();

  constructor(defaultDirectory?: string) {
    if (defaultDirectory) {
      this.baseDirectory = defaultDirectory;
      this.loadSkins(defaultDirectory);
    }
  }

  /**
   * Loads all skin directories located inside the specified base directory.
   * Each skin directory must contain a valid `manifest.json`.
   */
  public loadSkins(directory: string): SkinManifest[] {
    this.baseDirectory = directory;

    if (!fs.existsSync(directory)) {
      return [];
    }

    const loaded: SkinManifest[] = [];
    const entries = fs.readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const skinDir = path.join(directory, entry.name);
      const manifestPath = path.join(skinDir, 'manifest.json');

      if (fs.existsSync(manifestPath)) {
        try {
          const raw = fs.readFileSync(manifestPath, 'utf-8');
          const manifest = JSON.parse(raw) as SkinManifest;

          if (manifest && manifest.id && manifest.animations) {
            this.skins.set(manifest.id, manifest);
            this.skinPaths.set(manifest.id, skinDir);
            loaded.push(manifest);

            if (!this.activeSkinId) {
              this.activeSkinId = manifest.id;
            }
          }
        } catch (err) {
          console.error(`Failed to parse skin manifest at ${manifestPath}:`, err);
        }
      }
    }

    return loaded;
  }

  /**
   * Retrieves a loaded skin by ID.
   */
  public getSkin(id: string): SkinManifest | undefined {
    return this.skins.get(id);
  }

  /**
   * Returns the currently active skin manifest, or null if none is selected.
   */
  public getActiveSkin(): SkinManifest | null {
    if (!this.activeSkinId) return null;
    return this.skins.get(this.activeSkinId) ?? null;
  }

  /**
   * Sets the active skin by ID.
   * Returns true if successful, false if the skin ID was not found.
   */
  public setActiveSkin(id: string): boolean {
    const skin = this.skins.get(id);
    if (!skin) {
      return false;
    }

    if (this.activeSkinId !== id) {
      this.activeSkinId = id;
      this.notifyActiveSkinChange(skin);
    }

    return true;
  }

  /**
   * Returns an array of all registered skin manifests.
   */
  public listSkins(): SkinManifest[] {
    return Array.from(this.skins.values());
  }

  /**
   * Creates a new skin folder and writes its `manifest.json`.
   */
  public createSkin(manifest: SkinManifest, targetDir?: string): SkinManifest {
    if (!manifest.id || !manifest.name) {
      throw new Error('Skin manifest must contain valid "id" and "name" properties');
    }

    const baseDir = targetDir ?? this.baseDirectory;
    if (!baseDir) {
      throw new Error('No target directory specified and no base directory loaded');
    }

    const skinFolder = path.join(baseDir, manifest.id);
    if (!fs.existsSync(skinFolder)) {
      fs.mkdirSync(skinFolder, { recursive: true });
    }

    const manifestPath = path.join(skinFolder, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

    this.skins.set(manifest.id, manifest);
    this.skinPaths.set(manifest.id, skinFolder);

    if (!this.activeSkinId) {
      this.setActiveSkin(manifest.id);
    }

    return manifest;
  }

  /**
   * Deletes a skin and removes its folder from the file system.
   */
  public deleteSkin(id: string): boolean {
    const skinPath = this.skinPaths.get(id);
    if (!skinPath) {
      return false;
    }

    try {
      if (fs.existsSync(skinPath)) {
        fs.rmSync(skinPath, { recursive: true, force: true });
      }

      this.skins.delete(id);
      this.skinPaths.delete(id);

      if (this.activeSkinId === id) {
        const remaining = Array.from(this.skins.keys());
        this.activeSkinId = remaining.length > 0 ? remaining[0] : null;
        this.notifyActiveSkinChange(this.getActiveSkin());
      }

      return true;
    } catch (err) {
      console.error(`Failed to delete skin ${id}:`, err);
      return false;
    }
  }

  /**
   * Exports a skin and all accompanying files into a compressed binary Buffer.
   */
  public exportSkin(id: string): Buffer {
    const manifest = this.skins.get(id);
    const skinDir = this.skinPaths.get(id);

    if (!manifest || !skinDir || !fs.existsSync(skinDir)) {
      throw new Error(`Skin with id "${id}" not found on disk`);
    }

    const packageFiles: Array<{ relativePath: string; contentBase64: string }> = [];

    const collectFiles = (currentDir: string): void => {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        const relPath = path.relative(skinDir, fullPath);

        if (entry.isDirectory()) {
          collectFiles(fullPath);
        } else if (entry.isFile() && entry.name !== 'manifest.json') {
          const content = fs.readFileSync(fullPath);
          packageFiles.push({
            relativePath: relPath,
            contentBase64: content.toString('base64'),
          });
        }
      }
    };

    collectFiles(skinDir);

    const skinPackage: SerializedSkinPackage = {
      formatVersion: 1,
      manifest,
      files: packageFiles,
    };

    const serialized = JSON.stringify(skinPackage);
    return zlib.gzipSync(Buffer.from(serialized, 'utf-8'));
  }

  /**
   * Imports a skin package buffer, extracts manifest and files, and registers the skin.
   */
  public importSkin(data: Buffer, targetDirectory?: string): SkinManifest {
    let jsonString: string;

    try {
      // Try decompressing as gzip
      jsonString = zlib.gunzipSync(data).toString('utf-8');
    } catch {
      // Fallback to raw utf-8 string if uncompressed
      jsonString = data.toString('utf-8');
    }

    const skinPackage = JSON.parse(jsonString) as SerializedSkinPackage;
    if (!skinPackage.manifest || !skinPackage.manifest.id) {
      throw new Error('Invalid skin package: missing manifest or manifest.id');
    }

    const baseDir = targetDirectory ?? this.baseDirectory;
    if (!baseDir) {
      throw new Error('No target directory available to unpack imported skin');
    }

    const skinDir = path.join(baseDir, skinPackage.manifest.id);
    if (!fs.existsSync(skinDir)) {
      fs.mkdirSync(skinDir, { recursive: true });
    }

    // Write all packaged files
    if (Array.isArray(skinPackage.files)) {
      for (const file of skinPackage.files) {
        const filePath = path.join(skinDir, file.relativePath);
        const parentDir = path.dirname(filePath);
        if (!fs.existsSync(parentDir)) {
          fs.mkdirSync(parentDir, { recursive: true });
        }
        fs.writeFileSync(filePath, Buffer.from(file.contentBase64, 'base64'));
      }
    }

    // Write manifest.json
    const manifestPath = path.join(skinDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(skinPackage.manifest, null, 2), 'utf-8');

    this.skins.set(skinPackage.manifest.id, skinPackage.manifest);
    this.skinPaths.set(skinPackage.manifest.id, skinDir);

    if (!this.activeSkinId) {
      this.setActiveSkin(skinPackage.manifest.id);
    }

    return skinPackage.manifest;
  }

  /**
   * Resolves the absolute path for a frame file relative to the skin's root directory.
   */
  public resolveFramePath(skinId: string, relativePath: string): string {
    const skinDir = this.skinPaths.get(skinId);
    if (!skinDir) return relativePath;
    return path.isAbsolute(relativePath) ? relativePath : path.join(skinDir, relativePath);
  }

  /**
   * Retrieves the directory path for a skin.
   */
  public getSkinDirectory(id: string): string | undefined {
    return this.skinPaths.get(id);
  }

  /**
   * Listens for changes to the active skin.
   */
  public onActiveSkinChange(callback: (skin: SkinManifest | null) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyActiveSkinChange(skin: SkinManifest | null): void {
    for (const listener of this.listeners) {
      try {
        listener(skin);
      } catch (err) {
        console.error('Error in SkinManager active skin change listener:', err);
      }
    }
  }
}
