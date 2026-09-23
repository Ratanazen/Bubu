import { describe, it, expect, } from 'vitest';

// Mock localStorage and BroadcastChannel
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

class MockBroadcastChannel {
  postMessage() {}
  onmessage() {}
}
Object.defineProperty(globalThis, 'BroadcastChannel', { value: MockBroadcastChannel });

import { useCharacterStore } from '../shared/store/characterStore';
import { useSkinStore } from '../shared/store/skinStore';
import { useRelationshipStore } from '../shared/store/relationshipStore';

describe('Bubu State Machines', () => {
    it('should add and update characters properly', () => {
        const store = useCharacterStore.getState();
        store.addCharacter({ id: 'test', name: 'Test', emotion: 'idle', speechText: null, x: 0, y: 0, personality: 'Playful', energy: 100, mood: 'Happy' });
        expect(useCharacterStore.getState().characters['test']).toBeDefined();
        
        store.updateCharacter('test', { emotion: 'walk' });
        expect(useCharacterStore.getState().characters['test'].emotion).toBe('walk');
    });

    it('should manage relationships between characters', () => {
        const store = useRelationshipStore.getState();
        store.updateRelationship('bubu-test', { level: 'Close Friend', arguments: true, playTogether: true, makeUp: true, follow: true });
        const rel = useRelationshipStore.getState().relationships['bubu-test'];
        expect(rel).toBeDefined();
        expect(rel.level).toBe('Close Friend');
        expect(rel.arguments).toBe(true);
    });

    it('should store and retrieve multi-frame action mappings', () => {
        const store = useSkinStore.getState();
        store.setAction('custom_walk', { fps: 12, frames: [{ url: 'frame1.png' }, { url: 'frame2.png' }] });
        const action = useSkinStore.getState().actions['custom_walk'];
        expect(action.fps).toBe(12);
        expect(action.frames.length).toBe(2);
        expect(action.frames[0].url).toBe('frame1.png');
    });
});
