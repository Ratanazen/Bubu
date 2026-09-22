import {
  DEFAULT_MUSIC_STATE,
  MusicCommand,
  MusicPlaybackState,
  MusicSource,
  MusicState,
  TrackInfo,
} from './MusicState';

/**
 * Callback invoked when music playback state changes.
 */
export type StateChangeCallback = (state: MusicState) => void;

/**
 * Handler invoked when a media command needs to be executed by a platform/source.
 */
export type MusicCommandHandler = (
  command: MusicCommand,
  value?: number
) => void | Promise<void>;

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
export class MusicEngine {
  private state: MusicState;
  private readonly stateListeners: Set<StateChangeCallback> = new Set();
  private commandHandler: MusicCommandHandler | null = null;
  private readonly sourceCommandHandlers: Map<MusicSource, MusicCommandHandler> = new Map();

  constructor(options?: MusicEngineOptions) {
    this.state = {
      ...DEFAULT_MUSIC_STATE,
      ...(options?.initialState || {}),
    };
  }

  /**
   * Returns a copy of the current music state.
   */
  public getState(): MusicState {
    return { ...this.state };
  }

  /**
   * Checks whether music is currently actively playing.
   */
  public isPlaying(): boolean {
    return this.state.state === 'playing';
  }

  /**
   * Returns current track metadata.
   */
  public getCurrentTrack(): TrackInfo {
    return {
      title: this.state.title,
      artist: this.state.artist,
      album: this.state.album,
      artworkUrl: this.state.artworkUrl,
      duration: this.state.duration,
    };
  }

  /**
   * Subscribes a listener to music state changes.
   * Returns an unsubscribe function to remove the listener.
   */
  public onStateChange(callback: StateChangeCallback): () => void {
    this.stateListeners.add(callback);
    return () => {
      this.stateListeners.delete(callback);
    };
  }

  /**
   * Updates current music state with partial fields.
   * Emits state change event to registered listeners if state has changed.
   */
  public updateState(partial: Partial<MusicState>, source?: MusicSource): MusicState {
    const nextSource = source ?? partial.source ?? this.state.source;
    const nextState: MusicState = {
      ...this.state,
      ...partial,
      source: nextSource,
    };

    if (this.hasStateChanged(this.state, nextState)) {
      this.state = nextState;
      this.notifyListeners();
    }

    return this.getState();
  }

  /**
   * Registers a default handler for media commands.
   * Returns an unregister function.
   */
  public registerCommandHandler(handler: MusicCommandHandler): () => void {
    this.commandHandler = handler;
    return () => {
      if (this.commandHandler === handler) {
        this.commandHandler = null;
      }
    };
  }

  /**
   * Sets or clears the active command handler.
   */
  public setCommandHandler(handler: MusicCommandHandler | null): void {
    this.commandHandler = handler;
  }

  /**
   * Registers a command handler specifically for a given source.
   */
  public registerSourceHandler(source: MusicSource, handler: MusicCommandHandler): () => void {
    this.sourceCommandHandlers.set(source, handler);
    return () => {
      if (this.sourceCommandHandlers.get(source) === handler) {
        this.sourceCommandHandlers.delete(source);
      }
    };
  }

  /**
   * Executes a media command by dispatching to source-specific or default handler.
   */
  public async executeCommand(command: MusicCommand, value?: number): Promise<void> {
    const sourceHandler = this.sourceCommandHandlers.get(this.state.source);
    if (sourceHandler) {
      await sourceHandler(command, value);
      return;
    }

    if (this.commandHandler) {
      await this.commandHandler(command, value);
      return;
    }

    // Fallback: If no handler is registered, update local state where appropriate
    if (command === 'play') {
      this.updateState({ state: 'playing' });
    } else if (command === 'pause') {
      this.updateState({ state: 'paused' });
    } else if (command === 'seek' && typeof value === 'number') {
      this.updateState({ position: Math.max(0, value) });
    }
  }

  /**
   * Resume or start playback.
   */
  public async play(): Promise<void> {
    await this.executeCommand('play');
  }

  /**
   * Pause playback.
   */
  public async pause(): Promise<void> {
    await this.executeCommand('pause');
  }

  /**
   * Skip to next track.
   */
  public async next(): Promise<void> {
    await this.executeCommand('next');
  }

  /**
   * Skip to previous track.
   */
  public async previous(): Promise<void> {
    await this.executeCommand('previous');
  }

  /**
   * Seek playback to target position in seconds.
   */
  public async seek(position: number): Promise<void> {
    await this.executeCommand('seek', position);
  }

  /**
   * Resets playback state to initial defaults.
   */
  public reset(): void {
    this.updateState(DEFAULT_MUSIC_STATE);
  }

  private notifyListeners(): void {
    const currentState = this.getState();
    for (const listener of this.stateListeners) {
      try {
        listener(currentState);
      } catch (error) {
        console.error('Error in music state change listener:', error);
      }
    }
  }

  private hasStateChanged(prev: MusicState, next: MusicState): boolean {
    return (
      prev.state !== next.state ||
      prev.title !== next.title ||
      prev.artist !== next.artist ||
      prev.album !== next.album ||
      prev.duration !== next.duration ||
      prev.position !== next.position ||
      prev.artworkUrl !== next.artworkUrl ||
      prev.source !== next.source
    );
  }
}
