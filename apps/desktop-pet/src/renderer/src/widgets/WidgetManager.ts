import { globalEventBus } from '../events/EventBus';

export interface WidgetConfig {
    id: string;
    type: 'text' | 'clock' | 'system' | 'music' | 'image';
    content?: string; // For text/image URL
    x: number;
    y: number;
    z: number;
    style?: {
        font?: string;
        size?: number;
        color?: string;
        opacity?: number;
        rotation?: number;
        shadow?: string;
        background?: string;
        border?: string;
    };
}

export class WidgetManager {
    private container: HTMLElement;
    private widgets: Map<string, WidgetConfig> = new Map();
    private elements: Map<string, HTMLElement> = new Map();

    constructor(container: HTMLElement) {
        this.container = container;
        this.loadWidgets();
    }

    private loadWidgets() {
        try {
            const data = localStorage.getItem('bubu-widgets');
            if (data) {
                const arr = JSON.parse(data) as WidgetConfig[];
                arr.forEach(w => this.addWidget(w, false));
            }
        } catch (e) {
            console.error('Failed to load widgets', e);
        }
    }

    private saveWidgets() {
        localStorage.setItem('bubu-widgets', JSON.stringify(Array.from(this.widgets.values())));
    }

    public addWidget(config: WidgetConfig, save: boolean = true) {
        this.widgets.set(config.id, config);
        this.renderWidget(config);
        if (save) this.saveWidgets();
    }

    public removeWidget(id: string) {
        this.widgets.delete(id);
        const el = this.elements.get(id);
        if (el) {
            el.remove();
            this.elements.delete(id);
        }
        this.saveWidgets();
    }

    private renderWidget(config: WidgetConfig) {
        let el = this.elements.get(config.id);
        if (!el) {
            el = document.createElement('div');
            el.id = `widget-${config.id}`;
            this.container.appendChild(el);
            this.elements.set(config.id, el);
        }

        // Apply styles
        const st = config.style || {};
        el.style.position = 'absolute';
        el.style.left = `${config.x}px`;
        el.style.top = `${config.y}px`;
        el.style.zIndex = `${config.z}`;
        el.style.transform = `rotate(${st.rotation || 0}deg)`;
        el.style.opacity = `${st.opacity ?? 1}`;
        el.style.color = st.color || '#fff';
        el.style.fontFamily = st.font || 'sans-serif';
        el.style.fontSize = `${st.size || 14}px`;
        if (st.shadow) el.style.textShadow = st.shadow;
        if (st.background) el.style.background = st.background;
        if (st.border) el.style.border = st.border;
        el.style.pointerEvents = 'auto'; // allow interaction if unlocked

        // Content
        if (config.type === 'text') {
            el.textContent = config.content || '';
        } else if (config.type === 'clock') {
            el.textContent = new Date().toLocaleTimeString();
            // Clock needs an interval
            if (!el.dataset.clockInit) {
                el.dataset.clockInit = 'true';
                setInterval(() => {
                    if (this.elements.has(config.id)) {
                        el!.textContent = new Date().toLocaleTimeString();
                    }
                }, 1000);
            }
        } else if (config.type === 'system') {
            el.innerHTML = `<div>CPU: 4% RAM: 1.2GB</div>`; // Mocked initially, could connect to IPC
        } else if (config.type === 'image') {
            el.innerHTML = `<img src="${config.content}" style="max-width:100%; max-height:100%;" />`;
        }

        // Make draggable
        this.makeDraggable(el, config);
    }

    private makeDraggable(el: HTMLElement, config: WidgetConfig) {
        let isDragging = false;
        let startX = 0, startY = 0;
        let origX = config.x, origY = config.y;

        el.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            origX = config.x;
            origY = config.y;
            e.stopPropagation();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            config.x = origX + (e.clientX - startX);
            config.y = origY + (e.clientY - startY);
            el.style.left = `${config.x}px`;
            el.style.top = `${config.y}px`;
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                this.saveWidgets();
            }
        });
    }

    public bringToFront(id: string) {
        const config = this.widgets.get(id);
        if (config) {
            const maxZ = Math.max(...Array.from(this.widgets.values()).map(w => w.z), 10);
            config.z = maxZ + 1;
            this.renderWidget(config);
            this.saveWidgets();
        }
    }
}
