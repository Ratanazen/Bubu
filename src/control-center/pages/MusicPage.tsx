import { useEffect, useState } from "react";
import { useMusicStore } from "../../shared/store/musicStore";
import { invoke } from "@tauri-apps/api/core";
import { Music, Play, Pause, Mic2 } from "lucide-react";

interface LrcResponse {
    plainLyrics?: string;
    syncedLyrics?: string;
}

export function MusicPage() {
    const { media, reactionLevel, setReactionLevel, pollMedia } = useMusicStore();
    const [lyrics, setLyrics] = useState<LrcResponse | null>(null);
    const [loadingLyrics, setLoadingLyrics] = useState(false);

    useEffect(() => {
        pollMedia();
        const interval = setInterval(pollMedia, 2000);
        return () => clearInterval(interval);
    }, [pollMedia]);

    useEffect(() => {
        if (media?.title && media?.artist) {
            setLoadingLyrics(true);
            invoke<LrcResponse | null>("fetch_lyrics", { 
                trackName: media.title, 
                artistName: media.artist 
            }).then(res => {
                setLyrics(res);
                setLoadingLyrics(false);
            }).catch(e => {
                console.error("Lyrics fetch failed", e);
                setLoadingLyrics(false);
            });
        }
    }, [media?.title, media?.artist]);

    return (
        <div style={{ padding: 20 }}>
            <h2>Music & Lyrics Engine</h2>
            
            <div style={{ marginTop: 20, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                    <div style={{ width: 60, height: 60, background: '#eee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Music size={24} color="#666" />
                    </div>
                    <div>
                        {media ? (
                            <>
                                <h3 style={{ margin: 0 }}>{media.title || "Unknown Title"}</h3>
                                <p style={{ margin: 0, color: '#666' }}>{media.artist || "Unknown Artist"}</p>
                                <p style={{ margin: 0, fontSize: 12, color: '#999' }}>{media.album || "Unknown Album"}</p>
                            </>
                        ) : (
                            <p style={{ margin: 0, color: '#666' }}>No media playing.</p>
                        )}
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        {media?.playing ? <Play color="#10b981" /> : <Pause color="#ef4444" />}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: 20, background: '#1e1e2e', border: '1px solid #ddd', borderRadius: 8, padding: 20, color: '#fff', minHeight: 150 }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 0, color: '#cdd6f4' }}><Mic2 size={18}/> Live Lyrics</h3>
                
                {loadingLyrics ? (
                    <p style={{ color: '#a6adc8' }}>Searching LRCLIB for synced lyrics...</p>
                ) : lyrics?.syncedLyrics ? (
                    <div style={{ maxHeight: 200, overflowY: 'auto', color: '#cdd6f4', lineHeight: '1.8' }}>
                        {lyrics.syncedLyrics.split('\n').map((line, i) => {
                            const match = line.match(/\[\d{2}:\d{2}\.\d{2}\](.*)/);
                            return <p key={i} style={{ margin: '4px 0', opacity: i === 2 ? 1 : 0.6, fontSize: i === 2 ? 18 : 14, fontWeight: i === 2 ? 'bold' : 'normal' }}>
                                {match ? match[1] : line}
                            </p>
                        })}
                    </div>
                ) : lyrics?.plainLyrics ? (
                    <div style={{ maxHeight: 200, overflowY: 'auto', color: '#a6adc8', whiteSpace: 'pre-wrap' }}>
                        {lyrics.plainLyrics}
                    </div>
                ) : (
                    <p style={{ color: '#a6adc8' }}>No lyrics found for this track.</p>
                )}
            </div>

            <div style={{ marginTop: 20, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
                <h3>Pet Reaction Level</h3>
                <p style={{ color: '#666', fontSize: 14 }}>Controls how aggressively Bubu reacts to music (dancing, jumping).</p>
                <select 
                    value={reactionLevel}
                    onChange={(e) => setReactionLevel(e.target.value as any)}
                    style={{ padding: 10, width: '100%', marginTop: 10 }}
                >
                    <option value="Off">Off</option>
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                </select>
            </div>
        </div>
    );
}
