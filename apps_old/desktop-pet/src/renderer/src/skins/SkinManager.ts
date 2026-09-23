import { globalEventBus } from '../events/EventBus';

export interface Skin {
    id: string;
    name: string;
    color?: string;
    imageUrl?: string;
}

export class SkinManager {
    private currentSkin: Skin;
    private skins: Map<string, Skin> = new Map();

    constructor() {
        this.skins.set('default', { id: 'default', name: 'Happy Space Invader', imageUrl: '../../assets/skins/invader/happy_invader.png' });
        this.skins.set('happy_invader', { id: 'happy_invader', name: 'Happy Space Invader', imageUrl: '../../assets/skins/invader/happy_invader.png' });
        this.skins.set('sad_invader', { id: 'sad_invader', name: 'Sad Space Invader', imageUrl: '../../assets/skins/invader/sad_invader.png' });
        this.skins.set('invader', { id: 'invader', name: 'Classic Red Invader', imageUrl: '../../assets/skins/invader/invader.png' });
        this.skins.set('lava', { id: 'lava', name: 'Magma Invader', color: '#ff3d00' });
        this.skins.set('ice', { id: 'ice', name: 'Ice Crystal Invader', color: '#a5f3fc' });
        this.skins.set('water', { id: 'water', name: 'Water Aqua Invader', color: '#38bdf8' });
        this.skins.set('grass', { id: 'grass', name: 'Block Craft Invader', color: '#4ade80' });
        this.skins.set('gold', { id: 'gold', name: 'Golden Sun Invader', color: '#facc15' });
        this.skins.set('galaxy', { id: 'galaxy', name: 'Cosmic Galaxy Invader', color: '#c084fc' });
        this.skins.set('rainbow', { id: 'rainbow', name: 'Pride Rainbow Invader', color: '#f43f5e' });
        this.skins.set('robot', { id: 'robot', name: 'Mecha Robot Invader', color: '#94a3b8' });
        this.skins.set('ninja', { id: 'ninja', name: 'Stealth Ninja Invader', color: '#334155' });
        this.skins.set('pirate', { id: 'pirate', name: 'Pirate Captain Invader', color: '#78350f' });
        this.skins.set('night', { id: 'night', name: 'Night Bubu', color: '#4a4e69' });
        this.skins.set('sakura', { id: 'sakura', name: 'Sakura Bubu', color: '#ffc8dd' });
        this.skins.set('retro', { id: 'retro', name: 'Retro Bubu', imageUrl: '../../assets/skins/retro/retro.png' });
        
        this.currentSkin = this.skins.get('default')!;
    }

    async initialize() {
        const settings = await window.electronAPI.getSettings();
        if (settings.skin && this.skins.has(settings.skin)) {
            this.loadSkin(settings.skin);
        }
    }

    loadSkin(id: string) {
        if (this.skins.has(id)) {
            this.currentSkin = this.skins.get(id)!;
            globalEventBus.emit('SKIN_CHANGED', this.currentSkin);
        }
    }

    getCurrentSkin() {
        return this.currentSkin;
    }

    listSkins() {
        return Array.from(this.skins.values());
    }
}
