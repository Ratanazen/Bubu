import React from 'react';
import { 
    HomeIcon, PetIcon, ScreenIcon, MonitorIcon, WorkspaceIcon, 
    WindowIcon, CompositorIcon, WaybarIcon, CharacterIcon, AnimationIcon, 
    StyleIcon, MusicIcon, NotificationIcon, BrowserIcon, IntegrationIcon, 
    CliIcon, DiagnosticIcon, SettingsIcon, SearchIcon 
} from './Icons';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenCommandPalette: () => void;
}

const navItems = [
  { id: 'home', icon: HomeIcon, label: 'Home' },
  { id: 'animations', icon: AnimationIcon, label: 'Animation Studio' },
  { id: 'styles', icon: StyleIcon, label: 'Skins & Styles' },
  { id: 'character', icon: CharacterIcon, label: 'Character Studio' },
  { id: 'music', icon: MusicIcon, label: 'Music & Lyrics' },
  { id: 'integrations', icon: IntegrationIcon, label: 'Linux & Waybar' },
  { id: 'screen', icon: ScreenIcon, label: 'Screen & Monitors' },
  { id: 'diagnostics', icon: DiagnosticIcon, label: 'Diagnostics' },
  { id: 'settings', icon: SettingsIcon, label: 'Settings' },
];

export default function Sidebar({ currentPage, onNavigate, onOpenCommandPalette }: SidebarProps) {
  return (
    <nav style={{
      width: '240px',
      height: '100%',
      backgroundColor: '#0f172a',
      borderRight: '1px solid #1e293b',
      display: 'flex',
      flexDirection: 'column',
      userSelect: 'none'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 16px',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span style={{ fontSize: '24px' }}>🐾</span>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#f8fafc', letterSpacing: '-0.02em' }}>Bubu V5</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Editable Character Platform</div>
        </div>
      </div>

      {/* Quick Search / Command Palette Bar */}
      <div style={{ padding: '12px 14px' }}>
        <button 
          onClick={onOpenCommandPalette}
          style={{
            width: '100%',
            background: '#1e293b',
            border: '1px solid #334155',
            color: '#94a3b8',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <SearchIcon size={14} color="#64748b" />
            <span>Quick search...</span>
          </div>
          <kbd style={{ background: '#0f172a', padding: '2px 5px', borderRadius: '4px', fontSize: '10px', color: '#60a5fa' }}>Ctrl+K</kbd>
        </button>
      </div>

      {/* Navigation Links */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 12px 8px' }}>
        {navItems.map((item) => {
          const IconComp = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                margin: '2px 0',
                border: 'none',
                borderRadius: '8px',
                background: isActive ? '#3b82f6' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                fontWeight: isActive ? 600 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}>
              <IconComp size={16} color={isActive ? '#ffffff' : '#64748b'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer info */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid #1e293b', fontSize: '11px', color: '#64748b' }}>
        <div>System: Linux Wayland</div>
        <div style={{ color: '#10b981', marginTop: '2px' }}>● Pet Connected</div>
      </div>
    </nav>
  );
}
