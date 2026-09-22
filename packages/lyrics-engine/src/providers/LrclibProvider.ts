import { LyricsProvider } from '../LyricsProvider';
import { LyricsResult } from '../types';
import { LrcParser } from '../LrcParser';

interface LrclibSearchItem {
  id: number;
  name?: string;
  trackName?: string;
  artistName?: string;
  albumName?: string;
  duration?: number;
  instrumental?: boolean;
  plainLyrics?: string;
  syncedLyrics?: string;
}

export interface LrclibProviderOptions {
  timeoutMs?: number;
  userAgent?: string;
}

/**
 * Lyrics provider implementation that fetches synchronized and plain lyrics
 * from the public LRCLIB (lrclib.net) community database.
 */
export class LrclibProvider implements LyricsProvider {
  public readonly name = 'lrclib';
  private readonly timeoutMs: number;
  private readonly userAgent: string;

  constructor(options?: LrclibProviderOptions) {
    this.timeoutMs = options?.timeoutMs ?? 7000;
    this.userAgent =
      options?.userAgent ??
      'Bubu-Desktop-Companion/1.0.0 (https://github.com/reny/Bubu)';
  }

  /**
   * Searches LRCLIB for lyrics matching the given track title and artist.
   */
  public async searchLyrics(title: string, artist: string): Promise<LyricsResult | null> {
    if (!title && !artist) {
      return null;
    }

    try {
      const url = new URL('https://lrclib.net/api/search');
      if (title) {
        url.searchParams.set('track_name', title.trim());
      }
      if (artist) {
        url.searchParams.set('artist_name', artist.trim());
      }

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);

      let response: Response;
      try {
        response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'User-Agent': this.userAgent,
            Accept: 'application/json',
          },
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timer);
      }

      if (!response.ok) {
        return null;
      }

      const items = (await response.json()) as LrclibSearchItem[];
      if (!Array.isArray(items) || items.length === 0) {
        return null;
      }

      // Prioritize an item that contains syncedLyrics over plainLyrics
      const bestMatch =
        items.find((item) => item.syncedLyrics && item.syncedLyrics.trim().length > 0) ||
        items.find((item) => item.plainLyrics && item.plainLyrics.trim().length > 0) ||
        items[0];

      if (!bestMatch) {
        return null;
      }

      const trackTitle = bestMatch.trackName || bestMatch.name || title;
      const artistName = bestMatch.artistName || artist;

      const syncedLines = bestMatch.syncedLyrics
        ? LrcParser.parse(bestMatch.syncedLyrics)
        : undefined;

      return {
        id: `lrclib:${bestMatch.id}`,
        title: trackTitle,
        artist: artistName,
        syncedLyrics: syncedLines && syncedLines.length > 0 ? syncedLines : undefined,
        plainLyrics: bestMatch.plainLyrics || undefined,
        source: this.name,
      };
    } catch {
      // Gracefully handle network timeouts, aborts, or connectivity issues
      return null;
    }
  }
}
