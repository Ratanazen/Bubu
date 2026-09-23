export interface BubuProfile {
  id: string;
  name: string;
  triggerRules: ProfileTriggerRule[];
  styleId?: string;
  avatarUrl?: string;
  settings?: {
    opacity?: number;
    scale?: number;
    anchor?: string;
    alwaysOnTop?: boolean;
    behaviorPreset?: string;
  };
}

export type ProfileTriggerType = 'app_focused' | 'music_playing' | 'time_of_day' | 'workspace_active';

export interface ProfileTriggerRule {
  type: ProfileTriggerType;
  matchValue: string | boolean | { start: string; end: string }; // e.g. "code", true, {start: "09:00", end: "17:00"}
}
