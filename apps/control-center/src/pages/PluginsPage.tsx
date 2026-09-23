import React from 'react';
import { Puzzle, Shield } from 'lucide-react';

export default function PluginsPage() {
  const plugins = [
    {
      id: 'builtin-lrclib',
      name: 'LRCLIB Synced Lyrics',
      version: '1.0.0',
      category: 'Lyrics',
      description: 'Synchronized real-time lyrics integration via open LRCLIB database.',
      permissions: ['lyrics.read'],
      enabled: true
    },
    {
      id: 'builtin-waybar',
      name: 'Waybar Integration',
      version: '1.0.0',
      category: 'Integration',
      description: 'Exposes Bubu pet status, mood, and music info as Waybar JSON modules.',
      permissions: ['pet.animation', 'music.read'],
      enabled: true
    },
    {
      id: 'builtin-browser-bridge',
      name: 'Browser Media Extension Bridge',
      version: '1.0.0',
      category: 'Browser',
      description: 'Connects YouTube Music & Spotify Web tabs via local WebSocket.',
      permissions: ['music.read', 'music.control'],
      enabled: true
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="page-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Puzzle size={20} aria-hidden="true" /> Plugins &amp; Extensions
        </h2>
        <button className="btn btn-secondary">+ Install Custom Plugin (.zip)</button>
      </div>

      <div className="card" style={{ background: 'var(--accent-light, #ffeae8)', borderColor: 'var(--accent)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <Shield size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <p style={{ fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
          <strong>Sandboxed Plugin Architecture:</strong> Plugins run with declarative capabilities and strictly validated permissions. No plugin can execute arbitrary system commands or access sensitive files.
        </p>
      </div>

      <div className="grid grid-1" style={{ gap: '16px' }}>
        {plugins.map(p => (
          <div key={p.id} className="card">
            <div className="card-header">
              <div>
                <span className="card-title" style={{ fontSize: '15px' }}>{p.name}</span>
                <span className="badge badge-info" style={{ marginLeft: '10px' }}>v{p.version}</span>
                <span className="badge badge-secondary" style={{ marginLeft: '6px' }}>{p.category}</span>
              </div>
              <div className={`toggle ${p.enabled ? 'active' : ''}`} />
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '8px 0 12px' }}>
              {p.description}
            </p>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Permissions:</span>
              {p.permissions.map(perm => (
                <span key={perm} style={{
                  fontSize: '11px',
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontFamily: 'monospace'
                }}>
                  {perm}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
