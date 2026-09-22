import React from 'react';
export default function HomeDashboard() {
    return (
        <div style={{ padding: '24px' }}>
            <h2>Bubu V4 Dashboard</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                <div className="card" style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '12px' }}>
                    <h3>Status</h3>
                    <p>● Online</p>
                </div>
                <div className="card" style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '12px' }}>
                    <h3>Compositor</h3>
                    <p>Hyprland (Wayland)</p>
                </div>
            </div>
        </div>
    );
}
