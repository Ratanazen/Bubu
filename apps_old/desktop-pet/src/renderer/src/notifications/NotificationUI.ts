import { globalEventBus } from '../events/EventBus';

export class NotificationUI {
    private element: HTMLElement;
    private timer: any;

    constructor(container: HTMLElement) {
        this.element = document.createElement('div');
        this.element.className = 'notification-bubble';
        
        // Match the mockup: pill-shaped light gray speech bubble
        this.element.style.position = 'absolute';
        this.element.style.bottom = '140px'; 
        this.element.style.left = '50%';
        this.element.style.transform = 'translateX(-50%)';
        this.element.style.background = '#e0e0e0';
        this.element.style.padding = '15px 25px';
        this.element.style.borderRadius = '30px';
        this.element.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        this.element.style.fontFamily = 'sans-serif';
        this.element.style.fontSize = '14px';
        this.element.style.color = '#333';
        this.element.style.display = 'none';
        this.element.style.whiteSpace = 'nowrap';
        this.element.style.pointerEvents = 'none';
        this.element.style.zIndex = '100';

        // Add tail arrow matching the mockup
        const arrow = document.createElement('div');
        arrow.style.position = 'absolute';
        arrow.style.bottom = '-10px';
        arrow.style.right = '30px';
        arrow.style.width = '0';
        arrow.style.height = '0';
        arrow.style.borderLeft = '15px solid transparent';
        arrow.style.borderRight = '0px solid transparent';
        arrow.style.borderTop = '20px solid #e0e0e0';
        this.element.appendChild(arrow);
        
        container.appendChild(this.element);

        globalEventBus.subscribe('NOTIFICATION_RECEIVED', (event) => {
            this.show(event.payload.title, event.payload.message);
        });
    }

    private show(title: string, message: string) {
        const textNode = document.createElement('div');
        textNode.innerHTML = title ? `<b>${title}</b><br/>${message}` : message;
        textNode.style.position = 'relative';
        textNode.style.zIndex = '101';
        
        // clean up old text
        while (this.element.childNodes.length > 1) {
            this.element.removeChild(this.element.lastChild!);
        }
        this.element.appendChild(textNode);
        
        this.element.style.display = 'block';
        
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.element.style.display = 'none';
        }, 5000);
    }
}
