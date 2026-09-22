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
  { id: 'pet', icon: PetIcon, label: 'Pet' },
  { id: 'screen', icon: ScreenIcon, label: 'Screen' },
  { id: 'monitors', icon: MonitorIcon, label: 'Monitors' },
  { id: 'workspaces', icon: WorkspaceIcon, label: 'Workspaces' },
  { id: 'windows', icon: WindowIcon, label: 'Windows' },
  { id: 'compositor', icon: CompositorIcon, label: 'Compositor' },
  { id: 'waybar', icon: WaybarIcon, label: 'Waybar' },
  { id: 'character', icon: CharacterIcon, label: 'Character' },
  { id: 'animations', icon: AnimationIcon, label: 'Animation' },
  { id: 'styles', icon: StyleIcon, label: 'Styles' },
  { id: 'music', icon: MusicIcon, label: 'Music' },
  { id: 'notifications', icon: NotificationIcon, label: 'Notifications' },
  { id: 'browser', icon: BrowserIcon, label: 'Browser' },
  { id: 'integrations', icon: IntegrationIcon, label: 'Integrations' },
  { id: 'cli', icon: CliIcon, label: 'CLI' },
  { id: 'diagnostics', icon: DiagnosticIcon, label: 'Diagnostics' },
  { id: 'settings', icon: SettingsIcon, label: 'Settings' },
];

export default function Sidebar({ currentPage, onNavigate, onOpenCommandPalette }: SidebarProps) {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h1>Bubu V4</h1>
        <div className="subtitle">Desktop Control System</div>
        <button
          onClick={onOpenCommandPalette}
          className="command-palette-btn"
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
          <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
            <SearchIcon width={14} height={14} /> Quick Action
          </span>
          <kbd style={{ backgroundColor: 'rgba(0,0,0,0.06)', padding: '2px 4px', borderRadius: '4px' }}>Ctrl+K</kbd>
        </button>
      </div>
      <div className="nav-items" style={{overflowY: 'auto', flex: 1}}>
        {navItems.map(item => {
            const Icon = item.icon;
            return (
                <div
                    key={item.id}
                    className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                    onClick={() => onNavigate(item.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && onNavigate(item.id)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 16px',
                        cursor: 'pointer',
                        color: currentPage === item.id ? 'var(--accent)' : 'var(--text-primary)'
                    }}
                >
                <Icon width={18} height={18} color={currentPage === item.id ? 'var(--accent)' : 'var(--text-secondary)'} />
                <span style={{ fontSize: '14px', fontWeight: currentPage === item.id ? 600 : 400 }}>{item.label}</span>
                </div>
            )
        })}
      </div>
    </nav>
  );
}
