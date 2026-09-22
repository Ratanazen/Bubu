/**
 * StateManager - Central state manager for Bubu Desktop Companion.
 * Provides typed state access, partial slice updates, subscriber notifications,
 * and JSON serialization/deserialization.
 */

export interface PetState {
  visible: boolean;
  paused: boolean;
  x: number;
  y: number;
  state: string;
  direction: 'left' | 'right';
}

export interface MusicState {
  state: 'playing' | 'paused' | 'stopped';
  title: string;
  artist: string;
  album: string;
  position: number;
  duration: number;
  artworkUrl: string;
}

export interface LyricLine {
  time: number;
  text: string;
}

export interface LyricsState {
  available: boolean;
  currentLine: number;
  lines: Array<LyricLine>;
}

export interface BrowserState {
  connected: boolean;
  browserName: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: number;
}

export interface NotificationsState {
  count: number;
  recent: Array<NotificationItem>;
}

export interface BubuState {
  pet: PetState;
  music: MusicState;
  lyrics: LyricsState;
  browser: BrowserState;
  notifications: NotificationsState;
  settings: any; // Will use BubuSettings from shared-types
}

export const DEFAULT_BUBU_STATE: BubuState = {
  pet: {
    visible: true,
    paused: false,
    x: 100,
    y: 100,
    state: 'idle',
    direction: 'right'
  },
  music: {
    state: 'stopped',
    title: '',
    artist: '',
    album: '',
    position: 0,
    duration: 0,
    artworkUrl: ''
  },
  lyrics: {
    available: false,
    currentLine: -1,
    lines: []
  },
  browser: {
    connected: false,
    browserName: ''
  },
  notifications: {
    count: 0,
    recent: []
  },
  settings: {
    alwaysOnTop: true,
    startWithWindows: false,
    petSize: 1,
    movementSpeed: 1,
    animationSpeed: 1,
    behaviorMode: 'normal',
    skin: 'default'
  }
};

export class StateManager {
  private state: BubuState;
  private listeners: Map<string, Set<(value: any) => void>> = new Map();

  constructor(initialState?: Partial<BubuState>) {
    this.state = {
      pet: { ...DEFAULT_BUBU_STATE.pet, ...(initialState?.pet || {}) },
      music: { ...DEFAULT_BUBU_STATE.music, ...(initialState?.music || {}) },
      lyrics: {
        ...DEFAULT_BUBU_STATE.lyrics,
        lines: initialState?.lyrics?.lines
          ? [...initialState.lyrics.lines]
          : [...DEFAULT_BUBU_STATE.lyrics.lines],
        ...(initialState?.lyrics || {})
      },
      browser: { ...DEFAULT_BUBU_STATE.browser, ...(initialState?.browser || {}) },
      notifications: {
        ...DEFAULT_BUBU_STATE.notifications,
        recent: initialState?.notifications?.recent
          ? [...initialState.notifications.recent]
          : [...DEFAULT_BUBU_STATE.notifications.recent],
        ...(initialState?.notifications || {})
      },
      settings: initialState?.settings !== undefined
        ? (typeof initialState.settings === 'object' && initialState.settings !== null
          ? { ...DEFAULT_BUBU_STATE.settings, ...initialState.settings }
          : initialState.settings)
        : { ...DEFAULT_BUBU_STATE.settings }
    };
  }

  /**
   * Returns an immutable snapshot of the entire application state.
   */
  getState(): Readonly<BubuState> {
    return {
      pet: { ...this.state.pet },
      music: { ...this.state.music },
      lyrics: {
        ...this.state.lyrics,
        lines: this.state.lyrics.lines.map((line) => ({ ...line }))
      },
      browser: { ...this.state.browser },
      notifications: {
        ...this.state.notifications,
        recent: this.state.notifications.recent.map((n) => ({ ...n }))
      },
      settings: typeof this.state.settings === 'object' && this.state.settings !== null
        ? { ...this.state.settings }
        : this.state.settings
    };
  }

  /**
   * Retrieves a specific top-level slice of state.
   */
  get<K extends keyof BubuState>(key: K): BubuState[K] {
    const val = this.state[key];
    if (val && typeof val === 'object') {
      if (Array.isArray(val)) {
        return [...val] as unknown as BubuState[K];
      }
      return { ...val };
    }
    return val;
  }

  /**
   * Merges partial updates into a state slice and notifies subscribers.
   */
  update<K extends keyof BubuState>(key: K, value: Partial<BubuState[K]>): void {
    const current = this.state[key];
    if (
      typeof current === 'object' &&
      current !== null &&
      !Array.isArray(current) &&
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value)
    ) {
      this.state[key] = {
        ...current,
        ...value
      };
    } else {
      this.state[key] = value as BubuState[K];
    }

    const updatedValue = this.get(key);

    // Notify listeners for this specific key
    const keyListeners = this.listeners.get(key as string);
    if (keyListeners && keyListeners.size > 0) {
      const snapshot = Array.from(keyListeners);
      for (const handler of snapshot) {
        try {
          handler(updatedValue);
        } catch (error) {
          console.error(`[StateManager] Error in listener for "${String(key)}":`, error);
        }
      }
    }

    // Notify global listeners
    const wildcardListeners = this.listeners.get('*');
    if (wildcardListeners && wildcardListeners.size > 0) {
      const snapshot = Array.from(wildcardListeners);
      for (const handler of snapshot) {
        try {
          handler({ key, value: updatedValue });
        } catch (error) {
          console.error('[StateManager] Error in wildcard listener:', error);
        }
      }
    }
  }

  /**
   * Subscribes to changes on a specific state slice.
   * Returns an unsubscribe function.
   */
  subscribe<K extends keyof BubuState>(key: K, handler: (value: BubuState[K]) => void): () => void {
    if (typeof handler !== 'function') {
      throw new TypeError('Subscriber handler must be a function');
    }

    const keyStr = key as string;
    let set = this.listeners.get(keyStr);
    if (!set) {
      set = new Set();
      this.listeners.set(keyStr, set);
    }

    set.add(handler as (value: any) => void);

    let unsubscribed = false;
    return () => {
      if (unsubscribed) return;
      unsubscribed = true;
      const currentSet = this.listeners.get(keyStr);
      if (currentSet) {
        currentSet.delete(handler as (value: any) => void);
        if (currentSet.size === 0) {
          this.listeners.delete(keyStr);
        }
      }
    };
  }

  /**
   * Serializes current state to a JSON string.
   */
  toJSON(): string {
    return JSON.stringify(this.state, null, 2);
  }

  /**
   * Creates a StateManager instance from a JSON string.
   */
  static fromJSON(json: string): StateManager {
    if (!json || typeof json !== 'string') {
      throw new TypeError('State JSON must be a non-empty string');
    }
    try {
      const parsed = JSON.parse(json);
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Parsed state JSON must be an object');
      }
      return new StateManager(parsed);
    } catch (err) {
      throw new Error(`Failed to create StateManager from JSON: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  /**
   * Resets the state back to defaults.
   */
  reset(): void {
    const keys = Object.keys(DEFAULT_BUBU_STATE) as Array<keyof BubuState>;
    for (const key of keys) {
      this.update(key, DEFAULT_BUBU_STATE[key]);
    }
  }
}

export const globalStateManager = new StateManager();
