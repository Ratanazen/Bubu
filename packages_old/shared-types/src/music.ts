/**
 * Music playback states.
 */
export type MusicPlaybackState = 'playing' | 'paused' | 'stopped';

/**
 * Sources providing media playback detection and controls.
 */
export type MusicSource = 'browser' | 'spotify' | 'local' | 'system' | 'unknown';

/**
 * Commands available to control music playback.
 */
export type MusicCommand = 'play' | 'pause' | 'next' | 'previous' | 'seek' | 'volume';

/**
 * Current media session state and playback information.
 */
export interface MusicState {
  state: MusicPlaybackState;
  title: string;
  artist: string;
  album: string;
  duration: number;
  position: number;
  artworkUrl?: string;
}

/**
 * Command payload for executing a music control action.
 */
export interface MusicCommandAction {
  command: MusicCommand;
  value?: number;
}
