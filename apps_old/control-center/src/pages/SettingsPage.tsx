import React from 'react';
import { Settings, Save } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div>
            <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={20} aria-hidden="true" /> Settings
            </h2>

            <div className="card">
                <div className="card-title" style={{ marginBottom: '12px' }}>General</div>
                <div className="status-row">
                    <span className="status-label">Always on Top</span>
                    <div className="toggle active" />
                </div>
                <div className="status-row">
                    <span className="status-label">Start with OS</span>
                    <div className="toggle" />
                </div>
                <div className="status-row">
                    <span className="status-label">Reduce Motion</span>
                    <div className="toggle" />
                </div>
            </div>

            <div className="card">
                <div className="card-title" style={{ marginBottom: '12px' }}>Appearance</div>
                <div className="status-row">
                    <span className="status-label">Theme</span>
                    <select style={{ width: '150px' }}>
                        <option>System</option>
                        <option>Light</option>
                        <option>Dark</option>
                    </select>
                </div>
                <div className="status-row">
                    <span className="status-label">Pet Size</span>
                    <input type="range" min="50" max="200" defaultValue="100" style={{ width: '150px' }} />
                </div>
                <div className="status-row">
                    <span className="status-label">Opacity</span>
                    <input type="range" min="30" max="100" defaultValue="100" style={{ width: '150px' }} />
                </div>
            </div>

            <div className="card">
                <div className="card-title" style={{ marginBottom: '12px' }}>Behavior</div>
                <div className="status-row">
                    <span className="status-label">Personality</span>
                    <select style={{ width: '150px' }}>
                        <option>Cute</option>
                        <option>Calm</option>
                        <option>Energetic</option>
                        <option>Sleepy</option>
                        <option>Playful</option>
                        <option>Focus</option>
                        <option>Shy</option>
                        <option>Curious</option>
                    </select>
                </div>
                <div className="status-row">
                    <span className="status-label">Movement Speed</span>
                    <input type="range" min="1" max="10" defaultValue="5" style={{ width: '150px' }} />
                </div>
                <div className="status-row">
                    <span className="status-label">Activity Level</span>
                    <input type="range" min="1" max="10" defaultValue="5" style={{ width: '150px' }} />
                </div>
            </div>

            <div className="card">
                <div className="card-title" style={{ marginBottom: '12px' }}>Desktop</div>
                <div className="status-row">
                    <span className="status-label">Enable Dragging</span>
                    <input 
                        type="checkbox" 
                        defaultChecked={true} 
                        onChange={async (e) => {
                            const current = await (window as any).electronAPI.getSettings();
                            current.dragEnabled = e.target.checked;
                            await (window as any).electronAPI.saveSettings(current);
                            const event = new CustomEvent('settings-updated', { detail: current });
                            window.dispatchEvent(event);
                        }}
                    />
                </div>
                <div className="status-row">
                    <span className="status-label">Position</span>
                    <select style={{ width: '150px' }}>
                        <option>Free Movement</option>
                        <option>Bottom</option>
                        <option>Bottom Left</option>
                        <option>Bottom Right</option>
                        <option>Top Left</option>
                        <option>Top Right</option>
                    </select>
                </div>
                <div className="status-row">
                    <span className="status-label">Monitor</span>
                    <select style={{ width: '150px' }}>
                        <option>Primary</option>
                        <option>Follow Active</option>
                    </select>
                </div>
                <div className="status-row">
                    <span className="status-label">Game Mode</span>
                    <select style={{ width: '150px' }}>
                        <option>Hide Bubu</option>
                        <option>Keep Visible</option>
                        <option>Move to Other Monitor</option>
                        <option>Pause Animations</option>
                    </select>
                </div>
            </div>

            <div className="card">
                <div className="card-title" style={{ marginBottom: '12px' }}>Keyboard Shortcuts</div>
                <div className="status-row">
                    <span className="status-label">Show/Hide Bubu</span>
                    <span className="status-value" style={{ fontFamily: 'monospace', fontSize: '12px' }}>Ctrl+Shift+B</span>
                </div>
                <div className="status-row">
                    <span className="status-label">Show Lyrics</span>
                    <span className="status-value" style={{ fontFamily: 'monospace', fontSize: '12px' }}>Ctrl+Shift+L</span>
                </div>
                <div className="status-row">
                    <span className="status-label">Pause</span>
                    <span className="status-value" style={{ fontFamily: 'monospace', fontSize: '12px' }}>Ctrl+Shift+P</span>
                </div>
                <div className="status-row">
                    <span className="status-label">Dance</span>
                    <span className="status-value" style={{ fontFamily: 'monospace', fontSize: '12px' }}>Ctrl+Shift+D</span>
                </div>
            </div>

            <div className="card">
                <div className="card-title" style={{ marginBottom: '12px' }}>Data</div>
                <div className="quick-actions">
                    <button className="btn btn-ghost">Export Bubu</button>
                    <button className="btn btn-ghost">Import Bubu</button>
                    <button className="btn btn-ghost" title="Backup settings" aria-label="Backup settings">
                        <Save size={14} aria-hidden="true" /> Backup
                    </button>
                    <button className="btn btn-ghost">Restore</button>
                    <button className="btn btn-ghost">Export Logs</button>
                </div>
            </div>
        </div>
    );
}
