import type { CharacterState } from './character';

/**
 * Character personality presets that bias behavioral decision-making and states.
 */
export type PersonalityPreset =
  | 'calm'
  | 'cute'
  | 'energetic'
  | 'sleepy'
  | 'playful'
  | 'focus'
  | 'shy'
  | 'curious';

/**
 * Behavior engine configuration mapping character states to transition weights.
 */
export interface BehaviorConfig {
  weights: Record<CharacterState, number>;
  personality: PersonalityPreset;
}

/**
 * User-configurable sliders and tunables for autonomous pet behaviors (all values 0-1).
 */
export interface BehaviorSettings {
  movementSpeed: number;
  animationSpeed: number;
  activityLevel: number;
  sleepFrequency: number;
  reactionFrequency: number;
  notificationReaction: number;
  musicReaction: number;
  appReaction: number;
}
