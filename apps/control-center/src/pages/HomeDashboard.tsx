import React, { useState } from 'react';

export default function HomeDashboard() {
    const [bubuStatus, setBubuStatus] = useState<'running' | 'hidden' | 'stopped'>('running');
    const [currentStyle, setCurrentStyle] = useState('Cyberpunk Neon');
    const [currentLocation, setCurrentLocation] = useState('Bottom Right');
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

    const handleLocationClick = (locName: string) => {
        setCurrentLocation(locName);
        triggerAction(`📍 Click moved Bubu to: ${locName}`);
    };

    const handleQuickStyle = (styleName: string) => {
        setCurrentStyle(styleName);
        triggerAction(`🎨 Applied Style: ${styleName}`);
    };

    const locations = [
        { name: 'Top Left', icon: '↖️', desc: 'Screen Top-Left' },
        { name: 'Top Center', icon: '⬆️', desc: 'Screen Top-Center' },
        { name: 'Top Right', icon: '↗️', desc: 'Screen Top-Right' },
        { name: 'Center Left', icon: '⬅️', desc: 'Screen Middle-Left' },
        { name: 'Center Screen', icon: '🎯', desc: 'Exact Center' },
        { name: 'Center Right', icon: '➡️', desc: 'Screen Middle-Right' },
        { name: 'Bottom Left', icon: '↙️', desc: 'Screen Bottom-Left' },
        { name: 'Bottom Center', icon: '⬇️', desc: 'Screen Bottom-Center' },
        { name: 'Bottom Right', icon: '↘️', desc: 'Screen Bottom-Right' }
    ];

    const ezStyles = [
        { name: 'Original Bear', color: '#f59e0b', desc: 'Classic warm aesthetic' },
        { name: 'Cyberpunk Neon', color: '#38bdf8', desc: 'Futuristic glowing neon' },
        { name: 'Kawaii Pastel', color: '#f472b6', desc: 'Pink anime cute theme' },
        { name: 'Pixel Arcade', color: '#4ade80', desc: '8-bit retro arcade' },
        { name: 'Minimal Dark', color: '#cbd5e1', desc: 'Monochrome sleek dark' },
        { name: 'Glass Frosted', color: '#c084fc', desc: 'Translucent glass shine' }
    ];

    return (
        <div style={{ padding: '24px', color: '#f8fafc', maxWidth: '1100px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {/* Header with Live Status Notification */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '26px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        🐾 Bubu V5 One-Click Control Panel
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
                        One-click icon grid to instantly relocate Bubu anywhere on your desktop screen.
                    </p>
                </div>
                {statusMsg && (
                    <div style={{ background: '#3b82f6', color: '#fff', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)' }}>
                        ✓ {statusMsg}
                    </div>
                )}
            </div>

            {/* 1. MASTER POWER CONTROLS */}
            <div style={{ background: '#1e293b', padding: '18px 24px', borderRadius: '16px', border: '1px solid #334155', marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#60a5fa' }}>⚡ Master Pet Controls</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    <button 
                        onClick={handleRunShow}
                        style={{ 
                            background: 'linear-gradient(135deg, #10b981, #059669)', 
                            color: '#fff', 
                            border: 'none', 
                            padding: '12px 22px', 
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
                            padding: '12px 18px', 
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
                            padding: '12px 18px', 
                            borderRadius: '10px', 
                            fontWeight: 'bold', 
                            fontSize: '14px', 
                            cursor: 'pointer' 
                        }}>
                        🛑 Exit Pet
                    </button>
                </div>
            </div>

            {/* 2. ONE-CLICK ICON LOCATION SELECTOR */}
            <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '18px', color: '#f8fafc' }}>🖱️ Click Icon to Change Bubu Location</h2>
                        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>Click any direction icon below to instantly relocate Bubu to that spot on your screen.</p>
                    </div>
                    <div style={{ background: '#0f172a', padding: '6px 14px', borderRadius: '8px', border: '1px solid #334155', fontSize: '13px' }}>
                        Active: <strong style={{ color: '#38bdf8' }}>{currentLocation}</strong>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', maxWidth: '650px', margin: '0 auto' }}>
                    {locations.map(loc => {
                        const isSelected = currentLocation === loc.name;
                        return (
                            <button
                                key={loc.name}
                                onClick={() => handleLocationClick(loc.name)}
                                style={{
                                    padding: '20px 10px',
                                    background: isSelected ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#0f172a',
                                    color: '#fff',
                                    border: isSelected ? '2px solid #60a5fa' : '1px solid #334155',
                                    borderRadius: '14px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.15s ease',
                                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                                    boxShadow: isSelected ? '0 0 16px rgba(59, 130, 246, 0.4)' : 'none'
                                }}>
                                <span style={{ fontSize: '28px' }}>{loc.icon}</span>
                                <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{loc.name}</span>
                                <span style={{ fontSize: '10px', color: isSelected ? '#bfdbfe' : '#64748b' }}>{loc.desc}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 3. EZ STYLES PALETTE */}
            <div style={{ background: '#1e293b', padding: '20px 24px', borderRadius: '16px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#60a5fa' }}>🎨 Quick Style Presets</h3>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Selected: <strong style={{ color: '#f472b6' }}>{currentStyle}</strong></span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
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
                                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: st.color }}></span>
                                <strong style={{ fontSize: '13px', color: currentStyle === st.name ? '#60a5fa' : '#f8fafc' }}>{st.name}</strong>
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{st.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
