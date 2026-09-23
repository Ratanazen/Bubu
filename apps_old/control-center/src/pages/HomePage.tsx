import React from 'react';
import { House, Eye, EyeOff, Pause, Clapperboard, Moon, Music2, Globe, Bell, Monitor } from 'lucide-react';

export default function HomePage() {
    return (
        <div>
            <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <House size={20} aria-hidden="true" /> Home
            </h2>

            <div className="grid grid-2">
                <div className="card" style={{ gridColumn: 'span 2', textAlign: 'center' }}>
                    <div className="bubu-preview"></div>
                    <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>Bubu</h3>
                    <span className="badge badge-success">● Online</span>
                    <div className="quick-actions" style={{ justifyContent: 'center', marginTop: '16px' }}>
                        <button className="btn btn-primary" title="Show Bubu" aria-label="Show Bubu">
                            <Eye size={14} aria-hidden="true" /> Show
                        </button>
                        <button className="btn btn-secondary" title="Hide Bubu" aria-label="Hide Bubu">
                            <EyeOff size={14} aria-hidden="true" /> Hide
                        </button>
                        <button className="btn btn-secondary" title="Pause Bubu" aria-label="Pause Bubu">
                            <Pause size={14} aria-hidden="true" /> Pause
                        </button>
                        <button className="btn btn-primary" title="Dance" aria-label="Dance">
                            <Clapperboard size={14} aria-hidden="true" /> Dance
                        </button>
                        <button className="btn btn-ghost" title="Sleep" aria-label="Sleep">
                            <Moon size={14} aria-hidden="true" /> Sleep
                        </button>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Status</span>
                        <span className="badge badge-success">Active</span>
                    </div>
                    <div className="status-row">
                        <span className="status-label">Activity</span>
                        <span className="status-value">Idle</span>
                    </div>
                    <div className="status-row">
                        <span className="status-label">Mood</span>
                        <span className="status-value">Happy</span>
                    </div>
                    <div className="status-row">
                        <span className="status-label">Skin</span>
                        <span className="status-value">Default</span>
                    </div>
                    <div className="status-row">
                        <span className="status-label">Style</span>
                        <span className="status-value">Cute</span>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Music2 size={14} aria-hidden="true" /> Music
                        </span>
                        <span className="badge badge-warning">Not Playing</span>
                    </div>
                    <div className="status-row">
                        <span className="status-label">Song</span>
                        <span className="status-value">—</span>
                    </div>
                    <div className="status-row">
                        <span className="status-label">Artist</span>
                        <span className="status-value">—</span>
                    </div>
                    <div className="status-row">
                        <span className="status-label">Lyrics</span>
                        <span className="status-value">—</span>
                    </div>
                    <div style={{ marginTop: '12px' }}>
                        <button className="btn btn-ghost" style={{ width: '100%' }}>Open Lyrics</button>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Globe size={14} aria-hidden="true" /> Browser
                        </span>
                        <span className="badge badge-error">Disconnected</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                        Install the Bubu browser extension to enable music detection and lyrics.
                    </p>
                    <button className="btn btn-secondary" style={{ width: '100%' }}>Install Extension</button>
                </div>

                <div className="card">
                    <div className="card-header">
                        <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Bell size={14} aria-hidden="true" /> Notifications
                        </span>
                        <span className="badge badge-info">0</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        No recent notifications.
                    </p>
                </div>

                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <div className="card-header">
                        <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Monitor size={14} aria-hidden="true" /> System
                        </span>
                    </div>
                    <div className="grid grid-3">
                        <div className="status-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                            <span className="status-label">Platform</span>
                            <span className="status-value">Linux</span>
                        </div>
                        <div className="status-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                            <span className="status-label">Desktop</span>
                            <span className="status-value">Hyprland</span>
                        </div>
                        <div className="status-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                            <span className="status-label">Session</span>
                            <span className="status-value">Wayland</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
