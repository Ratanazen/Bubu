import { create } from 'zustand';

export type Personality = 'Random' | 'Energetic' | 'Lazy' | 'Focused' | 'Playful';

interface BehaviorState {
    autonomousEnabled: boolean;
    personality: Personality;
    energy: number;
    mood: string;
    setAutonomousEnabled: (enabled: boolean) => void;
    setPersonality: (p: Personality) => void;
    setEnergy: (energy: number) => void;
    setMood: (mood: string) => void;
}

const channel = new BroadcastChannel('bubu_behavior');

export const useBehaviorStore = create<BehaviorState>((set) => ({
    autonomousEnabled: localStorage.getItem('bubu_autonomous') === 'true',
    personality: (localStorage.getItem('bubu_personality') as Personality) || 'Random',
    energy: 100,
    mood: 'Calm',
    setAutonomousEnabled: (enabled) => {
        localStorage.setItem('bubu_autonomous', enabled.toString());
        set({ autonomousEnabled: enabled });
        channel.postMessage({ type: 'SYNC', state: { autonomousEnabled: enabled } });
    },
    setPersonality: (p) => {
        localStorage.setItem('bubu_personality', p);
        set({ personality: p });
        channel.postMessage({ type: 'SYNC', state: { personality: p } });
    },
    setEnergy: (energy) => {
        const clamped = Math.max(0, Math.min(100, energy));
        set({ energy: clamped });
        channel.postMessage({ type: 'SYNC', state: { energy: clamped } });
    },
    setMood: (mood) => {
        set({ mood });
        channel.postMessage({ type: 'SYNC', state: { mood } });
    }
}));

channel.onmessage = (event) => {
    if (event.data.type === 'SYNC') {
        useBehaviorStore.setState(event.data.state);
    }
};
