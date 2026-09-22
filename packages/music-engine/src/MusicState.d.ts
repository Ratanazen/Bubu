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
export type MusicCommand = 'play' | 'pause' | 'next' | 'previous' | 'seek';
/**
 * Track metadata subset without playback position.
 */
export interface TrackInfo {
    title: string;
    artist: string;
    album: string;
    artworkUrl?: string;
    duration: number;
}
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
    source: MusicSource;
}
/**
 * Default initial music playback state when no audio source is active.
 */
export declare const DEFAULT_MUSIC_STATE: Readonly<MusicState>;
//# sourceMappingURL=MusicState.d.ts.map