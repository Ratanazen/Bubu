import { create } from 'zustand';

interface CharacterState {
    activeSkinUrl: string;
    setActiveSkinUrl: (url: string) => void;
}

const channel = new BroadcastChannel('bubu_state');

export const useCharacterStore = create<CharacterState>((set) => ({
    activeSkinUrl: '/assets/skins/invader/happy_invader.png',
    setActiveSkinUrl: (url) => {
        set({ activeSkinUrl: url });
        channel.postMessage({ type: 'SET_SKIN', url });
    },
}));

channel.onmessage = (event) => {
    if (event.data.type === 'SET_SKIN') {
        useCharacterStore.setState({ activeSkinUrl: event.data.url });
    }
};
