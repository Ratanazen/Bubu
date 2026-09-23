import { AnimationController } from '../animation/AnimationController';

export class Bubu {
    x: number = 0;
    y: number = 0;
    vx: number = 0;
    vy: number = 0;
    state: string = 'IDLE';
    direction: 'left' | 'right' = 'right';
    bounds = { x: 0, y: 0, width: 1920, height: 1080 };
    element: HTMLElement;
    isDragging = false;
    dragOffsetX = 0;
    dragOffsetY = 0;
    isPaused = false;
    animator: AnimationController;

    constructor(element: HTMLElement) {
        this.element = element;
        this.animator = new AnimationController(element);
    }

    displays: any[] = [];
    currentDisplay: any;
    dragEnabled = true;

    setBounds(bounds: any) {
        this.bounds = bounds; // fallback primary bounds
        this.currentDisplay = bounds;
        this.y = bounds.y + bounds.height - 220;
        this.x = bounds.x + Math.floor(bounds.width / 2);
    }

    setDisplays(displays: any[]) {
        this.displays = displays;
        if (displays.length > 0) {
            this.currentDisplay = displays[0];
        }
    }

    private updateCurrentDisplay() {
        if (!this.displays || this.displays.length === 0) return;
        // Pet center x, y
        const cx = this.x + 75;
        const cy = this.y + 75;
        let found = this.displays.find(d => cx >= d.x && cx <= d.x + d.width && cy >= d.y && cy <= d.y + d.height);
        if (!found) {
            // Find closest display if outside
            let minDist = Infinity;
            for (const d of this.displays) {
                const dcx = d.x + d.width / 2;
                const dcy = d.y + d.height / 2;
                const dist = Math.hypot(cx - dcx, cy - dcy);
                if (dist < minDist) {
                    minDist = dist;
                    found = d;
                }
            }
        }
        if (found) {
            this.currentDisplay = found;
        }
    }

    setState(newState: string) {
        if (this.state === newState) return;
        this.state = newState;
        this.animator.setState(newState);
        
        if (newState === 'WALK_LEFT') {
            this.vx = -0.05;
            this.direction = 'left';
        } else if (newState === 'WALK_RIGHT') {
            this.vx = 0.05;
            this.direction = 'right';
        } else if (newState === 'RUN_LEFT') {
            this.vx = -0.1;
            this.direction = 'left';
        } else if (newState === 'RUN_RIGHT') {
            this.vx = 0.1;
            this.direction = 'right';
        } else {
            this.vx = 0;
        }
    }

    onMouseDown(e: MouseEvent) {
        if (e.button !== 0 || !this.dragEnabled) return; // Only left click and if dragging enabled
        this.isDragging = true;
        this.dragOffsetX = e.clientX;
        this.dragOffsetY = e.clientY;
        this.setState('DRAGGED');
        this.vx = 0;
        this.vy = 0;
    }

    onMouseMove(e: MouseEvent) {
        if (this.isDragging) {
            this.x = e.screenX - this.dragOffsetX;
            this.y = e.screenY - this.dragOffsetY;
            this.updateCurrentDisplay();
        }
    }

    onMouseUp(e: MouseEvent) {
        if (this.isDragging) {
            this.isDragging = false;
            this.updateCurrentDisplay();
            this.setState('SURPRISED');
            setTimeout(() => { if(this.state === 'SURPRISED') this.setState('IDLE'); }, 1000);
            window.electronAPI.movePet(Math.round(this.x), Math.round(this.y));
        }
    }

    private lastPetTime = 0;
    private petStreak = 0;

    onPet() {
        const now = Date.now();
        if (now - this.lastPetTime < 600) {
            this.petStreak++;
        } else {
            this.petStreak = 1;
        }
        this.lastPetTime = now;

        if (this.petStreak >= 3) {
            this.setState('DANCE');
            setTimeout(() => { if (this.state === 'DANCE') this.setState('HAPPY'); }, 2000);
            setTimeout(() => { if (this.state === 'HAPPY') this.setState('IDLE'); }, 4000);
            this.petStreak = 0;
        } else {
            this.setState('HAPPY');
            setTimeout(() => { if (this.state === 'HAPPY') this.setState('IDLE'); }, 1500);
        }
    }
    
    onDoubleClick() {
        this.onPet();
    }

    update(dt: number) {
        if (this.isPaused) return;

        if (!this.isDragging) {
            this.vy += 0.002 * dt; // Gravity
            
            this.x += this.vx * dt;
            this.y += this.vy * dt;

            this.updateCurrentDisplay();
            const activeBounds = this.currentDisplay || this.bounds;

            // Bounds collision
            const groundY = activeBounds.y + activeBounds.height - 220;
            if (this.y > groundY) {
                this.y = groundY;
                this.vy = 0;
            }

            if (this.x < activeBounds.x) {
                this.x = activeBounds.x;
                this.setState('WALK_RIGHT');
            } else if (this.x > activeBounds.x + activeBounds.width - 180) {
                this.x = activeBounds.x + activeBounds.width - 180;
                this.setState('WALK_LEFT');
            }
        }

        this.animator.update(dt, this.direction);
        window.electronAPI.moveWindow(Math.round(this.x), Math.round(this.y));
    }
}
