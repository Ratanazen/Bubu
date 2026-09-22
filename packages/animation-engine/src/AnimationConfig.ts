/**
 * Playback direction for sprite or sequence animation.
 */
export type AnimationDirection = 'normal' | 'reverse' | 'alternate';

/**
 * Anchor/pivot point coordinates for animation alignment (normalized or pixel space).
 */
export interface AnimationAnchor {
  x: number;
  y: number;
}

/**
 * Configuration options for playing a frame-based animation.
 */
export interface AnimationConfig {
  frames: string[];
  fps: number;
  loop: boolean;
  duration?: number;
  scale?: number;
  direction?: 'normal' | 'reverse' | 'alternate';
  anchor?: { x: number; y: number };
}

/**
 * Real-time runtime playback status of the animation player.
 */
export interface AnimationPlayback {
  currentFrame: number;
  isPlaying: boolean;
  elapsed: number;
}

/**
 * Listener invoked whenever the active frame changes.
 */
export type FrameChangeCallback = (frame: string, index: number) => void;

/**
 * Listener invoked when an animation finishes playback (non-looping).
 */
export type AnimationCompleteCallback = () => void;
