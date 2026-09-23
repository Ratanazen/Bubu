import React from 'react';
import { Mic, Captions, Image as ImageIcon } from 'lucide-react';

export default function LyricsPage() {
    return (
        <div>
            <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Captions size={20} aria-hidden="true" /> Lyrics
            </h2>

            <div className="card" style={{ minHeight: '300px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ marginBottom: '12px', color: 'var(--text-muted)' }}>
                    <Mic size={40} aria-hidden="true" />
                </div>
                <h3 style={{ marginBottom: '8px' }}>No Lyrics</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '300px' }}>
                    Play a song to see synced lyrics here. Connect a browser extension or enable OS media detection.
                </p>
            </div>

            <div className="grid grid-2">
                <div className="card">
                    <div className="card-title" style={{ marginBottom: '12px' }}>Display Settings</div>
                    <div className="status-row">
                        <span className="status-label">Font Size</span>
                        <input type="range" min="12" max="32" defaultValue="16" style={{ width: '120px' }} />
                    </div>
                    <div className="status-row">
                        <span className="status-label">Opacity</span>
                        <input type="range" min="0" max="100" defaultValue="90" style={{ width: '120px' }} />
                    </div>
                    <div className="status-row">
                        <span className="status-label">Auto-scroll</span>
                        <div className="toggle active" />
                    </div>
                    <div className="status-row">
                        <span className="status-label">Karaoke Mode</span>
                        <div className="toggle" />
                    </div>
                </div>

                <div className="card">
                    <div className="card-title" style={{ marginBottom: '12px' }}>Lyrics Offset</div>
                    <div style={{ textAlign: 'center', padding: '12px 0' }}>
                        <div className="quick-actions" style={{ justifyContent: 'center' }}>
                            <button className="btn btn-ghost">-500ms</button>
                            <span style={{ padding: '8px 16px', fontWeight: 600 }}>0ms</span>
                            <button className="btn btn-ghost">+500ms</button>
                        </div>
                    </div>
                    <div className="status-row" style={{ marginTop: '12px' }}>
                        <span className="status-label">Show Album Art</span>
                        <div className="toggle active" />
                    </div>
                    <div style={{ marginTop: '12px' }}>
                        <button className="btn btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <ImageIcon size={14} aria-hidden="true" /> Open Floating Lyrics
                        </button>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-title" style={{ marginBottom: '12px' }}>Lyrics Providers</div>
                <div className="status-row">
                    <span className="status-label">LRCLIB (Open API)</span>
                    <span className="badge badge-success">Active</span>
                </div>
                <div className="status-row">
                    <span className="status-label">Local .LRC Files</span>
                    <span className="badge badge-success">Available</span>
                </div>
                <div className="status-row">
                    <span className="status-label">User-provided Lyrics</span>
                    <span className="badge badge-info">Manual</span>
                </div>
            </div>
        </div>
    );
}
