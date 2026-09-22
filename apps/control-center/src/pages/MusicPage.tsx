import React from 'react';

export default function MusicPage() {
    return (
        <div>
            <h2 className="page-title">🎵 Music</h2>

            <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
                <div style={{ fontSize: '60px', marginBottom: '12px' }}>🎵</div>
                <h3 style={{ marginBottom: '4px' }}>Not Playing</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No music detected</p>
                <div className="quick-actions" style={{ justifyContent: 'center', marginTop: '16px' }}>
                    <button className="btn btn-ghost">⏮</button>
                    <button className="btn btn-primary" style={{ width: '48px', height: '48px', borderRadius: '50%', fontSize: '20px', padding: 0 }}>▶</button>
                    <button className="btn btn-ghost">⏭</button>
                </div>
            </div>

            <div className="card">
                <div className="card-title" style={{ marginBottom: '12px' }}>Music Sources</div>
                <div className="status-row">
                    <span className="status-label">🌐 Browser Extension</span>
                    <span className="badge badge-error">Disconnected</span>
                </div>
                <div className="status-row">
                    <span className="status-label">🖥️ OS Media Session</span>
                    <span className="badge badge-success">Available</span>
                </div>
                <div className="status-row">
                    <span className="status-label">🎧 Spotify</span>
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
