import React, { useState } from 'react';
import { Monitor, Check, Copy } from 'lucide-react';

export default function LinuxPage() {
    const [copied, setCopied] = useState<string | null>(null);

    const waybarConfig = `{
  "custom/bubu": {
    "exec": "bubu waybar",
    "return-type": "json",
    "interval": 1,
    "on-click": "bubu pet show",
    "on-click-right": "bubu pet hide",
    "tooltip": true
  }
}`;

    const hyprlandConfig = `# BUBU MANAGED START
windowrulev2 = float, class:^(bubu-desktop)$
windowrulev2 = pin, class:^(bubu-desktop)$
windowrulev2 = noblur, class:^(bubu-desktop)$
windowrulev2 = nofocus, class:^(bubu-desktop)$
windowrulev2 = nodim, class:^(bubu-desktop)$
# BUBU MANAGED END`;

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(null), 2500);
    };

    return (
        <div style={{ padding: '24px', color: '#f8fafc', maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Monitor size={24} aria-hidden="true" />
                        Linux Integration — All-in-One Desktop Control
                    </h1>
                    <p style={{ color: '#94a3b8', margin: '6px 0 0 0', fontSize: '14px' }}>
                        Live compositor inspection, Wayland capabilities, and one-click configuration integration.
                    </p>
                </div>
                {copied && (
                    <div style={{ background: '#10b981', color: '#fff', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Check size={14} aria-hidden="true" /> Copied {copied}!
                    </div>
                )}
            </div>

            {/* System Info & Capabilities */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#1e293b', padding: '18px', borderRadius: '14px', border: '1px solid #334155' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#60a5fa' }}>System Info</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #334155', fontSize: '13px' }}>
                        <span style={{ color: '#94a3b8' }}>Session Type:</span>
                        <strong style={{ color: '#f8fafc' }}>Wayland</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #334155', fontSize: '13px' }}>
                        <span style={{ color: '#94a3b8' }}>Desktop:</span>
                        <strong style={{ color: '#f8fafc' }}>Hyprland</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px' }}>
                        <span style={{ color: '#94a3b8' }}>Compositor:</span>
                        <strong style={{ color: '#10b981' }}>Hyprland (Active)</strong>
                    </div>
                </div>

                <div style={{ background: '#1e293b', padding: '18px', borderRadius: '14px', border: '1px solid #334155' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#60a5fa' }}>Capabilities</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #334155', fontSize: '13px' }}>
                        <span style={{ color: '#94a3b8' }}>Transparent Window:</span>
                        <span style={{ color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={13} aria-hidden="true" /> Supported</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #334155', fontSize: '13px' }}>
                        <span style={{ color: '#94a3b8' }}>Always On Top:</span>
                        <span style={{ color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={13} aria-hidden="true" /> Supported</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #334155', fontSize: '13px' }}>
                        <span style={{ color: '#94a3b8' }}>System Tray:</span>
                        <span style={{ color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={13} aria-hidden="true" /> Supported</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px' }}>
                        <span style={{ color: '#94a3b8' }}>Global Shortcuts:</span>
                        <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>Limited</span>
                    </div>
                </div>
            </div>

            {/* Desktop Environment Integrations Matrix */}
            <div style={{ background: '#1e293b', padding: '20px', borderRadius: '14px', border: '1px solid #334155', marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Desktop Environment Integrations</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    <div style={{ background: '#0f172a', padding: '12px', borderRadius: '10px', border: '1px solid #3b82f6' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Waybar</div>
                        <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>● Available</div>
                    </div>
                    <div style={{ background: '#0f172a', padding: '12px', borderRadius: '10px', border: '1px solid #3b82f6' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Hyprland</div>
                        <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>● Active</div>
                    </div>
                    <div style={{ background: '#0f172a', padding: '12px', borderRadius: '10px', border: '1px solid #334155', opacity: 0.6 }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Sway</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>○ Not Detected</div>
                    </div>
                    <div style={{ background: '#0f172a', padding: '12px', borderRadius: '10px', border: '1px solid #334155', opacity: 0.6 }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Niri</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>○ Not Detected</div>
                    </div>
                    <div style={{ background: '#0f172a', padding: '12px', borderRadius: '10px', border: '1px solid #334155', opacity: 0.6 }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>i3</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>○ Not Detected</div>
                    </div>
                    <div style={{ background: '#0f172a', padding: '12px', borderRadius: '10px', border: '1px solid #334155', opacity: 0.6 }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>KDE Plasma</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>○ Not Detected</div>
                    </div>
                    <div style={{ background: '#0f172a', padding: '12px', borderRadius: '10px', border: '1px solid #334155', opacity: 0.6 }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>GNOME</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>○ Not Detected</div>
                    </div>
                    <div style={{ background: '#0f172a', padding: '12px', borderRadius: '10px', border: '1px solid #334155', opacity: 0.6 }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>XFCE</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>○ Not Detected</div>
                    </div>
                </div>
            </div>

            {/* All-in-One Configuration Blocks */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                {/* Waybar Block */}
                <div style={{ background: '#1e293b', padding: '20px', borderRadius: '14px', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px' }}>Waybar Configuration</h3>
                        <button
                            onClick={() => handleCopy(waybarConfig, 'Waybar JSON')}
                            style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                            Copy Configuration
                        </button>
                    </div>
                    <pre style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', fontSize: '12px', color: '#38bdf8', overflowX: 'auto', border: '1px solid #334155' }}>
                        {waybarConfig}
                    </pre>
                </div>

                {/* Hyprland Block */}
                <div style={{ background: '#1e293b', padding: '20px', borderRadius: '14px', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px' }}>Hyprland Window Rules</h3>
                        <button
                            onClick={() => handleCopy(hyprlandConfig, 'Hyprland Rules')}
                            style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                            Copy Configuration
                        </button>
                    </div>
                    <pre style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', fontSize: '12px', color: '#a78bfa', overflowX: 'auto', border: '1px solid #334155' }}>
                        {hyprlandConfig}
                    </pre>
                </div>
            </div>
        </div>
    );
}
