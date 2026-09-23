/**
 * Playback direction for sprite or sequence animation.
 */
export type AnimationDirection = 'normal' | 'reverse' | 'alternate';

/**
 * Anchor/pivot point coordinates for animation alignment.
 */
export interface AnimationAnchor {
  x: number;
  y: number;
}

/**
 * Configuration for a single character animation sequence.
 */
export interface AnimationConfig {
  frames: string[];
  fps: number;
  loop: boolean;
  duration?: number;
  scale?: number;
  direction?: AnimationDirection;
  anchor?: AnimationAnchor;
}

/**
 * Real-time runtime playback state of an active animation.
 */
export interface AnimationPlayback {
  currentFrame: number;
  isPlaying: boolean;
  isLooping: boolean;
  elapsed: number;
}
