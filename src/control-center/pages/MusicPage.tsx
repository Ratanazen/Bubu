import { useEffect } from "react";
import { useMusicStore } from "../../shared/store/musicStore";
import { Music, Play, Pause } from "lucide-react";

export function MusicPage() {
    const { media, reactionLevel, setReactionLevel, pollMedia } = useMusicStore();

    useEffect(() => {
        pollMedia();
        const interval = setInterval(pollMedia, 2000);
        return () => clearInterval(interval);
    }, [pollMedia]);

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
