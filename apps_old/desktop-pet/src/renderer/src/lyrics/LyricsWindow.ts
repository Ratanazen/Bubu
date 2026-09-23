import { globalEventBus } from '../events/EventBus';

export class LyricsWindow {
    private element: HTMLElement;
    private lyrics: {time: number, text: string}[] = [];
    private currentIndex = -1;

    constructor(container: HTMLElement) {
        this.element = document.createElement('div');
        this.element.className = 'lyrics-window';
        this.element.style.display = 'none';
        
        // Basic CSS embedded
        this.element.style.position = 'absolute';
        this.element.style.top = '10px';
        this.element.style.right = '10px';
        this.element.style.width = '200px';
        this.element.style.height = '150px';
        this.element.style.background = 'rgba(255, 255, 255, 0.8)';
        this.element.style.borderRadius = '10px';
        this.element.style.padding = '10px';
        this.element.style.overflow = 'hidden';
        this.element.style.fontFamily = 'sans-serif';
        this.element.style.fontSize = '12px';
        this.element.style.color = '#333';
        this.element.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        this.element.style.pointerEvents = 'none'; // ignore clicks initially

        container.appendChild(this.element);

        globalEventBus.subscribe('LYRICS_READY', (event) => {
            this.lyrics = event.payload;
            this.element.style.display = 'block';
            this.render();
        });

        globalEventBus.subscribe('LYRICS_UNAVAILABLE', () => {
            this.lyrics = [];
            this.element.innerHTML = '<i>Lyrics unavailable</i>';
            this.element.style.display = 'block';
        });

        globalEventBus.subscribe('MUSIC_STOPPED', () => {
            this.element.style.display = 'none';
        });

        globalEventBus.subscribe('MUSIC_POSITION_CHANGED', (event) => {
            const time = event.payload.position; // in seconds
            this.updatePosition(time);
        });
    }

    private render() {
        this.element.innerHTML = this.lyrics.map((l, i) => `<div id="lyric-${i}" style="padding:2px 0; transition: 0.3s; opacity: 0.5;">${l.text}</div>`).join('');
    }

    private updatePosition(time: number) {
        if (!this.lyrics.length) return;
        
        let newIndex = -1;
        for (let i = 0; i < this.lyrics.length; i++) {
            if (this.lyrics[i].time <= time) {
                newIndex = i;
            } else {
                break;
            }
        }

        if (newIndex !== this.currentIndex && newIndex !== -1) {
            if (this.currentIndex !== -1) {
                const oldEl = document.getElementById(`lyric-${this.currentIndex}`);
                if (oldEl) { oldEl.style.opacity = '0.5'; oldEl.style.fontWeight = 'normal'; oldEl.style.color = '#333'; }
            }
            this.currentIndex = newIndex;
            const newEl = document.getElementById(`lyric-${this.currentIndex}`);
            if (newEl) { 
                newEl.style.opacity = '1'; 
                newEl.style.fontWeight = 'bold'; 
                newEl.style.color = '#ff9a94';
                // Scroll into view
                this.element.scrollTop = newEl.offsetTop - this.element.offsetHeight / 2;
            }
        }
    }
}
