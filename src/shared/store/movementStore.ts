import { create } from 'zustand';

export type WalkSpeed = 'Slow' | 'Normal' | 'Fast';

export interface PresetLocation {
    id: string;
    name: string;
    x: number;
    y: number;
}

interface MovementState {
    targetPosition: { x: number, y: number } | null;
    walkSpeed: WalkSpeed;
    clickToMove: boolean;
    showTargetMarker: boolean;
    presets: PresetLocation[];
    isSelectingTarget: boolean;
    setTargetPosition: (pos: { x: number, y: number } | null) => void;
    setWalkSpeed: (speed: WalkSpeed) => void;
    setClickToMove: (enabled: boolean) => void;
    setShowTargetMarker: (show: boolean) => void;
    addPreset: (preset: PresetLocation) => void;
    removePreset: (id: string) => void;
    setIsSelectingTarget: (isSelecting: boolean) => void;
}

const channel = new BroadcastChannel('bubu_movement');

export const useMovementStore = create<MovementState>((set) => ({
    targetPosition: null,
    walkSpeed: 'Normal',
    clickToMove: false,
    showTargetMarker: true,
    presets: JSON.parse(localStorage.getItem('bubu_presets') || '[]'),
    isSelectingTarget: false,

    setTargetPosition: (pos) => {
        set({ targetPosition: pos, isSelectingTarget: false });
        channel.postMessage({ type: 'SET_TARGET', pos });
    },
    setWalkSpeed: (speed) => {
        set({ walkSpeed: speed });
        channel.postMessage({ type: 'SET_SPEED', speed });
    },
    setClickToMove: (clickToMove) => {
        set({ clickToMove });
        channel.postMessage({ type: 'SET_CLICK_TO_MOVE', clickToMove });
    },
    setShowTargetMarker: (showTargetMarker) => {
        set({ showTargetMarker });
        channel.postMessage({ type: 'SET_SHOW_MARKER', showTargetMarker });
    },
    addPreset: (preset) => {
        set((state) => {
            const next = [...state.presets, preset];
            localStorage.setItem('bubu_presets', JSON.stringify(next));
            channel.postMessage({ type: 'SET_PRESETS', presets: next });
            return { presets: next };
        });
    },
    removePreset: (id) => {
        set((state) => {
            const next = state.presets.filter(p => p.id !== id);
            localStorage.setItem('bubu_presets', JSON.stringify(next));
            channel.postMessage({ type: 'SET_PRESETS', presets: next });
            return { presets: next };
        });
    },
    setIsSelectingTarget: (isSelectingTarget) => {
        set({ isSelectingTarget });
        channel.postMessage({ type: 'SET_SELECTING', isSelectingTarget });
    }
}));

channel.onmessage = (event) => {
    switch (event.data.type) {
        case 'SET_TARGET': useMovementStore.setState({ targetPosition: event.data.pos, isSelectingTarget: false }); break;
        case 'SET_SPEED': useMovementStore.setState({ walkSpeed: event.data.speed }); break;
        case 'SET_CLICK_TO_MOVE': useMovementStore.setState({ clickToMove: event.data.clickToMove }); break;
        case 'SET_SHOW_MARKER': useMovementStore.setState({ showTargetMarker: event.data.showTargetMarker }); break;
        case 'SET_PRESETS': useMovementStore.setState({ presets: event.data.presets }); break;
        case 'SET_SELECTING': useMovementStore.setState({ isSelectingTarget: event.data.isSelectingTarget }); break;
    }
};
