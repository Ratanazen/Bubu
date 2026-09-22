/**
 * SettingsStore - Persistent settings storage backed by JSON files.
 * Supports dot-notation keys, atomic write operations, and automatic directory creation.
 */

import * as fs from 'fs';
import * as path from 'path';

export class SettingsStore {
  private filePath: string;
  private data: Record<string, any>;

  constructor(configDir: string, filename: string = 'settings.json') {
    if (!configDir) {
      throw new TypeError('configDir must be specified');
    }

    try {
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
    } catch (err) {
      console.error(`[SettingsStore] Failed to ensure config directory "${configDir}":`, err);
    }

    this.filePath = path.join(configDir, filename);
    this.data = {};
    this.load();
  }

  /**
   * Retrieves a setting value by key, with optional default fallback.
   * Supports dot-notation for nested property lookup (e.g. 'pet.direction').
   */
  get<T = any>(key: string, defaultValue?: T): T {
    if (!key || typeof key !== 'string') {
      return defaultValue as T;
    }

    if (Object.prototype.hasOwnProperty.call(this.data, key)) {
      return this.data[key] as T;
    }

    if (key.includes('.')) {
      const parts = key.split('.');
      let current: any = this.data;
      for (const part of parts) {
        if (current === null || current === undefined || typeof current !== 'object') {
          return defaultValue as T;
        }
        current = current[part];
      }
      if (current !== undefined) {
        return current as T;
      }
    }

    return defaultValue as T;
  }

  /**
   * Sets a setting value by key and commits it atomically to disk.
   * Supports dot-notation for nested property assignment.
   */
  set(key: string, value: any): void {
    if (!key || typeof key !== 'string') {
      throw new TypeError('Setting key must be a non-empty string');
    }

    if (key.includes('.') && !Object.prototype.hasOwnProperty.call(this.data, key)) {
      const parts = key.split('.');
      let current: any = this.data;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part] || typeof current[part] !== 'object' || Array.isArray(current[part])) {
          current[part] = {};
        }
        current = current[part];
      }
      current[parts[parts.length - 1]] = value;
    } else {
      this.data[key] = value;
    }

    this.save();
  }

  /**
   * Checks whether a setting key exists.
   */
  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Returns a deep clone of all stored settings.
   */
  getAll(): Record<string, any> {
    try {
      return JSON.parse(JSON.stringify(this.data));
    } catch {
      return { ...this.data };
    }
  }

  /**
   * Replaces or merges all settings with the given object and saves to disk.
   */
  setAll(data: Record<string, any>): void {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      throw new TypeError('Settings data must be a valid object');
    }
    this.data = { ...this.data, ...data };
    this.save();
  }

  /**
   * Deletes a setting key and commits change to disk.
   */
  delete(key: string): void {
    if (!key || typeof key !== 'string') return;

    if (Object.prototype.hasOwnProperty.call(this.data, key)) {
      delete this.data[key];
      this.save();
      return;
    }

    if (key.includes('.')) {
      const parts = key.split('.');
      let current: any = this.data;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current || typeof current !== 'object') return;
        current = current[part];
      }
      if (current && typeof current === 'object' && Object.prototype.hasOwnProperty.call(current, parts[parts.length - 1])) {
        delete current[parts[parts.length - 1]];
        this.save();
      }
    }
  }

  /**
   * Clears all settings and saves an empty object to disk.
   */
  clear(): void {
    this.data = {};
    this.save();
  }

  /**
   * Returns the absolute path to the settings file.
   */
  getFilePath(): string {
    return this.filePath;
  }

  /**
   * Loads settings from the filesystem.
   */
  private load(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        if (raw.trim().length > 0) {
          const parsed = JSON.parse(raw);
          if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
            this.data = parsed;
          } else {
            console.warn(`[SettingsStore] Settings file "${this.filePath}" did not contain a valid object. Initializing empty.`);
            this.data = {};
          }
        } else {
          this.data = {};
        }
      } else {
        this.data = {};
      }
    } catch (err) {
      console.error(`[SettingsStore] Failed to read settings from "${this.filePath}":`, err);
      this.data = {};
    }
  }

  /**
   * Writes the current settings to disk atomically using a temporary file and atomic rename.
   */
  private save(): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const tempFile = path.join(
      dir,
      `.${path.basename(this.filePath)}.${Date.now()}.${Math.random().toString(36).substring(2, 9)}.tmp`
    );

    try {
      const jsonContent = JSON.stringify(this.data, null, 2);
      fs.writeFileSync(tempFile, jsonContent, 'utf-8');

      try {
        fs.renameSync(tempFile, this.filePath);
      } catch (renameErr) {
        // Fallback for systems where rename cannot overwrite an existing open file
        fs.copyFileSync(tempFile, this.filePath);
        try {
          fs.unlinkSync(tempFile);
        } catch {
          // Ignore temp cleanup error
        }
      }
    } catch (err) {
      if (fs.existsSync(tempFile)) {
        try {
          fs.unlinkSync(tempFile);
        } catch {
          // Ignore temp cleanup error
        }
      }
      console.error(`[SettingsStore] Failed to save settings to "${this.filePath}":`, err);
      throw err;
    }
  }
}
