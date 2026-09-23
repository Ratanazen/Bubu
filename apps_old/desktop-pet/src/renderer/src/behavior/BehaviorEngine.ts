import { Bubu } from '../pet/Bubu';
import { globalEventBus } from '../events/EventBus';

export class BehaviorEngine {
    pet: Bubu;
    timer: number = 2000;
    private isMusicPlaying = false;
    
    private moodMessages = {
        happy: ["Yay!", "Nice work!", "You did it!", "Looks great!"],
        thinking: ["Thinking...", "Hm... let me think.", "Trying something...", "Wait a second...", "I've got an idea!"],
        working: ["Working!", "Almost there!", "Processing!", "Anything to do?", "Ready when you are."],
        idle: ["I'm still here", "Anything to do?", "Ready when you are.", "Want to build something?"],
        developer: ["Let's code!", "Build time!", "Running tests...", "Debugging...", "Git looks clean!"]
    };

    private lastMessageTime = 0;

    constructor(pet: Bubu) {
        this.pet = pet;

        globalEventBus.subscribe('MUSIC_STARTED', () => {
            this.isMusicPlaying = true;
            this.pet.setState('SURPRISED');
            setTimeout(() => { 
                if (this.pet.state === 'SURPRISED') {
                    this.pet.setState('DANCE');
                    this.trySpeak('happy');
                }
            }, 1000);
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
                const appName = (event.payload || '').toLowerCase();
                if (appName.includes('code') || appName.includes('studio') || appName.includes('vim') || appName.includes('terminal')) {
                    this.trySpeak('developer');
                } else {
                    this.trySpeak('working');
                }
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
            this.trySpeak('idle');
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
            if (Math.random() > 0.5) this.trySpeak('thinking');
        }
    }

    private trySpeak(mood: keyof typeof this.moodMessages, force: boolean = false) {
        const now = Date.now();
        // Cooldown of 15 seconds to avoid spam (unless forced)
        if (!force && now - this.lastMessageTime < 15000) return;
        
        // 30% chance to speak if triggered
        if (!force && Math.random() > 0.3) return;

        const messages = this.moodMessages[mood];
        if (messages) {
            const msg = messages[Math.floor(Math.random() * messages.length)];
            globalEventBus.emit('NOTIFICATION_RECEIVED', { title: 'Bubu says:', message: msg });
            this.lastMessageTime = now;
        }
    }
}
