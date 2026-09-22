/**
 * Playback direction for sprite or sequence animation.
 */
export type AnimationDirection = 'normal' | 'reverse' | 'alternate';

/**
 * Anchor alignment preset for consistent canvas positioning.
 */
export type AnchorPreset = 'center' | 'bottom-center' | 'top-center' | 'bottom-left' | 'bottom-right' | 'custom';

/**
 * Anchor/pivot point coordinates for animation alignment (normalized or pixel space).
 */
export interface AnimationAnchor {
  x: number;
  y: number;
}

/**
 * Individual frame item with image data/asset path and optional per-frame duration.
 */
export interface AnimationImageFrame {
  id: string;
  asset: string;       // Image URL, Base64, or file path
  name?: string;
  duration?: number;   // Specific duration in ms (if omitted, calculated from 1000/fps)
}

/**
 * Comprehensive configuration options for playing a frame-based animation.
 */
export interface AnimationConfig {
  id?: string;
  name?: string;
  state?: string;      // IDLE, WALK, RUN, SLEEP, DANCE, etc.
  frames: string[] | AnimationImageFrame[];
  fps: number;
  loop: boolean;
  duration?: number;
  scale?: number;
  direction?: AnimationDirection;
  anchor?: AnimationAnchor;
  anchorPreset?: AnchorPreset;
  canvas?: {
    width: number;
    height: number;
  };
  soundUrl?: string;
}

/**
 * Real-time runtime playback status of the animation player.
 */
export interface AnimationPlayback {
  currentFrame: number;
  currentFrameAsset: string;
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
