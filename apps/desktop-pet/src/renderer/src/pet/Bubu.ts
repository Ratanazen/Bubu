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

    setBounds(bounds: any) {
        this.bounds = bounds;
        this.y = bounds.y + bounds.height - 220;
        this.x = bounds.x + Math.floor(bounds.width / 2);
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
        if (e.button !== 0) return; // Only left click
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
        }
    }

    onMouseUp(e: MouseEvent) {
        if (this.isDragging) {
            this.isDragging = false;
            this.setState('SURPRISED');
            setTimeout(() => { if(this.state === 'SURPRISED') this.setState('IDLE'); }, 1000);
        }
    }
    
    onDoubleClick() {
        this.setState('HAPPY');
        setTimeout(() => { if(this.state === 'HAPPY') this.setState('IDLE'); }, 2000);
    }

    update(dt: number) {
        if (this.isPaused) return;

        if (!this.isDragging) {
            this.vy += 0.002 * dt; // Gravity
            
            this.x += this.vx * dt;
            this.y += this.vy * dt;

            // Bounds collision
            const groundY = this.bounds.y + this.bounds.height - 220;
            if (this.y > groundY) {
                this.y = groundY;
                this.vy = 0;
            }

            if (this.x < this.bounds.x) {
                this.x = this.bounds.x;
                this.setState('WALK_RIGHT');
            } else if (this.x > this.bounds.x + this.bounds.width - 180) {
                this.x = this.bounds.x + this.bounds.width - 180;
                this.setState('WALK_LEFT');
            }
        }

        this.animator.update(dt, this.direction);
        window.electronAPI.moveWindow(Math.round(this.x), Math.round(this.y));
    }
}
