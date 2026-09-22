import React, { useState } from 'react';
import { Target, Plus, Save, MonitorPlay, Code, TerminalSquare, Globe, Music, Gamepad2, AlignJustify } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  app: string;
  style: string;
  animation: string;
  position: string;
  notifications: string;
  priority: number;
  icon: React.ReactNode;
}

const DEFAULT_PROFILES: Profile[] = [
  { id: '1', name: 'Coding Mode', app: 'VS Code, Cursor, JetBrains', style: 'Focus', animation: 'Thinking', position: 'Bottom Right', notifications: 'Minimal', priority: 70, icon: <Code size={18} /> },
  { id: '2', name: 'Terminal Mode', app: 'Alacritty, Kitty, Windows Terminal', style: 'Hacker', animation: 'Working', position: 'Bottom Left', notifications: 'On', priority: 60, icon: <TerminalSquare size={18} /> },
  { id: '3', name: 'Browser Mode', app: 'Chrome, Firefox, Brave', style: 'Default', animation: 'Idle', position: 'Bottom Right', notifications: 'Normal', priority: 50, icon: <Globe size={18} /> },
  { id: '4', name: 'Music Mode', app: 'Spotify, YouTube Music', style: 'Vibrant', animation: 'Dancing', position: 'Bottom Right', notifications: 'Normal', priority: 65, icon: <Music size={18} /> },
  { id: '5', name: 'Game Mode', app: 'Steam, Fullscreen Apps', style: 'Hidden', animation: 'None', position: 'Hidden', notifications: 'Off', priority: 100, icon: <Gamepad2 size={18} /> },
];

export default function ContextPage() {
  const [profiles, setProfiles] = useState<Profile[]>(DEFAULT_PROFILES);
  const [activeProfile, setActiveProfile] = useState<string>('1');

  const selectedProfile = profiles.find(p => p.id === activeProfile);

  return (
    <div style={{ padding: '24px', color: '#f8fafc', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Target size={24} color="#3b82f6" aria-hidden="true" />
            Smart Context &amp; App Profiles
          </h1>
          <p style={{ color: '#94a3b8', margin: '6px 0 0 0', fontSize: '14px' }}>
            Bubu automatically adapts to the application you are currently using based on these rules.
          </p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={14} /> New Profile
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
        {/* Profile List */}
        <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', paddingLeft: '8px' }}>
            Priority Rules (Highest Wins)
          </div>
          {profiles.sort((a, b) => b.priority - a.priority).map((profile) => (
            <div 
              key={profile.id}
              onClick={() => setActiveProfile(profile.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '10px',
                background: activeProfile === profile.id ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                border: activeProfile === profile.id ? '1px solid #3b82f6' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ color: activeProfile === profile.id ? '#60a5fa' : '#94a3b8' }}>
                {profile.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: activeProfile === profile.id ? '#f8fafc' : '#cbd5e1' }}>
                  {profile.name}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Priority: {profile.priority}</div>
              </div>
              <div style={{ color: '#475569', cursor: 'grab' }} title="Drag to reorder">
                <AlignJustify size={14} />
              </div>
            </div>
          ))}
        </div>

        {/* Profile Editor */}
        {selectedProfile && (
          <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: '#0f172a', padding: '10px', borderRadius: '10px', color: '#60a5fa' }}>
                  {selectedProfile.icon}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px', color: '#f8fafc' }}>{selectedProfile.name}</h2>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>Edit contextual behaviors for this profile</div>
                </div>
              </div>
              <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Save size={14} /> Save Changes
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px', fontWeight: 'bold' }}>Target Applications (Regex or App Name)</label>
                <input 
                  type="text" 
                  defaultValue={selectedProfile.app} 
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #475569', borderRadius: '8px', color: '#f8fafc' }} 
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px', fontWeight: 'bold' }}>Priority Score (0-100)</label>
                <input 
                  type="number" 
                  defaultValue={selectedProfile.priority} 
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #475569', borderRadius: '8px', color: '#f8fafc' }} 
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px', fontWeight: 'bold' }}>Bubu Style</label>
                <select style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #475569', borderRadius: '8px', color: '#f8fafc' }} defaultValue={selectedProfile.style}>
                  <option>Default</option>
                  <option>Focus</option>
                  <option>Hacker</option>
                  <option>Vibrant</option>
                  <option>Hidden</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px', fontWeight: 'bold' }}>Default Animation</label>
                <select style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #475569', borderRadius: '8px', color: '#f8fafc' }} defaultValue={selectedProfile.animation}>
                  <option>Idle</option>
                  <option>Thinking</option>
                  <option>Working</option>
                  <option>Dancing</option>
                  <option>None</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px', fontWeight: 'bold' }}>Position Override</label>
                <select style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #475569', borderRadius: '8px', color: '#f8fafc' }} defaultValue={selectedProfile.position}>
                  <option>Keep Current</option>
                  <option>Bottom Right</option>
                  <option>Bottom Left</option>
                  <option>Top Right</option>
                  <option>Hidden</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px', fontWeight: 'bold' }}>Notification Volume</label>
                <select style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #475569', borderRadius: '8px', color: '#f8fafc' }} defaultValue={selectedProfile.notifications}>
                  <option>Normal (All)</option>
                  <option>Minimal (Mentions Only)</option>
                  <option>Off (Do Not Disturb)</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #334155' }}>
              <h3 style={{ fontSize: '14px', color: '#f8fafc', marginBottom: '12px' }}>Advanced Integrations</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#0f172a', borderRadius: '8px', border: '1px solid #334155', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Show Terminal Map / Activity View</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Show a diagnostic widget when terminal apps are active (Rule 76)</div>
                </div>
                <input type="checkbox" defaultChecked={selectedProfile.id === '2'} style={{ transform: 'scale(1.2)' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#0f172a', borderRadius: '8px', border: '1px solid #334155', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Enable Command Awareness</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>React to git, npm, cargo, docker commands without recording secrets (Rule 77)</div>
                </div>
                <input type="checkbox" defaultChecked={selectedProfile.id === '2' || selectedProfile.id === '1'} style={{ transform: 'scale(1.2)' }} />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#0f172a', borderRadius: '8px', border: '1px solid #334155' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Reduce Opacity (Focus Mode)</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Make Bubu semi-transparent when the app is maximized</div>
                </div>
                <input type="checkbox" defaultChecked={selectedProfile.id === '1' || selectedProfile.id === '5'} style={{ transform: 'scale(1.2)' }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
