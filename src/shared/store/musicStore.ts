import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';

export interface MediaInfo {
    playing: boolean;
    title: string;
    artist: string;
    album: string;
}

interface MusicState {
    media: MediaInfo | null;
    reactionLevel: "Off" | "Low" | "Normal" | "High";
    setReactionLevel: (level: "Off" | "Low" | "Normal" | "High") => void;
    pollMedia: () => Promise<void>;
}

export const useMusicStore = create<MusicState>((set) => ({
    media: null,
    reactionLevel: "Normal",
    setReactionLevel: (level) => set({ reactionLevel: level }),
    pollMedia: async () => {
        try {
            const media = await invoke<MediaInfo | null>('get_current_media');
            set({ media });
        } catch (e) {
            console.error("Failed to poll media:", e);
        }
    }
}));
