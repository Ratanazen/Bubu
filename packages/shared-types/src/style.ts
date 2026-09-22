export type BuiltinStyleId =
  | 'classic'
  | 'modern'
  | 'glass'
  | 'cyberpunk'
  | 'kawaii'
  | 'pixel'
  | 'minimal'
  | 'catppuccin'
  | 'vscode'
  | 'macos'
  | 'custom';

export type StyleId = BuiltinStyleId | (string & {});

export interface BubuAvatarAsset {
  file: string;
  type: 'image' | 'gif' | 'webp' | 'png' | 'jpg';
  preview?: string;
  dimensions?: { width: number; height: number };
  frameCount?: number;
}

export interface StyleAnimationModifiers {
  speedMultiplier?: number;
  scaleMultiplier?: number;
  fpsAdjustment?: number;
  bounceIntensity?: number;
  [key: string]: unknown;
}

export interface Style {
  id: StyleId;
  name: string;
  description?: string;
  avatar: BubuAvatarAsset;
  colors?: string[];
  effects?: string[];
  animationModifiers?: StyleAnimationModifiers | Record<string, unknown>;
}

export interface StylePreset {
  id: StyleId;
  name: string;
  style: Style;
}
