import { globalEventBus } from '../events/EventBus';
import { LyricsProvider } from './LyricsProvider';

export class LyricsManager {
    private provider = new LyricsProvider();
    private currentLyrics: {time: number, text: string}[] = [];
    
    constructor() {
        globalEventBus.subscribe('MUSIC_CHANGED', async (event) => {
            const { title, artist } = event.payload;
            const lrc = await this.provider.fetchLyrics(title, artist);
            if (lrc) {
                this.parseLrc(lrc);
                globalEventBus.emit('LYRICS_READY', this.currentLyrics);
            } else {
                this.currentLyrics = [];
                globalEventBus.emit('LYRICS_UNAVAILABLE');
            }
        });
    }

    private parseLrc(lrc: string) {
        this.currentLyrics = [];
        const lines = lrc.split('\\n');
        const regex = /\\[(\\d{2}):(\\d{2}.\\d{2})\\](.*)/;
        for (const line of lines) {
            const match = line.match(regex);
            if (match) {
                const min = parseInt(match[1]);
                const sec = parseFloat(match[2]);
                const text = match[3].trim();
                if (text) {
                    this.currentLyrics.push({ time: min * 60 + sec, text });
                }
            }
        }
    }
}
