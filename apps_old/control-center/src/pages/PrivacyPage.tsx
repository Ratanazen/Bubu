import React, { useState } from 'react';
import { ShieldCheck, MessageCircle, Globe as BrowserIcon, Code as NotionIcon, X, Settings2 } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
  permissions: string[];
  dataUsed: string;
  storage: string;
  lastActivity: string;
}

const DEFAULT_INTEGRATIONS: Integration[] = [
  {
    id: 'telegram',
    name: 'Telegram (Local App)',
    icon: <MessageCircle size={18} />,
    enabled: true,
    permissions: ['Show sender name', 'Show message preview', 'Show group name'],
    dataUsed: 'Notification metadata via OS APIs',
    storage: 'Not stored (Memory only)',
    lastActivity: '2 mins ago',
  },
  {
    id: 'browser',
    name: 'Browser Extension',
    icon: <BrowserIcon size={18} />,
    enabled: false,
    permissions: ['Read media session', 'Fetch lyrics'],
    dataUsed: 'Active tab URL (only for whitelisted media sites)',
    storage: 'Not stored',
    lastActivity: 'Never',
  },
  {
    id: 'notion',
    name: 'Notion Desktop',
    icon: <NotionIcon size={18} />,
    enabled: true,
    permissions: ['Detect focus state'],
    dataUsed: 'Window title (Workspace name)',
    storage: 'Not stored',
    lastActivity: '1 hour ago',
  }
];

export default function PrivacyPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(DEFAULT_INTEGRATIONS);
  const [showSettingsFor, setShowSettingsFor] = useState<string | null>(null);

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, enabled: !i.enabled } : i));
  };

  return (
    <div style={{ padding: '24px', color: '#f8fafc', maxWidth: '1000px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={24} color="#10b981" aria-hidden="true" />
            Privacy Center &amp; Integrations
          </h1>
          <p style={{ color: '#94a3b8', margin: '6px 0 0 0', fontSize: '14px' }}>
            Full transparency on what data Bubu accesses and uses to provide context-aware features.
          </p>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(to right, rgba(16, 185, 129, 0.1), transparent)', border: '1px solid #059669', borderRadius: '16px', padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <ShieldCheck size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ color: '#10b981', display: 'block', marginBottom: '4px' }}>Bubu is privacy-first.</strong>
          <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
            All processing happens locally on your device. No passwords, screen recordings, microphone input, private messages, or browser history are ever collected. You have full control over every feature.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {integrations.map((integration) => (
          <div key={integration.id} style={{ background: '#1e293b', border: `1px solid ${integration.enabled ? '#3b82f6' : '#334155'}`, borderRadius: '16px', padding: '20px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ color: integration.enabled ? '#3b82f6' : '#64748b', background: '#0f172a', padding: '8px', borderRadius: '8px' }}>
                  {integration.icon}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#f8fafc' }}>{integration.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', marginTop: '4px', color: integration.enabled ? '#10b981' : '#64748b' }}>
                    <span style={{ fontSize: '10px' }}>●</span> {integration.enabled ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => toggleIntegration(integration.id)}
                style={{ background: integration.enabled ? '#ef4444' : '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {integration.enabled ? 'Disable' : 'Enable'}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '11px', textTransform: 'uppercase', marginBottom: '2px' }}>Permissions</span>
                <span style={{ color: '#cbd5e1' }}>{integration.permissions.length > 0 ? integration.permissions.join(', ') : 'None'}</span>
              </div>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '11px', textTransform: 'uppercase', marginBottom: '2px' }}>Data Used</span>
                <span style={{ color: '#cbd5e1' }}>{integration.dataUsed}</span>
              </div>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '11px', textTransform: 'uppercase', marginBottom: '2px' }}>Storage</span>
                <span style={{ color: '#cbd5e1' }}>{integration.storage}</span>
              </div>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '11px', textTransform: 'uppercase', marginBottom: '2px' }}>Last Activity</span>
                <span style={{ color: '#cbd5e1' }}>{integration.lastActivity}</span>
              </div>
            </div>

            {integration.id === 'telegram' && integration.enabled && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #334155' }}>
                <button onClick={() => setShowSettingsFor('telegram')} style={{ background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center' }}>
                  <Settings2 size={14} /> Configure Telegram Granular Privacy
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showSettingsFor === 'telegram' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155', width: '400px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Telegram Privacy Settings</h3>
              <button onClick={() => setShowSettingsFor(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                'Show Telegram notifications',
                'Show sender name',
                'Show message preview',
                'Show group name',
                'Show media notifications',
                'Play notification sound',
                'Trigger Bubu animation'
              ].map((setting, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                  <span>{setting}</span>
                  <input type="checkbox" defaultChecked={idx < 5} style={{ transform: 'scale(1.2)' }} />
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', borderTop: '1px solid #334155', paddingTop: '16px', marginTop: '4px' }}>
                <span style={{ color: '#ef4444' }}>Store notification content</span>
                <input type="checkbox" defaultChecked={false} disabled style={{ transform: 'scale(1.2)' }} title="Permanently disabled by security policy" />
              </div>
            </div>

            <button onClick={() => setShowSettingsFor(null)} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '14px', width: '100%', marginTop: '24px', cursor: 'pointer', fontWeight: 'bold' }}>
              Save &amp; Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
