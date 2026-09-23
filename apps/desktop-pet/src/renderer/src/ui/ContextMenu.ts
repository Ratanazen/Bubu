import { globalEventBus } from '../events/EventBus';

export class ContextMenu {
    private element: HTMLElement;

    constructor(container: HTMLElement) {
        this.element = document.createElement('div');
        this.element.style.position = 'absolute';
        this.element.style.background = 'white';
        this.element.style.border = '1px solid #ccc';
        this.element.style.borderRadius = '5px';
        this.element.style.padding = '5px 0';
        this.element.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        this.element.style.display = 'none';
        this.element.style.zIndex = '1000';
        this.element.style.pointerEvents = 'auto';
        this.element.style.fontFamily = 'sans-serif';
        this.element.style.fontSize = '12px';

        container.appendChild(this.element);

        window.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.show(e.clientX, e.clientY);
            window.electronAPI.setIgnoreMouseEvents(false);
        });

        window.addEventListener('click', () => {
            this.hide();
        });
    }

    private show(x: number, y: number) {
        this.element.innerHTML = `
            <div class="menu-item" onclick="window.dispatchEvent(new CustomEvent('cmd', {detail: 'play'}))">Play</div>
            <div class="menu-item" onclick="window.dispatchEvent(new CustomEvent('cmd', {detail: 'speak'}))">Speak</div>
            <div class="menu-item" onclick="window.dispatchEvent(new CustomEvent('cmd', {detail: 'sleep'}))">Sleep</div>
            <div class="menu-item" onclick="window.dispatchEvent(new CustomEvent('cmd', {detail: 'run'}))">Run</div>
            <div class="menu-item" onclick="window.dispatchEvent(new CustomEvent('cmd', {detail: 'dance'}))">Dance</div>
            <hr style="margin: 4px 0; border: none; border-top: 1px solid #eee;" />
            <div class="menu-item" onclick="window.electronAPI.showSettings()">Admin / Config</div>
            <div class="menu-item" onclick="window.electronAPI.closeApp()">Exit</div>
        `;
        
        const items = this.element.querySelectorAll('.menu-item');
        items.forEach(el => {
            const e = el as HTMLElement;
            e.style.padding = '5px 15px';
            e.style.cursor = 'pointer';
            e.onmouseenter = () => e.style.background = '#f0f0f0';
            e.onmouseleave = () => e.style.background = 'transparent';
        });

        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
        this.element.style.display = 'block';
    }

    private hide() {
        this.element.style.display = 'none';
    }
}
