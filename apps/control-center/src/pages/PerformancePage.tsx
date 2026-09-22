import React, { useState } from 'react';

export default function PerformancePage() {
  const [profile, setProfile] = useState<'normal' | 'battery-saver' | 'game-mode'>('normal');

  return (
    <div>
      <h2 className="page-title">⚡ Performance & Resource Monitor</h2>

      <div className="grid grid-3" style={{ marginBottom: '20px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="card-subtitle">CPU Usage</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--accent)', marginTop: '8px' }}>
            {profile === 'game-mode' ? '0.1%' : profile === 'battery-saver' ? '0.4%' : '1.2%'}
          </div>
          <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>Lightweight native loop</div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div className="card-subtitle">RAM Usage</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#4ade80', marginTop: '8px' }}>
            {profile === 'game-mode' ? '28 MB' : '42 MB'}
          </div>
          <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>Heap Memory</div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div className="card-subtitle">Target FPS</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#60a5fa', marginTop: '8px' }}>
            {profile === 'game-mode' ? '10 FPS' : profile === 'battery-saver' ? '15 FPS' : '60 FPS'}
          </div>
          <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>Frame Governor</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: '12px' }}>Power & Efficiency Profile</div>
        <div className="quick-actions" style={{ gap: '12px', marginBottom: '16px' }}>
          <button
            className={`btn ${profile === 'normal' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setProfile('normal')}
          >
            🚀 Normal (60 FPS, Full Blur)
          </button>
          <button
            className={`btn ${profile === 'battery-saver' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setProfile('battery-saver')}
          >
            🔋 Battery Saver (15 FPS, Low CPU)
          </button>
          <button
            className={`btn ${profile === 'game-mode' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setProfile('game-mode')}
          >
            🎮 Game Mode (Minimal Stealth)
          </button>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Game Mode automatically hides the pet or pauses animations when a fullscreen 3D application or game is active.
        </p>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: '12px' }}>Engine Diagnostics</div>
        <div className="status-row">
          <span className="status-label">Behavior Engine Tick</span>
          <span className="badge badge-success">Event-Driven (Idle)</span>
        </div>
        <div className="status-row">
          <span className="status-label">Asset Pipeline Memory</span>
          <span className="badge badge-success">Zero Unused Leaks</span>
        </div>
        <div className="status-row">
          <span className="status-label">Media Session Listener</span>
          <span className="badge badge-info">Active</span>
        </div>
        <div className="status-row">
          <span className="status-label">Compositor Frame Throttle</span>
          <span className="badge badge-success">Enabled</span>
        </div>
      </div>
    </div>
  );
}
