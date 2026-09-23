/**
 * Behavior states supported by Bubu character animation and behavior systems.
 */
export type BehaviorState =
  | 'IDLE'
  | 'WALK_LEFT'
  | 'WALK_RIGHT'
  | 'RUN_LEFT'
  | 'RUN_RIGHT'
  | 'SLEEP'
  | 'SIT'
  | 'HAPPY'
  | 'SAD'
  | 'SURPRISED'
  | 'DANCE'
  | 'LOOK_AROUND'
  | 'PLAY';

/**
 * Supported personality preset identifiers.
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
 * Weight distribution across all behavior states.
 */
export type StateWeights = Record<BehaviorState, number>;

/**
 * Default state weight distributions for each personality preset.
 * Values represent relative weights for stochastic state transitions.
 */
export const PERSONALITY_PRESETS: Record<PersonalityPreset, StateWeights> = {
  // calm: high idle/sit/sleep, low dance/run
  calm: {
    IDLE: 30,
    SIT: 25,
    SLEEP: 20,
    LOOK_AROUND: 10,
    WALK_LEFT: 5,
    WALK_RIGHT: 5,
    HAPPY: 3,
    PLAY: 1,
    DANCE: 1,
    RUN_LEFT: 0,
    RUN_RIGHT: 0,
    SAD: 0,
    SURPRISED: 0,
  },

  // cute: high happy/look_around, medium walk
  cute: {
    HAPPY: 30,
    LOOK_AROUND: 25,
    WALK_LEFT: 12,
    WALK_RIGHT: 12,
    IDLE: 10,
    SIT: 5,
    PLAY: 4,
    DANCE: 2,
    SLEEP: 0,
    RUN_LEFT: 0,
    RUN_RIGHT: 0,
    SAD: 0,
    SURPRISED: 0,
  },

  // energetic: high dance/run/walk, low sleep
  energetic: {
    DANCE: 25,
    RUN_LEFT: 15,
    RUN_RIGHT: 15,
    WALK_LEFT: 15,
    WALK_RIGHT: 15,
    PLAY: 10,
    HAPPY: 5,
    IDLE: 3,
    LOOK_AROUND: 2,
    SIT: 0,
    SLEEP: 0,
    SAD: 0,
    SURPRISED: 0,
  },

  // sleepy: very high sleep/sit, very low everything else
  sleepy: {
    SLEEP: 60,
    SIT: 25,
    IDLE: 10,
    LOOK_AROUND: 3,
    WALK_LEFT: 1,
    WALK_RIGHT: 1,
    HAPPY: 0,
    SAD: 0,
    SURPRISED: 0,
    DANCE: 0,
    PLAY: 0,
    RUN_LEFT: 0,
    RUN_RIGHT: 0,
  },

  // playful: high dance/play/happy/run
  playful: {
    PLAY: 30,
    DANCE: 25,
    HAPPY: 20,
    RUN_LEFT: 8,
    RUN_RIGHT: 8,
    WALK_LEFT: 4,
    WALK_RIGHT: 4,
    LOOK_AROUND: 1,
    IDLE: 0,
    SIT: 0,
    SLEEP: 0,
    SAD: 0,
    SURPRISED: 0,
  },

  // focus: very high idle/sit, minimal everything
  focus: {
    IDLE: 55,
    SIT: 40,
    LOOK_AROUND: 3,
    SLEEP: 2,
    WALK_LEFT: 0,
    WALK_RIGHT: 0,
    RUN_LEFT: 0,
    RUN_RIGHT: 0,
    HAPPY: 0,
    SAD: 0,
    SURPRISED: 0,
    DANCE: 0,
    PLAY: 0,
  },

  // shy: high idle/look_around, low everything else
  shy: {
    IDLE: 45,
    LOOK_AROUND: 35,
    SIT: 10,
    WALK_LEFT: 4,
    WALK_RIGHT: 4,
    SLEEP: 1,
    HAPPY: 1,
    PLAY: 0,
    DANCE: 0,
    RUN_LEFT: 0,
    RUN_RIGHT: 0,
    SAD: 0,
    SURPRISED: 0,
  },

  // curious: high walk/look_around/run, medium sit
  curious: {
    LOOK_AROUND: 30,
    WALK_LEFT: 18,
    WALK_RIGHT: 18,
    RUN_LEFT: 10,
    RUN_RIGHT: 10,
    SIT: 10,
    IDLE: 4,
    HAPPY: 0,
    PLAY: 0,
    DANCE: 0,
    SLEEP: 0,
    SAD: 0,
    SURPRISED: 0,
  },
};
