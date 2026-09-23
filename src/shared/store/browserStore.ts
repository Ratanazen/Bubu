import { create } from 'zustand';
import { listen } from '@tauri-apps/api/event';

export interface BrowserPayload {
    url?: string;
    title?: string;
    timestamp?: number;
}

interface BrowserState {
    latestPayload: BrowserPayload | null;
}

export const useBrowserStore = create<BrowserState>((set) => {
    // Listen to Tauri events emitted from the Rust WebSocket server
    listen<BrowserPayload>('browser-data', (event) => {
        set({ latestPayload: event.payload });
    });

    return {
        latestPayload: null
    };
});
