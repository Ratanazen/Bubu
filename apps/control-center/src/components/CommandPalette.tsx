import React, { useState, useEffect } from 'react';

export interface CommandItem {
  id: string;
  title: string;
  category: string;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export default function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
    { id: 'pet-show', title: 'Show Bubu', category: 'Pet', shortcut: 'Ctrl+Shift+B', action: () => alert('Bubu Shown') },
    { id: 'pet-hide', title: 'Hide Bubu', category: 'Pet', action: () => alert('Bubu Hidden') },
    { id: 'pet-dance', title: 'Dance Animation', category: 'Pet', shortcut: 'Ctrl+Shift+D', action: () => alert('Bubu is dancing!') },
    { id: 'pet-sleep', title: 'Sleep Animation', category: 'Pet', action: () => alert('Bubu is sleeping zzz') },
    { id: 'pet-pet', title: 'Pet Bubu (Affection)', category: 'Interaction', action: () => alert('Bubu purrs with happiness! 💖') },
    { id: 'nav-character', title: 'Open Character Studio', category: 'Navigation', action: () => { onNavigate('character'); onClose(); } },
    { id: 'nav-skins', title: 'Open Skin Library', category: 'Navigation', action: () => { onNavigate('skins'); onClose(); } },
    { id: 'nav-lyrics', title: 'Open Lyrics Window', category: 'Music', shortcut: 'Ctrl+Shift+L', action: () => { onNavigate('lyrics'); onClose(); } },
    { id: 'nav-performance', title: 'Open Performance Monitor', category: 'System', action: () => { onNavigate('performance'); onClose(); } },
    { id: 'nav-privacy', title: 'Open Privacy Center', category: 'Security', action: () => { onNavigate('privacy'); onClose(); } },
    { id: 'nav-plugins', title: 'Manage Plugins', category: 'Extensions', action: () => { onNavigate('plugins'); onClose(); } },
    { id: 'toggle-gamemode', title: 'Toggle Game Mode (Battery / Stealth)', category: 'Performance', action: () => alert('Game mode toggled!') },
  ];

  const filtered = commands.filter(cmd =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '80px',
      zIndex: 9999
    }} onClick={onClose}>
      <div style={{
        width: '560px',
        backgroundColor: 'var(--bg-secondary, #ffffff)',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
        border: '1px solid var(--border, #eee)',
        overflow: 'hidden'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border, #eee)' }}>
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search... (Esc to close)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '16px',
              backgroundColor: 'transparent',
              color: 'var(--text-primary, #333)'
            }}
          />
        </div>

        <div style={{ maxHeight: '320px', overflowY: 'auto', padding: '8px 0' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#999', fontSize: '13px' }}>
              No matching commands found.
            </div>
          ) : (
            filtered.map((cmd, idx) => (
              <div
                key={cmd.id}
                onClick={() => { cmd.action(); onClose(); }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 18px',
                  cursor: 'pointer',
                  backgroundColor: idx === selectedIndex ? 'var(--accent-light, #ffeae8)' : 'transparent',
                  color: idx === selectedIndex ? 'var(--accent, #ff9a94)' : 'inherit',
                  fontWeight: idx === selectedIndex ? 600 : 400
                }}
              >
                <div>
                  <span style={{ fontSize: '14px' }}>{cmd.title}</span>
                  <span style={{ fontSize: '11px', color: '#888', marginLeft: '10px' }}>({cmd.category})</span>
                </div>
                {cmd.shortcut && (
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(0,0,0,0.06)',
                    fontFamily: 'monospace'
                  }}>
                    {cmd.shortcut}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
