import { LyricsResult } from './types';

/**
 * Interface implemented by lyrics providers (e.g. lrclib, local filesystem, etc).
 */
export interface LyricsProvider {
  /**
   * Unique name of the lyrics provider.
   */
  readonly name: string;

  /**
   * Searches for lyrics matching the given title and artist.
   * Returns LyricsResult if found, or null if no lyrics match.
   */
  searchLyrics(title: string, artist: string): Promise<LyricsResult | null>;
}
