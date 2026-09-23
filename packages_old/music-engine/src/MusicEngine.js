"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicEngine = void 0;
const MusicState_1 = require("./MusicState");
/**
 * Central engine for managing music playback state, dispatching media commands,
 * and coordinating state updates from multiple sources (browser, Spotify, OS media sessions).
 */
class MusicEngine {
    constructor(options) {
        this.stateListeners = new Set();
        this.commandHandler = null;
        this.sourceCommandHandlers = new Map();
        this.state = {
            ...MusicState_1.DEFAULT_MUSIC_STATE,
            ...(options?.initialState || {}),
        };
    }
    /**
     * Returns a copy of the current music state.
     */
    getState() {
        return { ...this.state };
    }
    /**
     * Checks whether music is currently actively playing.
     */
    isPlaying() {
        return this.state.state === 'playing';
    }
    /**
     * Returns current track metadata.
     */
    getCurrentTrack() {
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
    onStateChange(callback) {
        this.stateListeners.add(callback);
        return () => {
            this.stateListeners.delete(callback);
        };
    }
    /**
     * Updates current music state with partial fields.
     * Emits state change event to registered listeners if state has changed.
     */
    updateState(partial, source) {
        const nextSource = source ?? partial.source ?? this.state.source;
        const nextState = {
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
    registerCommandHandler(handler) {
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
    setCommandHandler(handler) {
        this.commandHandler = handler;
    }
    /**
     * Registers a command handler specifically for a given source.
     */
    registerSourceHandler(source, handler) {
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
    async executeCommand(command, value) {
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
        }
        else if (command === 'pause') {
            this.updateState({ state: 'paused' });
        }
        else if (command === 'seek' && typeof value === 'number') {
            this.updateState({ position: Math.max(0, value) });
        }
    }
    /**
     * Resume or start playback.
     */
    async play() {
        await this.executeCommand('play');
    }
    /**
     * Pause playback.
     */
    async pause() {
        await this.executeCommand('pause');
    }
    /**
     * Skip to next track.
     */
    async next() {
        await this.executeCommand('next');
    }
    /**
     * Skip to previous track.
     */
    async previous() {
        await this.executeCommand('previous');
    }
    /**
     * Seek playback to target position in seconds.
     */
    async seek(position) {
        await this.executeCommand('seek', position);
    }
    /**
     * Resets playback state to initial defaults.
     */
    reset() {
        this.updateState(MusicState_1.DEFAULT_MUSIC_STATE);
    }
    notifyListeners() {
        const currentState = this.getState();
        for (const listener of this.stateListeners) {
            try {
                listener(currentState);
            }
            catch (error) {
                console.error('Error in music state change listener:', error);
            }
        }
    }
    hasStateChanged(prev, next) {
        return (prev.state !== next.state ||
            prev.title !== next.title ||
            prev.artist !== next.artist ||
            prev.album !== next.album ||
            prev.duration !== next.duration ||
            prev.position !== next.position ||
            prev.artworkUrl !== next.artworkUrl ||
            prev.source !== next.source);
    }
}
exports.MusicEngine = MusicEngine;
//# sourceMappingURL=MusicEngine.js.map