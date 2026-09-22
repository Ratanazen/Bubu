import React, { useState } from 'react';

export default function HomeDashboard() {
    const [bubuStatus, setBubuStatus] = useState<'running' | 'hidden' | 'stopped'>('running');
    const [currentStyle, setCurrentStyle] = useState('Cyberpunk Neon');
    const [currentAnchor, setCurrentAnchor] = useState('Bottom Right');
    const [statusMsg, setStatusMsg] = useState<string | null>(null);

    const triggerAction = (msg: string, stateUpdate?: () => void) => {
        if (stateUpdate) stateUpdate();
        setStatusMsg(msg);
        setTimeout(() => setStatusMsg(null), 3000);
    };

    const handleRunShow = () => {
        triggerAction('🐾 Bubu Desktop Pet is now Visible and Active on Screen!', () => setBubuStatus('running'));
    };

    const handleHide = () => {
        triggerAction('🙈 Bubu Pet Window Hidden.', () => setBubuStatus('hidden'));
    };

    const handleExit = () => {
        triggerAction('🛑 Bubu Desktop Pet Terminated cleanly.', () => setBubuStatus('stopped'));
    };

    const handleMoveLocation = (locName: string) => {
        setCurrentAnchor(locName);
        triggerAction(`📍 Bubu smoothly moved to: ${locName}`);
    };

    const handleQuickStyle = (styleName: string) => {
        setCurrentStyle(styleName);
        triggerAction(`🎨 EZ Style applied: ${styleName}`);
    };

    const ezStyles = [
        { name: 'Original Bear', color: '#f59e0b', bg: '#78350f', desc: 'Classic warm aesthetic' },
        { name: 'Cyberpunk Neon', color: '#38bdf8', bg: '#0369a1', desc: 'Futuristic glowing neon' },
        { name: 'Kawaii Pastel', color: '#f472b6', bg: '#831843', desc: 'Pink anime cute theme' },
        { name: 'Pixel Arcade', color: '#4ade80', bg: '#14532d', desc: '8-bit retro arcade' },
        { name: 'Minimal Dark', color: '#cbd5e1', bg: '#1e293b', desc: 'Monochrome sleek dark' },
        { name: 'Glass Frosted', color: '#c084fc', bg: '#581c87', desc: 'Translucent glass shine' }
    ];

    return (
        <div style={{ padding: '24px', color: '#f8fafc', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {/* Header with Live Status Notification */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '26px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        🐾 Bubu V5 EZ Control Panel
                        <span style={{ 
                            fontSize: '12px', 
                            background: bubuStatus === 'running' ? '#10b981' : bubuStatus === 'hidden' ? '#f59e0b' : '#ef4444', 
                            color: '#fff', 
                            padding: '4px 10px', 
                            borderRadius: '12px', 
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                        }}>
                            {bubuStatus}
                        </span>
                    </h1>
                    <p style={{ color: '#94a3b8', margin: '4px 0 0 0', fontSize: '14px' }}>
                        Quick launcher, one-click position switcher, and instant EZ color style customizer.
                    </p>
                </div>
                {statusMsg && (
                    <div style={{ background: '#3b82f6', color: '#fff', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)' }}>
                        ✓ {statusMsg}
                    </div>
                )}
            </div>

            {/* 1. MASTER POWER & VISIBILITY CONTROLS */}
            <div style={{ background: '#1e293b', padding: '20px', borderRadius: '16px', border: '1px solid #334155', marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#60a5fa' }}>⚡ Master Pet Controls</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    <button 
                        onClick={handleRunShow}
                        style={{ 
                            background: 'linear-gradient(135deg, #10b981, #059669)', 
                            color: '#fff', 
                            border: 'none', 
                            padding: '14px 24px', 
                            borderRadius: '10px', 
                            fontWeight: 'bold', 
                            fontSize: '14px', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                        }}>
                        ▶️ Run & Show Bubu
                    </button>

                    <button 
                        onClick={handleHide}
                        style={{ 
                            background: '#334155', 
                            color: '#f8fafc', 
                            border: '1px solid #475569', 
                            padding: '14px 20px', 
                            borderRadius: '10px', 
                            fontWeight: 'bold', 
                            fontSize: '14px', 
                            cursor: 'pointer' 
                        }}>
                        🙈 Hide Window
                    </button>

                    <button 
                        onClick={handleExit}
                        style={{ 
                            background: '#ef4444', 
                            color: '#fff', 
                            border: 'none', 
                            padding: '14px 20px', 
                            borderRadius: '10px', 
                            fontWeight: 'bold', 
                            fontSize: '14px', 
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                        }}>
                        🛑 Exit / Close Bubu
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                {/* 2. EZ POSITION & LOCATION SWITCHER */}
                <div style={{ background: '#1e293b', padding: '20px', borderRadius: '16px', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', color: '#60a5fa' }}>📍 Change Bubu Location</h3>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Current: <strong style={{ color: '#38bdf8' }}>{currentAnchor}</strong></span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        {[
                            'Top Left', 'Top Center', 'Top Right',
                            'Center Left', 'Center Screen', 'Center Right',
                            'Bottom Left', 'Bottom Center', 'Bottom Right'
                        ].map(pos => (
                            <button
                                key={pos}
                                onClick={() => handleMoveLocation(pos)}
                                style={{
                                    padding: '14px 8px',
                                    background: currentAnchor === pos ? '#3b82f6' : '#0f172a',
                                    color: '#fff',
                                    border: currentAnchor === pos ? '2px solid #60a5fa' : '1px solid #334155',
                                    borderRadius: '10px',
                                    fontWeight: 'bold',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s'
                                }}>
                                {pos}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. EZ STYLES & COLOR THEMES */}
                <div style={{ background: '#1e293b', padding: '20px', borderRadius: '16px', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', color: '#60a5fa' }}>🎨 EZ Styles & Themes</h3>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Active: <strong style={{ color: '#f472b6' }}>{currentStyle}</strong></span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                        {ezStyles.map(st => (
                            <div
                                key={st.name}
                                onClick={() => handleQuickStyle(st.name)}
                                style={{
                                    padding: '12px',
                                    background: currentStyle === st.name ? 'rgba(59, 130, 246, 0.2)' : '#0f172a',
                                    border: currentStyle === st.name ? '2px solid #3b82f6' : '1px solid #334155',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s'
                                }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: st.color }}></span>
                                    <strong style={{ fontSize: '13px', color: currentStyle === st.name ? '#60a5fa' : '#f8fafc' }}>{st.name}</strong>
                                </div>
                                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{st.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. SYSTEM INFO & WAYLAND/HYPRLAND INTEGRATION */}
            <div style={{ background: '#1e293b', padding: '16px 20px', borderRadius: '14px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#94a3b8' }}>
                <div>🐧 <strong>System:</strong> Linux Wayland (Hyprland) • <strong>Waybar:</strong> Active Stream • <strong>IPC:</strong> Connected</div>
                <div>Installed in <code>~/.local/bin/bubu-desktop-pet</code></div>
            </div>
        </div>
    );
}
