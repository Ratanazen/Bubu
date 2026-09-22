import { getPlaceholderSVG } from '../pet/PlaceholderAsset';
import { globalEventBus } from '../events/EventBus';
import { Skin } from '../skins/SkinManager';

interface CustomFrame {
  name: string;
  duration: number;
}

interface CustomAnimationManifest {
  state: string;
  fps: number;
  loop: boolean;
  scale?: number;
  frames: CustomFrame[];
}

export class AnimationController {
  element: HTMLElement;
  state: string = 'IDLE';
  skin: Skin = { id: 'default', name: 'Default Bubu', color: '#ffb7b2' };

  private customAnimations: Map<string, CustomAnimationManifest> = new Map();
  private currentFrameIndex: number = 0;
  private frameTimer: number = 0;

  constructor(element: HTMLElement) {
    this.element = element;
    globalEventBus.subscribe('SKIN_CHANGED', (event) => {
      this.skin = event.payload;
    });

    this.loadCustomAnimations();
  }

  private loadCustomAnimations(): void {
    const states = ['IDLE', 'WALK', 'RUN', 'SLEEP', 'DANCE', 'HAPPY', 'SAD', 'SURPRISED', 'PET'];
    states.forEach(st => {
      try {
        const stored = localStorage.getItem(`bubu-anim-${st}`);
        if (stored) {
          this.customAnimations.set(st, JSON.parse(stored));
        }
      } catch {
        // ignore
      }
    });
  }

  public registerAnimation(manifest: CustomAnimationManifest): void {
    this.customAnimations.set(manifest.state, manifest);
  }

  public setState(state: string): void {
    if (this.state !== state) {
      this.state = state;
      this.currentFrameIndex = 0;
      this.frameTimer = 0;
    }
  }

  public update(dt: number, direction: 'left' | 'right'): void {
    const customAnim = this.customAnimations.get(this.state);

    if (customAnim && customAnim.frames.length > 0) {
      // Step through user-created image animation frames
      const currentFrameObj = customAnim.frames[this.currentFrameIndex] || customAnim.frames[0];
      const frameDuration = (currentFrameObj.duration || (1000 / (customAnim.fps || 8))) / 1000;

      this.frameTimer += (dt > 10 ? dt / 1000 : dt);
      if (this.frameTimer >= frameDuration) {
        this.frameTimer -= frameDuration;
        this.currentFrameIndex = (this.currentFrameIndex + 1) % customAnim.frames.length;
      }

      const frameName = currentFrameObj.name;
      this.element.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; align-items: flex-end; justify-content: center;">
          <img
            src="/assets/characters/bubu-reference.png"
            alt="${frameName}"
            style="max-width: 85%; max-height: 85%; object-fit: contain; image-rendering: pixelated; transform: ${direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)'};"
          />
        </div>
      `;
    } else {
      // Fallback to SVG / Procedural skin renderer
      this.element.innerHTML = getPlaceholderSVG(this.state, this.skin);
      this.element.style.transform = direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)';
    }
  }
}
