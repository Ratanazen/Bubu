import React from 'react';

const integrations = [
    { id: 'waybar', name: 'Waybar', icon: '📊', status: 'available' },
    { id: 'hyprland', name: 'Hyprland', icon: '🖥️', status: 'active' },
    { id: 'sway', name: 'Sway', icon: '🪟', status: 'not-installed' },
    { id: 'niri', name: 'Niri', icon: '🌿', status: 'not-installed' },
    { id: 'i3', name: 'i3', icon: '🔲', status: 'not-installed' },
    { id: 'kde', name: 'KDE Plasma', icon: '💎', status: 'not-installed' },
    { id: 'gnome', name: 'GNOME', icon: '👣', status: 'not-installed' },
    { id: 'xfce', name: 'XFCE', icon: '🐭', status: 'not-installed' },
];

const statusBadge = (status: string) => {
    const map: Record<string, { cls: string; label: string }> = {
        'active': { cls: 'badge-success', label: 'Active' },
        'available': { cls: 'badge-info', label: 'Available' },
        'configured': { cls: 'badge-success', label: 'Configured' },
        'not-installed': { cls: 'badge-warning', label: 'Not Detected' },
        'unsupported': { cls: 'badge-error', label: 'Unsupported' },
    };
    const b = map[status] || { cls: 'badge-warning', label: status };
    return <span className={`badge ${b.cls}`}>{b.label}</span>;
};

export default function LinuxPage() {
    return (
        <div>
            <h2 className="page-title">🐧 Linux Integration</h2>

            <div className="grid grid-2">
                <div className="card">
                    <div className="card-title" style={{ marginBottom: '12px' }}>System Info</div>
                    <div className="status-row">
                        <span className="status-label">Session Type</span>
                        <span className="status-value">Wayland</span>
                    </div>
                    <div className="status-row">
                        <span className="status-label">Desktop</span>
                        <span className="status-value">Hyprland</span>
                    </div>
                    <div className="status-row">
                        <span className="status-label">Compositor</span>
                        <span className="status-value">Hyprland</span>
                    </div>
                </div>

                <div className="card">
                    <div className="card-title" style={{ marginBottom: '12px' }}>Capabilities</div>
                    <div className="status-row">
                        <span className="status-label">Transparent Window</span>
                        <span className="badge badge-success">✓</span>
                    </div>
                    <div className="status-row">
                        <span className="status-label">Always On Top</span>
                        <span className="badge badge-success">✓</span>
                    </div>
                    <div className="status-row">
                        <span className="status-label">System Tray</span>
                        <span className="badge badge-success">✓</span>
                    </div>
                    <div className="status-row">
                        <span className="status-label">Global Shortcuts</span>
                        <span className="badge badge-warning">Limited</span>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <span className="card-title">Desktop Environment Integrations</span>
                </div>
                {integrations.map(i => (
                    <div key={i.id} className="status-row">
                        <span className="status-label">{i.icon} {i.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {statusBadge(i.status)}
                            {(i.status === 'available' || i.status === 'active') && (
                                <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: '11px' }}>
                                    📋 Config
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="card">
                <div className="card-title" style={{ marginBottom: '12px' }}>Waybar Configuration</div>
                <pre style={{
                    background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px',
                    fontSize: '12px', fontFamily: 'monospace', overflow: 'auto', lineHeight: 1.5
                }}>
{`{
  "custom/bubu": {
    "exec": "bubu waybar",
    "return-type": "json",
    "interval": 1,
    "on-click": "bubu pet show"
  }
}`}
                </pre>
                <button className="btn btn-secondary" style={{ marginTop: '8px' }}>📋 Copy Configuration</button>
            </div>
        </div>
    );
}
