import { create } from 'zustand';

export type Emotion = 
    | 'idle' | 'happy' | 'sad' | 'sleep' | 'run' | 'dance' 
    | 'walk' | 'sit' | 'jump' | 'stretch' | 'think' 
    | 'eat' | 'drink' | 'celebrate' | 'surprised' 
    | 'code' | 'read' | 'study' | 'wave' | 'sing' | 'look around';

interface CharacterState {
    activeSkinUrl: string;
    emotion: Emotion;
    speechText: string | null;
    positionX: number; // 0 to 100 representing screen percentage
    setActiveSkinUrl: (url: string) => void;
    setEmotion: (emotion: Emotion) => void;
    setSpeechText: (text: string | null) => void;
    setPositionX: (x: number) => void;
}

const channel = new BroadcastChannel('bubu_state');

export const useCharacterStore = create<CharacterState>((set) => ({
    activeSkinUrl: '/assets/skins/invader/happy_invader.png',
    emotion: 'idle',
    speechText: null,
    positionX: 50,
    setActiveSkinUrl: (url) => {
        set({ activeSkinUrl: url });
        channel.postMessage({ type: 'SET_SKIN', url });
    },
    setEmotion: (emotion) => {
        set({ emotion });
        channel.postMessage({ type: 'SET_EMOTION', emotion });
    },
    setSpeechText: (text) => {
        set({ speechText: text });
        channel.postMessage({ type: 'SET_SPEECH', text });
    },
    setPositionX: (x) => {
        set({ positionX: x });
        channel.postMessage({ type: 'SET_POSITION_X', x });
    }
}));

channel.onmessage = (event) => {
    if (event.data.type === 'SET_SKIN') {
        useCharacterStore.setState({ activeSkinUrl: event.data.url });
    } else if (event.data.type === 'SET_EMOTION') {
        useCharacterStore.setState({ emotion: event.data.emotion });
    } else if (event.data.type === 'SET_SPEECH') {
        useCharacterStore.setState({ speechText: event.data.text });
    } else if (event.data.type === 'SET_POSITION_X') {
        useCharacterStore.setState({ positionX: event.data.x });
    }
};
