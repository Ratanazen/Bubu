import React from 'react';
import { Music2, SkipBack, Play, Pause, SkipForward, Globe, Monitor, Headphones } from 'lucide-react';

export default function MusicPage() {
    const [playing, setPlaying] = React.useState(false);

    return (
        <div>
            <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Music2 size={20} aria-hidden="true" /> Music &amp; Lyrics
            </h2>

            <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                    <Music2 size={56} color="var(--accent)" aria-hidden="true" />
                </div>
                <h3 style={{ marginBottom: '4px' }}>Not Playing</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No music detected</p>
                <div className="quick-actions" style={{ justifyContent: 'center', marginTop: '16px' }}>
                    <button
                        className="btn btn-ghost"
                        title="Previous track"
                        aria-label="Previous track"
                    >
                        <SkipBack size={16} aria-hidden="true" />
                    </button>
                    <button
                        className="btn btn-primary"
                        style={{ width: '48px', height: '48px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => setPlaying(p => !p)}
                        title={playing ? 'Pause' : 'Play'}
                        aria-label={playing ? 'Pause' : 'Play'}
                    >
                        {playing
                            ? <Pause size={20} aria-hidden="true" />
                            : <Play  size={20} aria-hidden="true" />
                        }
                    </button>
                    <button
                        className="btn btn-ghost"
                        title="Next track"
                        aria-label="Next track"
                    >
                        <SkipForward size={16} aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-title" style={{ marginBottom: '12px' }}>Music Sources</div>
                <div className="status-row">
                    <span className="status-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Globe size={13} aria-hidden="true" /> Browser Extension
                    </span>
                    <span className="badge badge-error">Disconnected</span>
                </div>
                <div className="status-row">
                    <span className="status-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Monitor size={13} aria-hidden="true" /> OS Media Session
                    </span>
                    <span className="badge badge-success">Available</span>
                </div>
                <div className="status-row">
                    <span className="status-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Headphones size={13} aria-hidden="true" /> Spotify
                    </span>
                    <span className="badge badge-warning">Not Detected</span>
                </div>
            </div>

            <div className="card">
                <div className="card-title" style={{ marginBottom: '12px' }}>Bubu Music Reactions</div>
                <div className="status-row">
                    <span className="status-label">React to music</span>
                    <div className="toggle active" />
                </div>
                <div className="status-row">
                    <span className="status-label">Dance on play</span>
                    <div className="toggle active" />
                </div>
                <div className="status-row">
                    <span className="status-label">Calm on quiet music</span>
                    <div className="toggle" />
                </div>
            </div>
        </div>
    );
}
