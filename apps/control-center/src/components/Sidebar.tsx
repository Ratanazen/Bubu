import React from 'react';
import {
  Code,
  Download,
  House, Clapperboard, Shirt, UserRound, Music2,
  LayoutGrid, Monitor, Activity, Settings, Search,
  Zap, Power, Target
} from 'lucide-react';
import {
  PetIcon } from './Icons';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenCommandPalette: () => void;
}

const navItems = [
  { id: 'home',         Icon: House,        label: 'Home' },
  { id: 'context',      Icon: Target,       label: 'Context & Profiles' },
  { id: 'animations',   Icon: Clapperboard, label: 'Animation Studio' },
  { id: 'styles',       Icon: Shirt,        label: 'Skins & Styles' },
  { id: 'character',    Icon: UserRound,    label: 'Character Studio' },
  { id: 'music',        Icon: Music2,       label: 'Music & Lyrics' },
  { id: 'integrations', Icon: LayoutGrid,   label: 'Linux & Waybar' },
  { id: 'screen',       Icon: Monitor,      label: 'Screen & Monitors' },
  { id: 'diagnostics',  Icon: Activity,     label: 'Diagnostics' },
  { id: 'developer',    Icon: Code,         label: 'Developer Panel' },
  { id: 'settings',     Icon: Settings,     label: 'Settings' },
  { id: 'updates',      Icon: Download,     label: 'Updates' },
];

export default function Sidebar({ currentPage, onNavigate, onOpenCommandPalette }: SidebarProps) {
  return (
    <nav
      role="navigation"
      aria-label="Bubu Control Center navigation"
      style={{
        width: '240px',
        height: '100%',
        backgroundColor: '#0f172a',
        borderRight: '1px solid #1e293b',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {/* Header / Brand */}
      <div style={{
        padding: '18px 16px',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <PetIcon size={18} color="#fff" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '15px', color: '#f8fafc', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Bubu V5
          </div>
          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '1px' }}>
            Editable Character Platform
          </div>
        </div>
      </div>

      {/* Quick Search / Command Palette */}
      <div style={{ padding: '12px 14px' }}>
        <button
          onClick={onOpenCommandPalette}
          aria-label="Open command palette (Ctrl+K)"
          title="Quick search — Ctrl+K"
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
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Search size={13} color="#64748b" aria-hidden="true" />
            <span>Quick search…</span>
          </div>
          <kbd style={{
            background: '#0f172a',
            padding: '2px 5px',
            borderRadius: '4px',
            fontSize: '10px',
            color: '#60a5fa',
            fontFamily: 'monospace',
          }}>Ctrl+K</kbd>
        </button>
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 12px 8px' }}>
        {navItems.map(({ id, Icon, label }) => {
          const isActive = currentPage === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              title={label}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                margin: '2px 0',
                border: 'none',
                borderRadius: '8px',
                background: isActive
                  ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
                  : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                fontWeight: isActive ? 600 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '0 2px 8px rgba(99,102,241,0.35)' : 'none',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background = '#1e293b';
                  (e.currentTarget as HTMLButtonElement).style.color = '#e2e8f0';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8';
                }
              }}
            >
              <Icon
                size={16}
                color={isActive ? '#fff' : '#64748b'}
                aria-hidden="true"
                style={{ flexShrink: 0 }}
              />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer status */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid #1e293b',
        fontSize: '11px',
        color: '#64748b',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Monitor size={11} color="#64748b" aria-hidden="true" />
          <span>Linux · Wayland · Hyprland</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#10b981' }}>
          <Zap size={11} color="#10b981" aria-hidden="true" />
          <span>Pet Connected</span>
        </div>
      </div>
    </nav>
  );
}
