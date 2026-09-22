import React from 'react';

const privacyItems = [
    { id: 'app-monitoring', label: 'App Monitoring', desc: 'Detect which application is focused to adjust Bubu behavior.', default: false },
    { id: 'browser', label: 'Browser Integration', desc: 'Connect to browser extension to detect music and provide lyrics.', default: false },
    { id: 'music', label: 'Music Detection', desc: 'Detect currently playing music using OS media session APIs.', default: true },
    { id: 'lyrics', label: 'Lyrics', desc: 'Fetch lyrics from external providers. Only sends song title and artist name.', default: true },
    { id: 'notifications', label: 'Notifications', desc: 'React to system notifications. Content is never stored permanently.', default: false },
    { id: 'telemetry', label: 'Telemetry', desc: 'Send anonymous usage statistics to help improve Bubu.', default: false },
];

export default function PrivacyPage() {
    return (
        <div>
            <h2 className="page-title">🔒 Privacy</h2>

            <div className="card" style={{ background: 'var(--accent-light)', borderColor: 'var(--accent)' }}>
                <p style={{ fontSize: '13px', lineHeight: 1.6 }}>
                    <strong>🔒 Bubu is privacy-first.</strong> All processing happens locally on your device.
                    No passwords, screen recordings, microphone, private messages, or browser history are ever collected.
                    You have full control over every feature.
                </p>
            </div>

            <div className="card">
                <div className="card-title" style={{ marginBottom: '16px' }}>Feature Access Controls</div>
                {privacyItems.map(item => (
                    <div key={item.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600 }}>{item.label}</span>
                            <div className={`toggle ${item.default ? 'active' : ''}`} />
                        </div>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="card">
                <div className="card-title" style={{ marginBottom: '8px' }}>Bubu Never Collects</div>
                <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 2, paddingLeft: '20px' }}>
                    <li>Passwords or login credentials</li>
                    <li>Microphone or audio recordings</li>
                    <li>Screen recordings or screenshots</li>
                    <li>Private message content</li>
                    <li>Browser history (beyond active tab title for app awareness)</li>
                    <li>Files or documents</li>
                </ul>
            </div>
        </div>
    );
}
