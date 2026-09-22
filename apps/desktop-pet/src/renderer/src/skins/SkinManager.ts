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
        this.skins.set('default', { id: 'default', name: 'Default Bubu', color: '#ffb7b2' });
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
