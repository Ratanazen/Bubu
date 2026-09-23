import React from 'react';
export default function CompositorPage() {
    return (
        <div style={{ padding: '24px' }}>
            <h2>Compositor Settings</h2>
            <p>Detected Compositor: Hyprland</p>
            <button className="btn primary">Auto-Configure Rules</button>
        </div>
    );
}
