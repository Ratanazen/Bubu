import { BubuEvent, BubuEventType } from '../../../shared/events';

type EventHandler = (event: BubuEvent) => void;

export class EventBus {
    private listeners: Map<BubuEventType, EventHandler[]> = new Map();

    subscribe(type: BubuEventType, handler: EventHandler) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, []);
        }
        this.listeners.get(type)!.push(handler);
    }

    unsubscribe(type: BubuEventType, handler: EventHandler) {
        const handlers = this.listeners.get(type);
        if (handlers) {
            this.listeners.set(type, handlers.filter(h => h !== handler));
        }
    }

    emit(type: BubuEventType, payload?: any) {
        const handlers = this.listeners.get(type);
        if (handlers) {
            const event: BubuEvent = { type, payload };
            handlers.forEach(handler => handler(event));
        }
    }
}

export const globalEventBus = new EventBus();
