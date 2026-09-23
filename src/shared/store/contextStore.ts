import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';

export interface ActiveWindow {
    app_name: string;
    title: string;
}

interface ContextState {
    activeWindow: ActiveWindow | null;
    currentMode: string;
    pollContext: () => Promise<void>;
}

export const useContextStore = create<ContextState>((set) => ({
    activeWindow: null,
    currentMode: "Default",
    pollContext: async () => {
        try {
            const win = await invoke<ActiveWindow | null>('get_active_window');
            
            let mode = "Default";
            if (win) {
                const app = win.app_name.toLowerCase();
                if (app.includes("code") || app.includes("cursor") || app.includes("jetbrains")) {
                    mode = "Coding Mode";
                } else if (app.includes("alacritty") || app.includes("kitty") || app.includes("terminal")) {
                    mode = "Terminal Mode";
                } else if (app.includes("firefox") || app.includes("chrome") || app.includes("brave")) {
                    mode = "Browser Mode";
                } else if (app.includes("discord") || app.includes("telegram") || app.includes("slack")) {
                    mode = "Communication Mode";
                }
            }

            set({ activeWindow: win, currentMode: mode });
        } catch (e) {
            console.error("Failed to poll context:", e);
        }
    }
}));
