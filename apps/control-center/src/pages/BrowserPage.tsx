import React from 'react';

export default function BrowserPage() {
    return (
        <div>
            <h2 className="page-title">🌐 Browser Integration</h2>

            <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔌</div>
                <h3 style={{ marginBottom: '8px' }}>Not Connected</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '300px', margin: '0 auto' }}>
                    Install the Bubu browser extension to detect music from YouTube Music, Spotify Web, SoundCloud, and more.
                </p>
                <div className="quick-actions" style={{ justifyContent: 'center', marginTop: '16px' }}>
                    <button className="btn btn-primary">🌐 Chrome</button>
                    <button className="btn btn-secondary">🦊 Firefox</button>
                    <button className="btn btn-ghost">🦁 Brave</button>
                    <button className="btn btn-ghost">🌊 Edge</button>
                </div>
            </div>

            <div className="card">
                <div className="card-title" style={{ marginBottom: '12px' }}>Supported Browsers</div>
                {[
                    { name: 'Google Chrome', icon: '🌐', status: 'Not Installed' },
                    { name: 'Chromium', icon: '🌐', status: 'Not Installed' },
                    { name: 'Brave', icon: '🦁', status: 'Not Installed' },
                    { name: 'Mozilla Firefox', icon: '🦊', status: 'Not Installed' },
                    { name: 'Microsoft Edge', icon: '🌊', status: 'Not Installed' },
                ].map(b => (
                    <div key={b.name} className="status-row">
                        <span className="status-label">{b.icon} {b.name}</span>
                        <span className="badge badge-warning">{b.status}</span>
                    </div>
                ))}
            </div>

            <div className="card">
                <div className="card-title" style={{ marginBottom: '8px' }}>Architecture</div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    Browser → Extension → Local WebSocket (127.0.0.1) → Bubu Core → Music / Lyrics Engine
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                    All communication is local. No data is sent to external servers.
                </p>
            </div>
        </div>
    );
}
