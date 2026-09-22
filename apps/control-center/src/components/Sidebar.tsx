import React from 'react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenCommandPalette: () => void;
}

const navItems = [
  { id: 'home', icon: '🐾', label: 'Home' },
  { id: 'character', icon: '🎨', label: 'Character Studio' },
  { id: 'animations', icon: '🕺', label: 'Animation Studio' },
  { id: 'skins', icon: '🎭', label: 'Skins & Styles' },
  { id: 'music', icon: '🎵', label: 'Music' },
  { id: 'lyrics', icon: '🎤', label: 'Lyrics' },
  { id: 'browser', icon: '🌐', label: 'Browser' },
  { id: 'screen-map', icon: '🖥️', label: 'Screen Map' },
  { id: 'linux', icon: '🐧', label: 'Linux & Waybar' },
  { id: 'performance', icon: '⚡', label: 'Performance' },
  { id: 'plugins', icon: '🧩', label: 'Plugins' },
  { id: 'privacy', icon: '🔒', label: 'Privacy Center' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
];

export default function Sidebar({ currentPage, onNavigate, onOpenCommandPalette }: SidebarProps) {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h1>🐾 Bubu V2</h1>
        <div className="subtitle">Desktop Companion Ecosystem</div>
        <button
          onClick={onOpenCommandPalette}
          style={{
            marginTop: '12px',
            width: '100%',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-secondary)',
            fontSize: '11px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <span>🔍 Quick Action</span>
          <kbd style={{ backgroundColor: 'rgba(0,0,0,0.06)', padding: '2px 4px', borderRadius: '4px' }}>Ctrl+K</kbd>
        </button>
      </div>
      {navItems.map(item => (
        <div
          key={item.id}
          className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
          onClick={() => onNavigate(item.id)}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && onNavigate(item.id)}
        >
          <span className="icon">{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </nav>
  );
}
