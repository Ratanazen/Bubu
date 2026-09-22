/**
 * Built-in visual style identifiers.
 */
export type BuiltinStyleId =
  | 'cute'
  | 'kawaii'
  | 'pastel'
  | 'soft'
  | 'minimal'
  | 'chibi'
  | 'cartoon'
  | 'pixel'
  | 'retro'
  | 'y2k'
  | 'cyber'
  | 'neon'
  | 'dark'
  | 'sakura'
  | 'winter'
  | 'halloween'
  | 'christmas'
  | 'space'
  | 'ocean'
  | 'forest'
  | 'night'
  | 'sunset'
  | 'monochrome';

/**
 * Style identifier type supporting built-in and custom style IDs.
 */
export type StyleId = BuiltinStyleId | (string & {});

/**
 * Modifiers applied to animations by this style.
 */
export interface StyleAnimationModifiers {
  speedMultiplier?: number;
  scaleMultiplier?: number;
  fpsAdjustment?: number;
  bounceIntensity?: number;
  [key: string]: unknown;
}

/**
 * Visual style definition specifying color scheme, shaders/effects, and animation modifiers.
 */
export interface Style {
  id: StyleId;
  name: string;
  description?: string;
  colors: string[];
  effects: string[];
  animationModifiers: StyleAnimationModifiers | Record<string, unknown>;
}

/**
 * Style preset package including full style metadata.
 */
export interface StylePreset {
  id: string;
  name: string;
  description: string;
  style: Style;
}
