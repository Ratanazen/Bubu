import React from 'react';
import { Globe, Upload, Download } from 'lucide-react';
import { PetIcon } from '../components/Icons';

export default function BrowserPage() {
    const browsers = [
        { name: 'Google Chrome', status: 'Not Installed' },
        { name: 'Chromium',      status: 'Not Installed' },
        { name: 'Brave',         status: 'Not Installed' },
        { name: 'Mozilla Firefox', status: 'Not Installed' },
        { name: 'Microsoft Edge',  status: 'Not Installed' },
    ];

    return (
        <div>
            <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={20} aria-hidden="true" /> Browser Integration
            </h2>

            <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                    <Globe size={48} color="var(--text-muted)" aria-hidden="true" />
                </div>
                <h3 style={{ marginBottom: '8px' }}>Not Connected</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '300px', margin: '0 auto' }}>
                    Install the Bubu browser extension to detect music from YouTube Music, Spotify Web, SoundCloud, and more.
                </p>
                <div className="quick-actions" style={{ justifyContent: 'center', marginTop: '16px' }}>
                    <button className="btn btn-primary" title="Install for Chrome" aria-label="Install for Chrome">Chrome</button>
                    <button className="btn btn-secondary" title="Install for Firefox" aria-label="Install for Firefox">Firefox</button>
                    <button className="btn btn-ghost" title="Install for Brave" aria-label="Install for Brave">Brave</button>
                    <button className="btn btn-ghost" title="Install for Edge" aria-label="Install for Edge">Edge</button>
                </div>
            </div>

            <div className="card">
                <div className="card-title" style={{ marginBottom: '12px' }}>Supported Browsers</div>
                {browsers.map(b => (
                    <div key={b.name} className="status-row">
                        <span className="status-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Globe size={13} aria-hidden="true" /> {b.name}
                        </span>
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
