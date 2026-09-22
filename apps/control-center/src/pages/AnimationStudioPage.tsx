import React, { useState } from 'react';

export default function AnimationStudioPage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [fps, setFps] = useState(8);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [selectedState, setSelectedState] = useState('dance');

  const frames = [
    { id: 0, name: 'Frame 1 (Rest)', duration: 125 },
    { id: 1, name: 'Frame 2 (Hop Up)', duration: 125 },
    { id: 2, name: 'Frame 3 (Apex)', duration: 125 },
    { id: 3, name: 'Frame 4 (Land)', duration: 125 }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="page-title" style={{ margin: 0 }}>🕺 Animation Studio V2</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary">+ Import Spritesheet</button>
          <button className="btn btn-primary">💾 Save Animation</button>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: '20px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
          <div className="card-title" style={{ marginBottom: '16px' }}>Playback Preview</div>
          <div style={{
            width: '160px',
            height: '160px',
            margin: '0 auto',
            backgroundColor: '#0f0f18',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--border)'
          }}>
            <div style={{
              fontSize: '64px',
              transform: selectedState === 'dance' ? (currentFrame % 2 === 0 ? 'translateY(-10px) rotate(4deg)' : 'translateY(0) rotate(-4deg)') : 'none',
              transition: 'transform 0.1s ease'
            }}>
              🐻
            </div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <button className="btn btn-ghost" onClick={() => setCurrentFrame(prev => Math.max(0, prev - 1))}>⏮ Prev</button>
            <button className="btn btn-primary" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
            <button className="btn btn-ghost" onClick={() => setCurrentFrame(prev => (prev + 1) % frames.length)}>Next ⏭</button>
          </div>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: '16px' }}>Animation State & Timing</div>
          <div className="status-row">
            <span className="status-label">Active State</span>
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              style={{ width: '160px' }}
            >
              <option value="idle">🧍 Idle</option>
              <option value="walk">🚶 Walk</option>
              <option value="run">🏃 Run</option>
              <option value="sleep">😴 Sleep</option>
              <option value="dance">🕺 Dance</option>
              <option value="pet">💖 Pet (Affection)</option>
              <option value="surprised">😮 Surprised</option>
            </select>
          </div>
          <div className="status-row">
            <span className="status-label">Frame Rate ({fps} FPS)</span>
            <input
              type="range"
              min="1"
              max="24"
              value={fps}
              onChange={e => setFps(Number(e.target.value))}
              style={{ width: '160px' }}
            />
          </div>
          <div className="status-row">
            <span className="status-label">Loop Mode</span>
            <select style={{ width: '160px' }}>
              <option value="loop">Continuous Loop</option>
              <option value="ping-pong">Ping-Pong (Alternate)</option>
              <option value="once">Play Once & Return to Idle</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: '14px' }}>Timeline & Frame Sequence</div>
        <div style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '12px'
        }}>
          {frames.map((frame, idx) => (
            <div
              key={frame.id}
              onClick={() => setCurrentFrame(idx)}
              style={{
                minWidth: '120px',
                padding: '12px',
                borderRadius: '10px',
                border: idx === currentFrame ? '2px solid var(--accent)' : '1px solid var(--border)',
                backgroundColor: idx === currentFrame ? 'var(--accent-light)' : 'var(--bg-primary)',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>🐻</div>
              <div style={{ fontSize: '11px', fontWeight: 600 }}>{frame.name}</div>
              <div style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>{frame.duration}ms</div>
            </div>
          ))}
          <div style={{
            minWidth: '100px',
            border: '2px dashed var(--border)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '12px',
            color: 'var(--text-muted)'
          }}>
            + Add Frame
          </div>
        </div>
      </div>
    </div>
  );
}
