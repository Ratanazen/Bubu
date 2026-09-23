import { create } from 'zustand';

interface AIState {
    apiKey: string;
    enabled: boolean;
    setApiKey: (key: string) => void;
    setEnabled: (enabled: boolean) => void;
}

export const useAIStore = create<AIState>((set) => ({
    apiKey: localStorage.getItem('bubu_api_key') || '',
    enabled: localStorage.getItem('bubu_ai_enabled') === 'true',
    setApiKey: (key) => {
        localStorage.setItem('bubu_api_key', key);
        set({ apiKey: key });
    },
    setEnabled: (enabled) => {
        localStorage.setItem('bubu_ai_enabled', enabled.toString());
        set({ enabled });
    }
}));
