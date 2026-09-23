import { BubuProfile, ProfileTriggerType } from './types';

export class ProfileEngine {
  private profiles: Map<string, BubuProfile> = new Map();
  private activeProfileId: string = 'default';
  
  private currentContext: Record<ProfileTriggerType, any> = {
    app_focused: '',
    music_playing: false,
    time_of_day: '12:00',
    workspace_active: ''
  };

  private listeners: Set<(profile: BubuProfile) => void> = new Set();

  constructor() {
    this.registerDefaultProfiles();
  }

  private registerDefaultProfiles() {
    this.profiles.set('default', {
      id: 'default',
      name: 'Default',
      triggerRules: [],
      styleId: 'classic'
    });

    this.profiles.set('coding', {
      id: 'coding',
      name: 'Coding Focus',
      triggerRules: [{ type: 'app_focused', matchValue: 'code' }],
      styleId: 'glass',
      settings: { opacity: 0.5, scale: 0.8, behaviorPreset: 'quiet' }
    });

    this.profiles.set('gaming', {
      id: 'gaming',
      name: 'Gaming Mode',
      triggerRules: [{ type: 'app_focused', matchValue: 'game' }, { type: 'app_focused', matchValue: 'steam' }],
      styleId: 'minimal',
      settings: { opacity: 0.2, scale: 0.6, alwaysOnTop: false, behaviorPreset: 'sleepy' }
    });

    this.profiles.set('music', {
      id: 'music',
      name: 'Music Vibes',
      triggerRules: [{ type: 'music_playing', matchValue: true }],
      styleId: 'neon',
      settings: { behaviorPreset: 'energetic' }
    });
  }

  public updateContext(type: ProfileTriggerType, value: any) {
    this.currentContext[type] = value;
    this.evaluateProfiles();
  }

  private evaluateProfiles() {
    let matchedProfileId = 'default';

    // Reverse order allows priorities (last matched wins, or could sort by priority)
    for (const profile of this.profiles.values()) {
      if (profile.id === 'default') continue;
      
      let allMatch = true;
      for (const rule of profile.triggerRules) {
        if (rule.type === 'app_focused') {
          if (!this.currentContext.app_focused.toLowerCase().includes(String(rule.matchValue).toLowerCase())) {
            allMatch = false;
          }
        }
        if (rule.type === 'music_playing') {
          if (this.currentContext.music_playing !== rule.matchValue) {
            allMatch = false;
          }
        }
      }

      if (allMatch && profile.triggerRules.length > 0) {
        matchedProfileId = profile.id;
        break; // Match found
      }
    }

    if (matchedProfileId !== this.activeProfileId) {
      this.activeProfileId = matchedProfileId;
      const profile = this.profiles.get(this.activeProfileId);
      if (profile) this.notify(profile);
    }
  }

  public getActiveProfile(): BubuProfile {
    return this.profiles.get(this.activeProfileId) || this.profiles.get('default')!;
  }

  public subscribe(listener: (profile: BubuProfile) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(profile: BubuProfile) {
    this.listeners.forEach(fn => fn(profile));
  }
}
