import { create } from 'zustand';

export type Emotion = string;

export interface CharacterData {
    id: string;
    name: string;
    emotion: Emotion;
    speechText: string | null;
    x: number;
    y: number;
    personality: 'Playful' | 'Calm' | 'Energetic' | 'Lazy' | 'Focused' | 'Shy';
    energy: number;
    mood: string;
}

interface MultiCharacterState {
    characters: Record<string, CharacterData>;
    updateCharacter: (id: string, updates: Partial<CharacterData>) => void;
    addCharacter: (char: CharacterData) => void;
    removeCharacter: (id: string) => void;
}

const channel = new BroadcastChannel('bubu_multi_state');

export const useCharacterStore = create<MultiCharacterState>((set) => ({
    characters: JSON.parse(localStorage.getItem('bubu_characters') || 'null') || {
        'bubu': { id: 'bubu', name: 'Bubu', emotion: 'idle', speechText: null, x: 100, y: 100, personality: 'Playful', energy: 100, mood: 'Happy' }
    },
    updateCharacter: (id, updates) => {
        set((state) => {
            const next = { ...state.characters, [id]: { ...state.characters[id], ...updates } };
            localStorage.setItem('bubu_characters', JSON.stringify(next));
            channel.postMessage({ type: 'UPDATE', characters: next });
            return { characters: next };
        });
    },
    addCharacter: (char) => {
        set((state) => {
            const next = { ...state.characters, [char.id]: char };
            localStorage.setItem('bubu_characters', JSON.stringify(next));
            channel.postMessage({ type: 'UPDATE', characters: next });
            return { characters: next };
        });
    },
    removeCharacter: (id) => {
        set((state) => {
            const next = { ...state.characters };
            delete next[id];
            localStorage.setItem('bubu_characters', JSON.stringify(next));
            channel.postMessage({ type: 'UPDATE', characters: next });
            return { characters: next };
        });
    }
}));

channel.onmessage = (event) => {
    if (event.data.type === 'UPDATE') {
        useCharacterStore.setState({ characters: event.data.characters });
    }
};
