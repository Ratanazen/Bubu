import { create } from 'zustand';

export interface RelationshipConfig {
    level: 'Stranger' | 'Acquaintance' | 'Friend' | 'Close Friend' | 'Best Friend' | 'Loving' | 'Annoyed';
    playTogether: boolean;
    arguments: boolean;
    makeUp: boolean;
    follow: boolean;
}

interface RelationshipState {
    relationships: Record<string, RelationshipConfig>; // e.g. "bubu-bibi": config
    updateRelationship: (pairId: string, config: Partial<RelationshipConfig>) => void;
}

const channel = new BroadcastChannel('bubu_relationships');

export const useRelationshipStore = create<RelationshipState>((set) => ({
    relationships: JSON.parse(localStorage.getItem('bubu_rels') || 'null') || {
        'bubu-bibi': { level: 'Close Friend', playTogether: true, arguments: true, makeUp: true, follow: true }
    },
    updateRelationship: (pairId, config) => {
        set((state) => {
            const current = state.relationships[pairId] || { level: 'Close Friend', playTogether: true, arguments: true, makeUp: true, follow: true };
            const next = { ...state.relationships, [pairId]: { ...current, ...config } };
            localStorage.setItem('bubu_rels', JSON.stringify(next));
            channel.postMessage({ type: 'UPDATE', relationships: next });
            return { relationships: next };
        });
    }
}));

channel.onmessage = (event) => {
    if (event.data.type === 'UPDATE') {
        useRelationshipStore.setState({ relationships: event.data.relationships });
    }
};
