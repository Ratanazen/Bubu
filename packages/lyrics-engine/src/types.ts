/**
 * A single line of lyrics with timestamp and optional duration.
 */
export interface LyricLine {
  /**
   * Timestamp in seconds from track start.
   */
  time: number;

  /**
   * The text of the lyric line.
   */
  text: string;

  /**
   * Optional duration of this line in seconds.
   */
  duration?: number;
}

/**
 * Result returned by a lyrics search or provider.
 */
export interface LyricsResult {
  /**
   * Unique identifier or source ID for the lyrics.
   */
  id: string;

  /**
   * Track title.
   */
  title: string;

  /**
   * Artist name.
   */
  artist: string;

  /**
   * Synchronized lyrics line-by-line, if available.
   */
  syncedLyrics?: LyricLine[];

  /**
   * Plain-text lyrics without timestamps, if available.
   */
  plainLyrics?: string;

  /**
   * Name or identifier of the provider/source (e.g., 'lrclib', 'local').
   */
  source: string;
}

/**
 * Configuration options for rendering and synchronizing lyrics display.
 */
export interface LyricsDisplayConfig {
  fontSize: number;
  fontFamily: string;
  opacity: number;
  theme: string;
  highlightColor: string;
  showAlbumArt: boolean;
  autoScroll: boolean;
  offset: number;
}

/**
 * Default configuration for lyrics display.
 */
export const DEFAULT_LYRICS_DISPLAY_CONFIG: Readonly<LyricsDisplayConfig> = Object.freeze({
  fontSize: 24,
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  opacity: 0.95,
  theme: 'dark',
  highlightColor: '#ffb3ba',
  showAlbumArt: true,
  autoScroll: true,
  offset: 0,
});
