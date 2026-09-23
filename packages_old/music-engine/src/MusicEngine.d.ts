import { MusicCommand, MusicSource, MusicState, TrackInfo } from './MusicState';
/**
 * Callback invoked when music playback state changes.
 */
export type StateChangeCallback = (state: MusicState) => void;
/**
 * Handler invoked when a media command needs to be executed by a platform/source.
 */
export type MusicCommandHandler = (command: MusicCommand, value?: number) => void | Promise<void>;
/**
 * Options for configuring MusicEngine instance.
 */
export interface MusicEngineOptions {
    initialState?: Partial<MusicState>;
}
/**
 * Central engine for managing music playback state, dispatching media commands,
 * and coordinating state updates from multiple sources (browser, Spotify, OS media sessions).
 */
export declare class MusicEngine {
    private state;
    private readonly stateListeners;
    private commandHandler;
    private readonly sourceCommandHandlers;
    constructor(options?: MusicEngineOptions);
    /**
     * Returns a copy of the current music state.
     */
    getState(): MusicState;
    /**
     * Checks whether music is currently actively playing.
     */
    isPlaying(): boolean;
    /**
     * Returns current track metadata.
     */
    getCurrentTrack(): TrackInfo;
    /**
     * Subscribes a listener to music state changes.
     * Returns an unsubscribe function to remove the listener.
     */
    onStateChange(callback: StateChangeCallback): () => void;
    /**
     * Updates current music state with partial fields.
     * Emits state change event to registered listeners if state has changed.
     */
    updateState(partial: Partial<MusicState>, source?: MusicSource): MusicState;
    /**
     * Registers a default handler for media commands.
     * Returns an unregister function.
     */
    registerCommandHandler(handler: MusicCommandHandler): () => void;
    /**
     * Sets or clears the active command handler.
     */
    setCommandHandler(handler: MusicCommandHandler | null): void;
    /**
     * Registers a command handler specifically for a given source.
     */
    registerSourceHandler(source: MusicSource, handler: MusicCommandHandler): () => void;
    /**
     * Executes a media command by dispatching to source-specific or default handler.
     */
    executeCommand(command: MusicCommand, value?: number): Promise<void>;
    /**
     * Resume or start playback.
     */
    play(): Promise<void>;
    /**
     * Pause playback.
     */
    pause(): Promise<void>;
    /**
     * Skip to next track.
     */
    next(): Promise<void>;
    /**
     * Skip to previous track.
     */
    previous(): Promise<void>;
    /**
     * Seek playback to target position in seconds.
     */
    seek(position: number): Promise<void>;
    /**
     * Resets playback state to initial defaults.
     */
    reset(): void;
    private notifyListeners;
    private hasStateChanged;
}
//# sourceMappingURL=MusicEngine.d.ts.map