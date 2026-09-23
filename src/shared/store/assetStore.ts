import { create } from 'zustand';

export interface BubuAsset {
    id: string;
    name: string;
    dataUrl: string; // Base64 image
    width: number;
    height: number;
    timestamp: number;
}

interface AssetState {
    assets: Record<string, BubuAsset>;
    addAsset: (asset: BubuAsset) => void;
    removeAsset: (id: string) => void;
}

export const useAssetStore = create<AssetState>((set) => ({
    assets: JSON.parse(localStorage.getItem('bubu_assets') || '{}'),
    addAsset: (asset) => {
        set((state) => {
            const next = { ...state.assets, [asset.id]: asset };
            try {
                localStorage.setItem('bubu_assets', JSON.stringify(next));
            } catch (e) {
                console.error("Storage full! Cannot save asset.");
            }
            return { assets: next };
        });
    },
    removeAsset: (id) => {
        set((state) => {
            const next = { ...state.assets };
            delete next[id];
            localStorage.setItem('bubu_assets', JSON.stringify(next));
            return { assets: next };
        });
    }
}));
