import { create } from 'zustand';

interface BehaviorState {
    autonomousEnabled: boolean;
    setAutonomousEnabled: (enabled: boolean) => void;
}

const channel = new BroadcastChannel('bubu_behavior_v2');

export const useBehaviorStore = create<BehaviorState>((set) => ({
    autonomousEnabled: JSON.parse(localStorage.getItem('bubu_auto') || 'false'),
    setAutonomousEnabled: (enabled) => {
        set({ autonomousEnabled: enabled });
        localStorage.setItem('bubu_auto', JSON.stringify(enabled));
        channel.postMessage({ type: 'SET_AUTO', enabled });
    }
}));

channel.onmessage = (event) => {
    if (event.data.type === 'SET_AUTO') {
        useBehaviorStore.setState({ autonomousEnabled: event.data.enabled });
    }
};
