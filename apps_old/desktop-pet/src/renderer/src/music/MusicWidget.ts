import { globalEventBus } from '../events/EventBus';

export class MusicWidget {
    private element: HTMLElement;

    constructor(container: HTMLElement) {
        this.element = document.createElement('div');
        this.element.className = 'music-widget';
        
        this.element.style.position = 'absolute';
        this.element.style.top = '10px';
        this.element.style.left = '10px';
        this.element.style.background = 'white';
        this.element.style.padding = '8px 12px';
        this.element.style.borderRadius = '10px';
        this.element.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        this.element.style.fontFamily = 'sans-serif';
        this.element.style.fontSize = '12px';
        this.element.style.color = '#333';
        this.element.style.display = 'none';
        this.element.style.pointerEvents = 'auto';

        container.appendChild(this.element);

        globalEventBus.subscribe('MUSIC_CHANGED', (event) => {
            const { title, artist } = event.payload;
            this.show(title, artist);
        });

        globalEventBus.subscribe('MUSIC_STOPPED', () => {
            this.element.style.display = 'none';
        });
    }

    private show(title: string, artist: string) {
        this.element.innerHTML = `
            <div style="display:flex; align-items:center; gap: 8px;">
                <div style="font-size: 20px;">Notes</div>
                <div>
                    <div style="font-weight: bold; width: 120px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${title}</div>
                    <div style="color: #666; font-size: 10px; width: 120px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${artist}</div>
                </div>
            </div>
            <div style="display:flex; justify-content:center; gap:10px; margin-top:5px; border-top: 1px solid #eee; padding-top: 5px;">
                <button style="border:none; background:none; cursor:pointer;" onclick="window.electronAPI.mediaControl('prev')">⏮</button>
                <button style="border:none; background:none; cursor:pointer;" onclick="window.electronAPI.mediaControl('playpause')">⏯</button>
                <button style="border:none; background:none; cursor:pointer;" onclick="window.electronAPI.mediaControl('next')">Next</button>
            </div>
        `;
        this.element.style.display = 'block';
    }
}
