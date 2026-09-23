import {
  BehaviorState,
  PersonalityPreset,
  PERSONALITY_PRESETS,
  StateWeights,
} from './PersonalityPresets';

export interface BehaviorEngineOptions {
  personality?: PersonalityPreset;
  minStateDuration?: number;
  maxStateDuration?: number;
  initialState?: BehaviorState;
}

export type StateChangeListener = (
  state: BehaviorState,
  previousState: BehaviorState
) => void;

/**
 * BehaviorEngine governs the autonomous decision-making and personality-driven
 * state machine of Bubu Desktop Companion.
 */
export class BehaviorEngine {
  private currentState: BehaviorState;
  private currentPreset: PersonalityPreset;
  private baseWeights: StateWeights;
  private activeWeights: StateWeights;

  private minDuration: number;
  private maxDuration: number;
  private stateTimer: number = 0;
  private currentStateDuration: number;

  private isMusicPlaying: boolean = false;
  private isGameMode: boolean = false;

  private isLockedState: boolean = false;
  private lockTimer: number = 0;

  private listeners: Set<StateChangeListener> = new Set();

  constructor(options: BehaviorEngineOptions = {}) {
    this.currentPreset = options.personality ?? 'calm';
    this.minDuration = Math.max(1, options.minStateDuration ?? 3.0);
    this.maxDuration = Math.max(this.minDuration, options.maxStateDuration ?? 7.0);

    this.baseWeights = { ...PERSONALITY_PRESETS[this.currentPreset] };
    this.activeWeights = { ...this.baseWeights };

    this.currentState = options.initialState ?? 'IDLE';
    this.currentStateDuration = this.calculateRandomDuration();
    this.recalculateActiveWeights();
  }

  /**
   * Advances the behavior simulation clock by dt.
   * @param dt Elapsed time in seconds (or milliseconds if dt > 10).
   */
  public update(dt: number): void {
    if (dt <= 0) return;

    // Normalize milliseconds to seconds if caller passes dt in ms (>10)
    const delta = dt > 10 ? dt / 1000 : dt;

    if (this.isLockedState) {
      this.lockTimer -= delta;
      if (this.lockTimer <= 0) {
        this.isLockedState = false;
        this.lockTimer = 0;
        this.transitionToNextState();
      }
      return;
    }

    this.stateTimer += delta;
    if (this.stateTimer >= this.currentStateDuration) {
      this.transitionToNextState();
    }
  }

  /**
   * Returns the current behavior state.
   */
  public getCurrentState(): BehaviorState {
    return this.currentState;
  }

  /**
   * Returns the currently active personality preset name.
   */
  public getPersonality(): PersonalityPreset {
    return this.currentPreset;
  }

  /**
   * Switches to a new personality preset, reloading baseline state weights.
   */
  public setPersonality(preset: PersonalityPreset): void {
    if (!PERSONALITY_PRESETS[preset]) {
      throw new Error(`Unknown personality preset: ${preset}`);
    }
    this.currentPreset = preset;
    this.baseWeights = { ...PERSONALITY_PRESETS[preset] };
    this.recalculateActiveWeights();
  }

  /**
   * Overrides or customizes baseline state transition weights.
   */
  public setWeights(weights: Partial<StateWeights>): void {
    for (const [state, weight] of Object.entries(weights) as [BehaviorState, number][]) {
      if (typeof weight === 'number' && !isNaN(weight) && weight >= 0) {
        this.baseWeights[state] = weight;
      }
    }
    this.recalculateActiveWeights();
  }

  /**
   * Gets the currently computed active state transition weights.
   */
  public getWeights(): StateWeights {
    return { ...this.activeWeights };
  }

  /**
   * Reacts to music playback. When music is playing, increases dance and happy probability.
   */
  public reactToMusic(isPlaying: boolean): void {
    if (this.isMusicPlaying === isPlaying) return;
    this.isMusicPlaying = isPlaying;
    this.recalculateActiveWeights();

    if (isPlaying && !this.isLockedState && !this.isGameMode) {
      // Immediate positive reaction when music starts playing
      const musicStates: BehaviorState[] = ['DANCE', 'HAPPY'];
      const next = musicStates[Math.floor(Math.random() * musicStates.length)];
      this.transitionTo(next, 3.5);
    }
  }

  /**
   * Reacts contextually to the currently focused application.
   */
  public reactToApp(appName: string): void {
    if (this.isGameMode || this.isLockedState) return;

    const lower = appName.toLowerCase();

    // Code editors & terminals: Focus mode, quiet companionship
    if (
      lower.includes('code') ||
      lower.includes('terminal') ||
      lower.includes('bash') ||
      lower.includes('vim') ||
      lower.includes('idea') ||
      lower.includes('studio')
    ) {
      const focusStates: BehaviorState[] = ['SIT', 'LOOK_AROUND', 'IDLE'];
      const next = focusStates[Math.floor(Math.random() * focusStates.length)];
      this.transitionTo(next, 5.0);
    }
    // Media & music players: energetic/happy reaction
    else if (
      lower.includes('spotify') ||
      lower.includes('music') ||
      lower.includes('youtube') ||
      lower.includes('netflix') ||
      lower.includes('vlc')
    ) {
      this.transitionTo('HAPPY', 3.0);
    }
    // Communication apps: curious greeting
    else if (
      lower.includes('discord') ||
      lower.includes('slack') ||
      lower.includes('telegram') ||
      lower.includes('teams')
    ) {
      this.transitionTo('LOOK_AROUND', 3.0);
    }
    // Games: unobtrusive sitting
    else if (lower.includes('game') || lower.includes('steam') || lower.includes('lutris')) {
      this.transitionTo('SIT', 6.0);
    }
  }

  /**
   * Reacts to incoming desktop notifications. Temporarily locks into SURPRISED/LOOK_AROUND state.
   */
  public reactToNotification(): void {
    if (this.isGameMode) return;

    const reactionStates: BehaviorState[] = ['SURPRISED', 'LOOK_AROUND', 'HAPPY'];
    const chosen = reactionStates[Math.floor(Math.random() * reactionStates.length)];
    this.transitionTo(chosen, 2.5, true);
  }

  /**
   * Sets game mode. In game mode, all activities are reduced to minimal (SIT or IDLE).
   */
  public setGameMode(enabled: boolean): void {
    if (this.isGameMode === enabled) return;
    this.isGameMode = enabled;
    this.recalculateActiveWeights();

    if (enabled) {
      this.isLockedState = false;
      this.lockTimer = 0;
      this.transitionTo('SIT', 10.0);
    } else {
      this.transitionToNextState();
    }
  }

  /**
   * Returns true if game mode is currently active.
   */
  public isInGameMode(): boolean {
    return this.isGameMode;
  }

  /**
   * Returns the elapsed time in the current state.
   */
  public getStateTimer(): number {
    return this.stateTimer;
  }

  /**
   * Returns the target duration for the current state.
   */
  public getCurrentStateDuration(): number {
    return this.currentStateDuration;
  }

  /**
   * Registers a callback listener for behavior state transitions.
   * Returns an unsubscribe function.
   */
  public onStateChange(listener: StateChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Selects the next state using weighted random distribution and transitions.
   */
  private transitionToNextState(): void {
    const nextState = this.selectWeightedState();
    this.transitionTo(nextState, this.calculateRandomDuration());
  }

  /**
   * Transitions to a specific state and notifies listeners.
   */
  private transitionTo(
    nextState: BehaviorState,
    duration: number,
    locked: boolean = false
  ): void {
    const prevState = this.currentState;
    this.currentState = nextState;
    this.stateTimer = 0;
    this.currentStateDuration = duration;

    if (locked) {
      this.isLockedState = true;
      this.lockTimer = duration;
    } else {
      this.isLockedState = false;
      this.lockTimer = 0;
    }

    if (prevState !== nextState) {
      for (const listener of this.listeners) {
        try {
          listener(nextState, prevState);
        } catch (err) {
          console.error('Error in BehaviorEngine state change listener:', err);
        }
      }
    }
  }

  /**
   * Weighted random state selection based on active weights.
   */
  private selectWeightedState(): BehaviorState {
    const entries = Object.entries(this.activeWeights) as [BehaviorState, number][];
    const totalWeight = entries.reduce((sum, [, w]) => sum + (w > 0 ? w : 0), 0);

    if (totalWeight <= 0) {
      return 'IDLE';
    }

    let random = Math.random() * totalWeight;
    for (const [state, weight] of entries) {
      if (weight <= 0) continue;
      if (random < weight) {
        return state;
      }
      random -= weight;
    }

    return entries[0][0];
  }

  /**
   * Recomputes active weights based on base weights, music status, and game mode.
   */
  private recalculateActiveWeights(): void {
    if (this.isGameMode) {
      // In game mode: reduce all to minimal. Character quietly idles or sits.
      this.activeWeights = {
        IDLE: 70,
        SIT: 30,
        WALK_LEFT: 0,
        WALK_RIGHT: 0,
        RUN_LEFT: 0,
        RUN_RIGHT: 0,
        SLEEP: 0,
        HAPPY: 0,
        SAD: 0,
        SURPRISED: 0,
        DANCE: 0,
        LOOK_AROUND: 0,
        PLAY: 0,
      };
      return;
    }

    // Clone base weights
    const weights: StateWeights = { ...this.baseWeights };

    // Music reaction: boost DANCE and HAPPY probability
    if (this.isMusicPlaying) {
      weights.DANCE = (weights.DANCE ?? 0) + 40;
      weights.HAPPY = (weights.HAPPY ?? 0) + 30;
      // Slightly reduce sedentary/sleep weights while music is pumping
      weights.SLEEP = Math.max(0, (weights.SLEEP ?? 0) - 20);
      weights.SIT = Math.max(0, (weights.SIT ?? 0) - 10);
    }

    this.activeWeights = weights;
  }

  /**
   * Computes a randomized duration for a state within min/max bounds.
   */
  private calculateRandomDuration(): number {
    return this.minDuration + Math.random() * (this.maxDuration - this.minDuration);
  }
}
