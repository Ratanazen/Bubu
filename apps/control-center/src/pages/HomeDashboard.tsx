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
        triggerAction(`📍 Bubu relocated to ${locName}`);
    };

    const handleQuickStyle = (styleName: string) => {
        setCurrentStyle(styleName);
        triggerAction(`🎨 Applied Style: ${styleName}`);
    };

    // 9-Zone Visual SVG Display Grid (Click on any cell to move Bubu)
    const displayZones = [
        { id: 'top-left', name: 'Top Left', label: 'TL', col: 1, row: 1 },
        { id: 'top-center', name: 'Top Center', label: 'TC', col: 2, row: 1 },
        { id: 'top-right', name: 'Top Right', label: 'TR', col: 3, row: 1 },
        { id: 'center-left', name: 'Center Left', label: 'CL', col: 1, row: 2 },
        { id: 'center', name: 'Center Screen', label: 'Center', col: 2, row: 2 },
        { id: 'center-right', name: 'Center Right', label: 'CR', col: 3, row: 2 },
        { id: 'bottom-left', name: 'Bottom Left', label: 'BL', col: 1, row: 3 },
        { id: 'bottom-center', name: 'Bottom Center', label: 'BC', col: 2, row: 3 },
        { id: 'bottom-right', name: 'Bottom Right', label: 'BR', col: 3, row: 3 }
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
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '26px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        🐾 Bubu V5 One-Click Screen Relocator
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
                        Click on any spot inside the virtual monitor below to instantly relocate Bubu on your screen.
                    </p>
                </div>
                {statusMsg && (
                    <div style={{ background: '#3b82f6', color: '#fff', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)' }}>
                        ✓ {statusMsg}
                    </div>
                )}
            </div>

            {/* Master Controls */}
            <div style={{ background: '#1e293b', padding: '16px 20px', borderRadius: '16px', border: '1px solid #334155', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    <button 
                        onClick={handleRunShow}
                        style={{ 
                            background: 'linear-gradient(135deg, #10b981, #059669)', 
                            color: '#fff', 
                            border: 'none', 
                            padding: '12px 20px', 
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

            {/* VIRTUAL SCREEN MONITOR (Click inside to position Bubu) */}
            <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '18px', color: '#f8fafc' }}>🖥️ Virtual Monitor Screen Relocator</h2>
                        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>Click any of the 9 screen tiles to immediately position Bubu there on your desktop.</p>
                    </div>
                    <div style={{ background: '#0f172a', padding: '6px 14px', borderRadius: '8px', border: '1px solid #334155', fontSize: '13px' }}>
                        Current Spot: <strong style={{ color: '#38bdf8' }}>{currentLocation}</strong>
                    </div>
                </div>

                {/* Simulated Screen Frame */}
                <div style={{ 
                    background: '#0b1120', 
                    borderRadius: '14px', 
                    border: '3px solid #334155', 
                    padding: '16px', 
                    maxWidth: '680px', 
                    margin: '0 auto', 
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.6)' 
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                        {displayZones.map(zone => {
                            const isSelected = currentLocation === zone.name;
                            return (
                                <button
                                    key={zone.id}
                                    onClick={() => handleLocationClick(zone.name)}
                                    style={{
                                        height: '90px',
                                        background: isSelected ? 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)' : '#1e293b',
                                        border: isSelected ? '2px solid #38bdf8' : '1px dashed #475569',
                                        borderRadius: '12px',
                                        color: isSelected ? '#38bdf8' : '#cbd5e1',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px',
                                        transition: 'all 0.15s ease',
                                        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                        boxShadow: isSelected ? '0 0 16px rgba(56, 189, 248, 0.4)' : 'none'
                                    }}>
                                    {isSelected ? (
                                        <>
                                            <span style={{ fontSize: '24px', animation: 'bounce 1s infinite' }}>🐾</span>
                                            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Bubu Here</span>
                                        </>
                                    ) : (
                                        <>
                                            <span style={{ fontSize: '16px', opacity: 0.5 }}>⛶</span>
                                            <span style={{ fontSize: '12px', fontWeight: '500' }}>{zone.name}</span>
                                        </>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Quick Styles */}
            <div style={{ background: '#1e293b', padding: '20px', borderRadius: '16px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', color: '#60a5fa' }}>🎨 EZ Style Presets</h3>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Active: <strong style={{ color: '#f472b6' }}>{currentStyle}</strong></span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                    {ezStyles.map(st => (
                        <div
                            key={st.name}
                            onClick={() => handleQuickStyle(st.name)}
                            style={{
                                padding: '10px 14px',
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
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
