import type { CharacterState } from './character';
import type { AnimationConfig } from './animation';

/**
 * Skin definition defining character appearance, animation maps, and color palette.
 */
export interface Skin {
  id: string;
  name: string;
  description?: string;
  style: string;
  characterId: string;
  animations: Partial<Record<CharacterState, AnimationConfig>>;
  colors?: Record<string, string> | string[];
  metadata?: Record<string, unknown>;
}

/**
 * Manifest file format for distributed skin packages.
 */
export interface SkinManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  animations: Partial<Record<CharacterState, AnimationConfig>> | Record<string, AnimationConfig>;
  style?: string;
  characterId?: string;
  colors?: Record<string, string> | string[];
  preview?: string;
  metadata?: Record<string, unknown>;
}
