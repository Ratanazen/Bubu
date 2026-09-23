import { LyricsProvider } from './LyricsProvider';
import { LyricLine, LyricsResult } from './types';
import { LyricsSynchronizer, VisibleLyricLine } from './LyricsSynchronizer';
import { LrclibProvider } from './providers/LrclibProvider';
import { LocalProvider } from './providers/LocalProvider';

interface ProviderRegistration {
  provider: LyricsProvider;
  priority: number;
}

export interface LyricsEngineOptions {
  localLyricsDirectory?: string;
  defaultProviders?: boolean;
}

/**
 * Main engine responsible for coordinating lyrics providers, memory caching,
 * temporal offset management, and real-time lyric line synchronization.
 */
export class LyricsEngine {
  private readonly providers: ProviderRegistration[] = [];
  private readonly cache: Map<string, LyricsResult | null> = new Map();
  private readonly synchronizer: LyricsSynchronizer = new LyricsSynchronizer();
  private currentLyrics: LyricsResult | null = null;
  private offsetMs: number = 0;

  constructor(options?: LyricsEngineOptions) {
    if (options?.defaultProviders !== false) {
      // Local files have highest priority if local directory is specified
      if (options?.localLyricsDirectory) {
        this.registerProvider(new LocalProvider(options.localLyricsDirectory), 20);
      }
      // LRCLIB public provider
      this.registerProvider(new LrclibProvider(), 10);
    }
  }

  /**
   * Registers a lyrics provider with a priority score (higher priority executes first).
   */
  public registerProvider(provider: LyricsProvider, priority: number = 0): void {
    // Remove if already registered
    this.removeProvider(provider.name);
    this.providers.push({ provider, priority });
    this.providers.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Removes a provider by its name.
   */
  public removeProvider(providerName: string): boolean {
    const idx = this.providers.findIndex((p) => p.provider.name === providerName);
    if (idx !== -1) {
      this.providers.splice(idx, 1);
      return true;
    }
    return false;
  }

  /**
   * Returns registered providers sorted by priority descending.
   */
  public getProviders(): LyricsProvider[] {
    return this.providers.map((p) => p.provider);
  }

  /**
   * Finds lyrics for the given song title and artist by checking the memory cache,
   * then querying registered providers in priority order.
   */
  public async findLyrics(title: string, artist: string): Promise<LyricsResult | null> {
    const cacheKey = this.buildCacheKey(title, artist);
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey) || null;
      this.setCurrentLyrics(cached);
      return cached;
    }

    for (const { provider } of this.providers) {
      try {
        const result = await provider.searchLyrics(title, artist);
        if (result) {
          this.cache.set(cacheKey, result);
          this.setCurrentLyrics(result);
          return result;
        }
      } catch (err) {
        console.warn(`Lyrics provider "${provider.name}" failed:`, err);
      }
    }

    // Cache negative result to prevent redundant queries
    this.cache.set(cacheKey, null);
    this.setCurrentLyrics(null);
    return null;
  }

  /**
   * Clears the in-memory lyrics cache.
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Sets the global lyrics offset in milliseconds.
   * Positive value causes lyrics to appear sooner; negative value delays lyrics.
   */
  public setOffset(ms: number): void {
    this.offsetMs = ms;
    this.synchronizer.setOffset(ms / 1000);
  }

  /**
   * Gets the current offset in milliseconds.
   */
  public getOffset(): number {
    return this.offsetMs;
  }

  /**
   * Sets the currently active lyrics result and updates the internal synchronizer.
   */
  public setCurrentLyrics(lyrics: LyricsResult | null): void {
    this.currentLyrics = lyrics;
    this.synchronizer.setLines(lyrics?.syncedLyrics ?? []);
    this.synchronizer.setOffset(this.offsetMs / 1000);
  }

  /**
   * Returns the currently active lyrics result.
   */
  public getCurrentLyrics(): LyricsResult | null {
    return this.currentLyrics;
  }

  /**
   * Gets the active LyricLine for the specified playback position in seconds.
   */
  public getCurrentLine(position: number): LyricLine | null {
    return this.synchronizer.getCurrentLine(position);
  }

  /**
   * Gets the active line index for the specified playback position in seconds.
   */
  public getCurrentLineIndex(position: number): number {
    return this.synchronizer.getCurrentLineIndex(position);
  }

  /**
   * Returns a window of visible lines centered on the current line for UI display.
   */
  public getVisibleLines(position: number, count: number = 5): VisibleLyricLine[] {
    return this.synchronizer.getVisibleLines(position, count);
  }

  private buildCacheKey(title: string, artist: string): string {
    const cleanTitle = (title || '').trim().toLowerCase();
    const cleanArtist = (artist || '').trim().toLowerCase();
    return `${cleanArtist}:::${cleanTitle}`;
  }
}
