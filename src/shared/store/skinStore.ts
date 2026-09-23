import { create } from 'zustand';

export type ActionName = string; // e.g. 'idle', 'walk', 'run', 'code', 'drink'

export interface ActionFrame {
    url: string;
}

export interface ActionMapping {
    fps: number;
    frames: ActionFrame[];
}

interface SkinState {
    actions: Record<ActionName, ActionMapping>;
    setAction: (action: ActionName, mapping: ActionMapping) => void;
    deleteAction: (action: ActionName) => void;
}

const channel = new BroadcastChannel('bubu_skin');

// We pre-populate some fallbacks pointing to the default invader
const defaultActions = {
    idle: { fps: 1, frames: [{ url: '/assets/skins/invader/happy_invader.png' }] },
    happy: { fps: 1, frames: [{ url: '/assets/skins/invader/happy_invader.png' }] },
    sad: { fps: 1, frames: [{ url: '/assets/skins/invader/sad_invader.png' }] },
    sleep: { fps: 1, frames: [{ url: '/assets/skins/invader/invader.png' }] },
};

export const useSkinStore = create<SkinState>((set) => ({
    actions: JSON.parse(localStorage.getItem('bubu_custom_actions') || 'null') || defaultActions,
    setAction: (action, mapping) => {
        set((state) => {
            const next = { ...state.actions, [action]: mapping };
            localStorage.setItem('bubu_custom_actions', JSON.stringify(next));
            channel.postMessage({ type: 'UPDATE_ACTIONS', actions: next });
            return { actions: next };
        });
    },
    deleteAction: (action) => {
        set((state) => {
            const next = { ...state.actions };
            delete next[action];
            localStorage.setItem('bubu_custom_actions', JSON.stringify(next));
            channel.postMessage({ type: 'UPDATE_ACTIONS', actions: next });
            return { actions: next };
        });
    }
}));

channel.onmessage = (event) => {
    if (event.data.type === 'UPDATE_ACTIONS') {
        useSkinStore.setState({ actions: event.data.actions });
    }
};
