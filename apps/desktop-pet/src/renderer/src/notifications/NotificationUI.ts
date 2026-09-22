import { globalEventBus } from '../events/EventBus';

export class NotificationUI {
    private element: HTMLElement;

    constructor(container: HTMLElement) {
        this.element = document.createElement('div');
        this.element.className = 'notification-bubble';
        
        // Basic CSS
        this.element.style.position = 'absolute';
        this.element.style.bottom = '120px'; // above bubu
        this.element.style.left = '50%';
        this.element.style.transform = 'translateX(-50%)';
        this.element.style.background = 'white';
        this.element.style.padding = '8px 12px';
        this.element.style.borderRadius = '15px';
        this.element.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        this.element.style.fontFamily = 'sans-serif';
        this.element.style.fontSize = '12px';
        this.element.style.color = '#333';
        this.element.style.display = 'none';
        this.element.style.whiteSpace = 'nowrap';
        this.element.style.pointerEvents = 'none';
        this.element.style.zIndex = '100';

        // Add tail arrow
        const arrow = document.createElement('div');
        arrow.style.position = 'absolute';
        arrow.style.bottom = '-5px';
        arrow.style.left = '50%';
        arrow.style.transform = 'translateX(-50%) rotate(45deg)';
        arrow.style.width = '10px';
        arrow.style.height = '10px';
        arrow.style.background = 'white';
        this.element.appendChild(arrow);
        
        container.appendChild(this.element);

        globalEventBus.subscribe('NOTIFICATION_RECEIVED', (event) => {
            this.show(event.payload.title, event.payload.message);
        });
    }

    private show(title: string, message: string) {
        const textNode = document.createElement('div');
        textNode.innerHTML = `<b>${title}</b><br/>${message}`;
        textNode.style.position = 'relative';
        textNode.style.zIndex = '101';
        
        // clean up old text
        while (this.element.childNodes.length > 1) {
            this.element.removeChild(this.element.lastChild!);
        }
        this.element.appendChild(textNode);
        
        this.element.style.display = 'block';
        
        setTimeout(() => {
            this.element.style.display = 'none';
        }, 5000);
    }
}
