import { Bubu } from '../pet/Bubu';
import { globalEventBus } from '../events/EventBus';

export class BehaviorEngine {
    pet: Bubu;
    timer: number = 2000;
    private isMusicPlaying = false;

    constructor(pet: Bubu) {
        this.pet = pet;

        globalEventBus.subscribe('MUSIC_STARTED', () => {
            this.isMusicPlaying = true;
            this.pet.setState('SURPRISED');
            setTimeout(() => { if (this.pet.state === 'SURPRISED') this.pet.setState('DANCE'); }, 1000);
            this.timer = 5000;
        });

        globalEventBus.subscribe('MUSIC_PAUSED', () => {
            this.isMusicPlaying = false;
            this.pet.setState('IDLE');
        });
        
        globalEventBus.subscribe('MUSIC_STOPPED', () => {
            this.isMusicPlaying = false;
            this.pet.setState('IDLE');
        });

        globalEventBus.subscribe('APP_FOCUSED', (event) => {
            if (!this.pet.isPaused) {
                this.pet.setState('LOOK_AROUND');
                globalEventBus.emit('NOTIFICATION_RECEIVED', { title: 'App Focus', message: `Noticed you looking at ${event.payload}`});
                this.timer = 3000;
            }
        });
    }

    update(dt: number) {
        if (this.pet.state === 'DRAGGED' || this.pet.state === 'SURPRISED' || this.pet.state === 'HAPPY' || this.pet.isPaused) return;

        this.timer -= dt;
        if (this.timer <= 0) {
            this.chooseNextBehavior();
        }
    }

    chooseNextBehavior() {
        const r = Math.random();
        
        if (this.isMusicPlaying) {
            if (r < 0.7) this.pet.setState('DANCE');
            else if (r < 0.8) this.pet.setState('HAPPY');
            else this.pet.setState('IDLE');
            this.timer = 3000 + Math.random() * 2000;
            return;
        }

        if (r < 0.3) {
            this.pet.setState('IDLE');
            this.timer = 3000 + Math.random() * 2000;
        } else if (r < 0.5) {
            this.pet.setState('WALK_LEFT');
            this.timer = 2000 + Math.random() * 3000;
        } else if (r < 0.7) {
            this.pet.setState('WALK_RIGHT');
            this.timer = 2000 + Math.random() * 3000;
        } else if (r < 0.8) {
            this.pet.setState('SIT');
            this.timer = 4000;
        } else if (r < 0.9) {
            this.pet.setState('SLEEP');
            this.timer = 10000 + Math.random() * 5000;
        } else {
            this.pet.setState('LOOK_AROUND');
            this.timer = 2000;
        }
    }
}
