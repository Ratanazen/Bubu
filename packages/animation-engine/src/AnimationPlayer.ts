import {
  AnimationConfig,
  AnimationDirection,
  AnimationPlayback,
  FrameChangeCallback,
  AnimationCompleteCallback,
} from './AnimationConfig';

/**
 * AnimationPlayer handles frame-by-frame sprite animation sequence playback,
 * directional cycling, frame-rate control, and completion hooks.
 */
export class AnimationPlayer {
  private config: AnimationConfig | null = null;
  private currentFrameIndex: number = 0;
  private isPlayingState: boolean = false;
  private elapsed: number = 0;
  private frameTimer: number = 0;
  private alternateDirection: 1 | -1 = 1;
  private fps: number = 12;

  private frameListeners: Set<FrameChangeCallback> = new Set();
  private completeListeners: Set<AnimationCompleteCallback> = new Set();

  constructor(config?: AnimationConfig) {
    if (config) {
      this.loadConfig(config);
    }
  }

  /**
   * Loads a new animation configuration.
   */
  public loadConfig(config: AnimationConfig): void {
    this.config = { ...config };
    this.fps = Math.max(1, config.fps || 12);
    this.resetPlaybackState();
  }

  /**
   * Begins or restarts playback with the given configuration or current configuration.
   */
  public play(config?: AnimationConfig): void {
    if (config) {
      this.loadConfig(config);
    } else if (!this.config) {
      return;
    }

    this.isPlayingState = true;

    // Fire initial frame change notification
    const currentFrame = this.getCurrentFrame();
    this.notifyFrameChange(currentFrame, this.currentFrameIndex);
  }

  /**
   * Pauses active playback without resetting the current frame or elapsed timer.
   */
  public pause(): void {
    this.isPlayingState = false;
  }

  /**
   * Resumes playback from the current frame position.
   */
  public resume(): void {
    if (this.config && this.config.frames.length > 0) {
      this.isPlayingState = true;
    }
  }

  /**
   * Stops playback and resets the animation position to the beginning.
   */
  public stop(): void {
    this.isPlayingState = false;
    this.resetPlaybackState();

    const currentFrame = this.getCurrentFrame();
    this.notifyFrameChange(currentFrame, this.currentFrameIndex);
  }

  /**
   * Updates playback by dt time delta.
   * @param dt Elapsed time in seconds (or milliseconds if dt > 10).
   */
  public update(dt: number): void {
    if (!this.isPlayingState || !this.config || this.config.frames.length === 0) {
      return;
    }

    if (dt <= 0) return;

    // Auto-normalize milliseconds to seconds if dt > 10
    const delta = dt > 10 ? dt / 1000 : dt;
    this.elapsed += delta;

    // Check optional fixed duration cutoff
    if (this.config.duration && this.config.duration > 0 && this.elapsed >= this.config.duration) {
      if (this.config.loop) {
        this.elapsed = 0;
      } else {
        this.completeAnimation();
        return;
      }
    }

    const frameDuration = 1 / Math.max(1, this.fps);
    this.frameTimer += delta;

    // Advance frames as needed for accumulated delta
    while (this.frameTimer >= frameDuration && this.isPlayingState) {
      this.frameTimer -= frameDuration;
      const finished = this.advanceFrame();
      if (finished) {
        break;
      }
    }
  }

  /**
   * Returns the file path or URI of the current frame.
   */
  public getCurrentFrame(): string {
    if (!this.config || this.config.frames.length === 0) {
      return '';
    }
    const idx = Math.min(Math.max(0, this.currentFrameIndex), this.config.frames.length - 1);
    return this.config.frames[idx] ?? '';
  }

  /**
   * Returns the current zero-based frame index.
   */
  public getCurrentFrameIndex(): number {
    return this.currentFrameIndex;
  }

  /**
   * Adjusts the playback speed (frames per second).
   */
  public setFPS(fps: number): void {
    if (fps <= 0 || isNaN(fps)) return;
    this.fps = fps;
    if (this.config) {
      this.config.fps = fps;
    }
  }

  /**
   * Returns current frames per second.
   */
  public getFPS(): number {
    return this.fps;
  }

  /**
   * Checks whether the animation is currently playing.
   */
  public isPlaying(): boolean {
    return this.isPlayingState;
  }

  /**
   * Retrieves a snapshot of the current playback status.
   */
  public getPlayback(): AnimationPlayback {
    return {
      currentFrame: this.currentFrameIndex,
      isPlaying: this.isPlayingState,
      elapsed: this.elapsed,
    };
  }

  /**
   * Returns the currently active animation configuration.
   */
  public getConfig(): AnimationConfig | null {
    return this.config ? { ...this.config } : null;
  }

  /**
   * Registers a callback triggered every time the active frame advances.
   */
  public onFrameChange(callback: FrameChangeCallback): () => void {
    this.frameListeners.add(callback);
    return () => {
      this.frameListeners.delete(callback);
    };
  }

  /**
   * Registers a callback triggered when a non-looping animation reaches the end.
   */
  public onComplete(callback: AnimationCompleteCallback): () => void {
    this.completeListeners.add(callback);
    return () => {
      this.completeListeners.delete(callback);
    };
  }

  /**
   * Advances frame according to direction and looping rules.
   * Returns true if animation finished and stopped.
   */
  private advanceFrame(): boolean {
    if (!this.config || this.config.frames.length === 0) {
      return true;
    }

    const totalFrames = this.config.frames.length;
    if (totalFrames <= 1) {
      return false;
    }

    const direction: AnimationDirection = this.config.direction ?? 'normal';
    const isLooping = this.config.loop;
    const prevIndex = this.currentFrameIndex;

    switch (direction) {
      case 'normal': {
        if (this.currentFrameIndex + 1 < totalFrames) {
          this.currentFrameIndex++;
        } else {
          if (isLooping) {
            this.currentFrameIndex = 0;
          } else {
            this.completeAnimation();
            return true;
          }
        }
        break;
      }

      case 'reverse': {
        if (this.currentFrameIndex - 1 >= 0) {
          this.currentFrameIndex--;
        } else {
          if (isLooping) {
            this.currentFrameIndex = totalFrames - 1;
          } else {
            this.completeAnimation();
            return true;
          }
        }
        break;
      }

      case 'alternate': {
        const nextIndex = this.currentFrameIndex + this.alternateDirection;
        if (nextIndex >= totalFrames) {
          this.alternateDirection = -1;
          this.currentFrameIndex = Math.max(0, totalFrames - 2);
        } else if (nextIndex < 0) {
          if (isLooping) {
            this.alternateDirection = 1;
            this.currentFrameIndex = Math.min(1, totalFrames - 1);
          } else {
            this.completeAnimation();
            return true;
          }
        } else {
          this.currentFrameIndex = nextIndex;
        }
        break;
      }
    }

    if (prevIndex !== this.currentFrameIndex) {
      this.notifyFrameChange(this.getCurrentFrame(), this.currentFrameIndex);
    }

    return false;
  }

  /**
   * Completes the animation when non-looping sequence ends.
   */
  private completeAnimation(): void {
    this.isPlayingState = false;
    this.notifyComplete();
  }

  /**
   * Resets frame indices and timers based on the direction setting.
   */
  private resetPlaybackState(): void {
    this.elapsed = 0;
    this.frameTimer = 0;
    this.alternateDirection = 1;

    if (!this.config || this.config.frames.length === 0) {
      this.currentFrameIndex = 0;
      return;
    }

    if (this.config.direction === 'reverse') {
      this.currentFrameIndex = this.config.frames.length - 1;
    } else {
      this.currentFrameIndex = 0;
    }
  }

  /**
   * Notifies all frame change listeners.
   */
  private notifyFrameChange(frame: string, index: number): void {
    for (const listener of this.frameListeners) {
      try {
        listener(frame, index);
      } catch (err) {
        console.error('Error in AnimationPlayer frame change listener:', err);
      }
    }
  }

  /**
   * Notifies all completion listeners.
   */
  private notifyComplete(): void {
    for (const listener of this.completeListeners) {
      try {
        listener();
      } catch (err) {
        console.error('Error in AnimationPlayer complete listener:', err);
      }
    }
  }
}
