import { getPlaceholderSVG } from '../pet/PlaceholderAsset';
import { globalEventBus } from '../events/EventBus';
import { Skin } from '../skins/SkinManager';

export class AnimationController {
    element: HTMLElement;
    state: string = 'IDLE';
    skin: Skin = { id: 'default', name: 'Default Bubu', color: '#ffb7b2' };

    constructor(element: HTMLElement) {
        this.element = element;
        globalEventBus.subscribe('SKIN_CHANGED', (event) => {
            this.skin = event.payload;
        });
    }

    setState(state: string) {
        this.state = state;
    }

    update(dt: number, direction: 'left' | 'right') {
        this.element.innerHTML = getPlaceholderSVG(this.state, this.skin);
        this.element.style.transform = direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)';
    }
}
