import React from 'react';

interface SidebarProps {
    currentPage: string;
    onNavigate: (page: string) => void;
}

const navItems = [
    { id: 'home', icon: '🐾', label: 'Home' },
    { id: 'character', icon: '🎨', label: 'Character' },
    { id: 'skins', icon: '🎭', label: 'Skins & Styles' },
    { id: 'music', icon: '🎵', label: 'Music' },
    { id: 'lyrics', icon: '🎤', label: 'Lyrics' },
    { id: 'browser', icon: '🌐', label: 'Browser' },
    { id: 'linux', icon: '🐧', label: 'Linux' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
    { id: 'privacy', icon: '🔒', label: 'Privacy' },
];

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
    return (
        <nav className="sidebar">
            <div className="sidebar-header">
                <h1>🐾 Bubu</h1>
                <div className="subtitle">Desktop Companion</div>
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
