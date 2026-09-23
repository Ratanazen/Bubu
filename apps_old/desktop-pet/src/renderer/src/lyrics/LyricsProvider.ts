import { globalEventBus } from '../events/EventBus';

export class LyricsProvider {
    async fetchLyrics(title: string, artist: string): Promise<string | null> {
        try {
            // Using lrclib open API to get synced lyrics
            const query = new URLSearchParams({ track_name: title, artist_name: artist });
            const response = await fetch(`https://lrclib.net/api/search?${query}`);
            const data = await response.json();
            if (data && data.length > 0) {
                return data[0].syncedLyrics || data[0].plainLyrics || null;
            }
        } catch (e) {
            console.error('Failed to fetch lyrics', e);
        }
        return null;
    }
}
