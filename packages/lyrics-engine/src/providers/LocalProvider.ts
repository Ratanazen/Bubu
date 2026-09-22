import * as fs from 'fs';
import * as path from 'path';
import { LyricsProvider } from '../LyricsProvider';
import { LyricsResult } from '../types';
import { LrcParser } from '../LrcParser';

export interface LocalProviderOptions {
  lyricsDirectory?: string;
  recursive?: boolean;
}

/**
 * Lyrics provider that searches the local filesystem for .lrc files matching
 * the active song's title and artist.
 */
export class LocalProvider implements LyricsProvider {
  public readonly name = 'local';
  private directory?: string;
  private readonly recursive: boolean;

  constructor(options?: LocalProviderOptions | string) {
    if (typeof options === 'string') {
      this.directory = options;
      this.recursive = false;
    } else {
      this.directory = options?.lyricsDirectory;
      this.recursive = options?.recursive ?? false;
    }
  }

  /**
   * Sets the base directory where .lrc files will be looked up.
   */
  public setDirectory(directory: string): void {
    this.directory = directory;
  }

  /**
   * Gets the currently configured lyrics directory.
   */
  public getDirectory(): string | undefined {
    return this.directory;
  }

  /**
   * Searches for a matching .lrc file in the configured local directory.
   */
  public async searchLyrics(title: string, artist: string): Promise<LyricsResult | null> {
    if (!this.directory || (!title && !artist)) {
      return null;
    }

    try {
      const dirStat = await fs.promises.stat(this.directory).catch(() => null);
      if (!dirStat || !dirStat.isDirectory()) {
        return null;
      }

      const filePath = await this.findMatchingFile(this.directory, title, artist);
      if (!filePath) {
        return null;
      }

      const fileContent = await fs.promises.readFile(filePath, 'utf-8');
      const { lines, metadata } = LrcParser.parseWithMetadata(fileContent);

      const parsedTitle = metadata['ti'] || title;
      const parsedArtist = metadata['ar'] || artist;

      return {
        id: `local:${filePath}`,
        title: parsedTitle,
        artist: parsedArtist,
        syncedLyrics: lines.length > 0 ? lines : undefined,
        plainLyrics: lines.map((l) => l.text).filter(Boolean).join('\n') || undefined,
        source: this.name,
      };
    } catch {
      return null;
    }
  }

  private async findMatchingFile(
    dir: string,
    title: string,
    artist: string
  ): Promise<string | null> {
    const normTitle = this.normalize(title);
    const normArtist = this.normalize(artist);

    // Candidates to test directly for efficiency
    const candidates = [
      `${artist} - ${title}.lrc`,
      `${title} - ${artist}.lrc`,
      `${title}.lrc`,
    ];

    for (const candidate of candidates) {
      const fullPath = path.join(dir, candidate);
      try {
        await fs.promises.access(fullPath, fs.constants.R_OK);
        return fullPath;
      } catch {
        // file doesn't exist by direct name
      }
    }

    // Fall back to scanning directory entries
    return this.scanDirectory(dir, normTitle, normArtist);
  }

  private async scanDirectory(
    dir: string,
    normTitle: string,
    normArtist: string
  ): Promise<string | null> {
    try {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory() && this.recursive) {
          const subMatch = await this.scanDirectory(fullPath, normTitle, normArtist);
          if (subMatch) {
            return subMatch;
          }
        } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.lrc')) {
          const baseName = entry.name.slice(0, -4);
          const normFile = this.normalize(baseName);

          if (normTitle && normFile.includes(normTitle)) {
            if (!normArtist || normFile.includes(normArtist)) {
              return fullPath;
            }
          }
        }
      }
    } catch {
      // directory read failure
    }

    return null;
  }

  private normalize(str: string): string {
    return (str || '')
      .toLowerCase()
      .replace(/[\(\)\[\]\{\}\-_,.'"!?:;]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
