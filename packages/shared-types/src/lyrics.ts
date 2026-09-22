/**
 * Single synchronized lyric line with timestamp and optional duration.
 */
export interface LyricLine {
  time: number; // in seconds
  text: string;
  duration?: number;
}

/**
 * Result returned from lyrics search / fetch operations.
 */
export interface LyricsResult {
  id: string;
  title: string;
  artist: string;
  syncedLyrics?: LyricLine[];
  plainLyrics?: string;
  source: string;
}

/**
 * User visual preferences and styling for the lyrics overlay / widget.
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
