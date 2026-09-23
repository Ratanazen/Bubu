/**
 * Character state definitions representing animation and activity states of Bubu.
 */
export enum CharacterState {
  IDLE = 'IDLE',
  WALK_LEFT = 'WALK_LEFT',
  WALK_RIGHT = 'WALK_RIGHT',
  RUN_LEFT = 'RUN_LEFT',
  RUN_RIGHT = 'RUN_RIGHT',
  SLEEP = 'SLEEP',
  WAKE = 'WAKE',
  SIT = 'SIT',
  HAPPY = 'HAPPY',
  SAD = 'SAD',
  SURPRISED = 'SURPRISED',
  DANCE = 'DANCE',
  MUSIC = 'MUSIC',
  NOTIFICATION = 'NOTIFICATION',
  DRAG = 'DRAG',
  LOOK_AROUND = 'LOOK_AROUND',
  PLAY = 'PLAY',
  CUSTOM = 'CUSTOM',
}

/**
 * Character asset file descriptor and metadata.
 */
export interface CharacterAsset {
  id: string;
  name: string;
  imagePath: string;
  originalPath?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Visual customization configuration for character appearance.
 */
export interface CharacterCustomization {
  body?: string;
  face?: string;
  eyes?: string;
  mouth?: string;
  colors?: Record<string, string>;
  accessories?: string[];
  clothes?: string;
  hat?: string;
  shoes?: string;
  effects?: string[];
}
