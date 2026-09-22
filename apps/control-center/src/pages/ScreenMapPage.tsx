import React, { useEffect, useState } from 'react';
import { Monitor, Check, Palette } from 'lucide-react';
import { PetIcon } from '../components/Icons';

export default function ScreenMapPage() {
    const [monitors, setMonitors] = useState<any[]>([]);
    const [bubuPos, setBubuPos] = useState({ x: 150, y: 150, scale: 1.0, opacity: 1.0, anchor: 'bottom-right' });
    const [selectedStyle, setSelectedStyle] = useState('cyberpunk');
    const [activeTab, setActiveTab] = useState<'map' | 'customizer' | 'location'>('map');
    const [statusMsg, setStatusMsg] = useState('');

    useEffect(() => {
        if (window.electronAPI && window.electronAPI.getAllDisplays) {
            window.electronAPI.getAllDisplays().then(setMonitors);
        } else {
            setMonitors([
                { id: 1, name: 'Main Display (eDP-1)', bounds: { width: 1920, height: 1080, x: 0, y: 0 }, isPrimary: true },
                { id: 2, name: 'External 4K (HDMI-A-1)', bounds: { width: 2560, height: 1440, x: 1920, y: 0 }, isPrimary: false }
            ]);
        }
    }, []);

    const handleAnchorSelect = (anchor: string) => {
        setBubuPos(prev => ({ ...prev, anchor }));
        triggerUpdate(`Snapped Bubu to ${anchor}`);
    };

    const triggerUpdate = (msg: string) => {
        setStatusMsg(msg);
        setTimeout(() => setStatusMsg(''), 3000);
    };

    const stylesList = [
        { id: 'default', name: 'Original Bubu', desc: 'Warm classic bear aesthetic' },
        { id: 'cyberpunk', name: 'Cyberpunk Neon', desc: 'Vibrant neon edges and futuristic glow' },
        { id: 'kawaii', name: 'Kawaii Pastel', desc: 'Cute blush tones & pastel accessories' },
        { id: 'pixel', name: 'Pixel Retro', desc: '8-bit retro arcade aesthetic' },
        { id: 'minimal', name: 'Minimal Dark', desc: 'Monochrome sleek dark theme' },
        { id: 'glass', name: 'Glassmorphism', desc: 'Translucent frosted glass styling' }
    ];

    return (
        <div style={{ padding: '24px', color: '#fff', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '26px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Monitor size={24} aria-hidden="true" />
                        Bubu Desktop Control System V5
                        <span style={{ fontSize: '12px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.4)' }}>EZ Customizer Mode</span>
                    </h1>
                    <p style={{ color: '#94a3b8', margin: '6px 0 0 0', fontSize: '14px' }}>Real-time multi-monitor topology control, custom anchor positioning, and instant style switcher.</p>
                </div>
                {statusMsg && (
                    <div style={{ background: '#10b981', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Check size={14} aria-hidden="true" /> {statusMsg}
                    </div>
                )}
            </div>

            {/* Mode Switcher Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
                <button
                    onClick={() => setActiveTab('map')}
                    style={{ background: activeTab === 'map' ? '#3b82f6' : '#1e293b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                    aria-pressed={activeTab === 'map'}
                >
                    Interactive Screen Map
                </button>
                <button
                    onClick={() => setActiveTab('customizer')}
                    style={{ background: activeTab === 'customizer' ? '#3b82f6' : '#1e293b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                    aria-pressed={activeTab === 'customizer'}
                >
                    EZ Style &amp; Size Customizer
                </button>
                <button
                    onClick={() => setActiveTab('location')}
                    style={{ background: activeTab === 'location' ? '#3b82f6' : '#1e293b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                    aria-pressed={activeTab === 'location'}
                >
                    Precision Position &amp; Anchors
                </button>
            </div>

            {/* TAB 1: SCREEN MAP */}
            {activeTab === 'map' && (
                <div>
                    <div style={{ position: 'relative', height: '360px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px', overflow: 'hidden', padding: '20px' }}>
                        <div style={{ position: 'absolute', top: 12, left: 16, fontSize: '12px', color: '#64748b' }}>CANVAS: REAL DISPLAY GEOMETRY</div>
                        {monitors.map((m, idx) => {
                            const scale = 0.08;
                            return (
                                <div key={m.id || idx} style={{
                                    position: 'absolute',
                                    left: (m.bounds?.x || 0) * scale + 60,
                                    top: (m.bounds?.y || 0) * scale + 50,
                                    width: (m.bounds?.width || 1920) * scale,
                                    height: (m.bounds?.height || 1080) * scale,
                                    border: m.isPrimary ? '2px solid #3b82f6' : '2px dashed #64748b',
                                    backgroundColor: m.isPrimary ? 'rgba(59, 130, 246, 0.12)' : 'rgba(30, 41, 59, 0.6)',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    color: '#f8fafc',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
                                }}>
                                    <strong style={{ fontSize: '13px' }}>{m.name}</strong>
                                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{m.bounds?.width} × {m.bounds?.height}</span>
                                    {m.isPrimary && <span style={{ fontSize: '10px', background: '#3b82f6', color: '#fff', padding: '2px 6px', borderRadius: '4px', marginTop: '6px' }}>PRIMARY</span>}
                                </div>
                            );
                        })}

                        {/* Interactive Drag Bubu Avatar */}
                        <div 
                            style={{
                                position: 'absolute',
                                left: bubuPos.x,
                                top: bubuPos.y,
                                padding: '8px 14px',
                                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'grab',
                                boxShadow: '0 0 20px rgba(236, 72, 153, 0.6)',
                                transform: `scale(${bubuPos.scale})`,
                                opacity: bubuPos.opacity,
                                transition: 'transform 0.1s ease'
                            }}
                            onMouseDown={(e) => {
                                const startX = e.clientX - bubuPos.x;
                                const startY = e.clientY - bubuPos.y;
                                const onMove = (moveEvt: MouseEvent) => {
                                    setBubuPos(prev => ({
                                        ...prev,
                                        x: Math.max(10, moveEvt.clientX - startX),
                                        y: Math.max(10, moveEvt.clientY - startY)
                                    }));
                                };
                                const onUp = () => {
                                    window.removeEventListener('mousemove', onMove);
                                    window.removeEventListener('mouseup', onUp);
                                    triggerUpdate('Updated Bubu Desktop coordinates');
                                };
                                window.addEventListener('mousemove', onMove);
                                window.addEventListener('mouseup', onUp);
                            }}
                        >
                            <PetIcon size={20} color="#fff" aria-hidden="true" />
                            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Bubu ({selectedStyle})</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', color: '#94a3b8', fontSize: '13px' }}>
                        <span>Tip: Click and drag Bubu inside the Screen Map above to freely position him across displays.</span>
                        <button onClick={() => { setBubuPos({ x: 120, y: 120, scale: 1, opacity: 1, anchor: 'center' }); triggerUpdate('Reset position'); }} style={{ background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer' }}>Reset Position</button>
                    </div>
                </div>
            )}

            {/* TAB 2: EZ CUSTOMIZER */}
            {activeTab === 'customizer' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                    <div style={{ background: '#1e293b', padding: '20px', borderRadius: '16px', border: '1px solid #334155' }}>
                        <h3 style={{ marginTop: 0, fontSize: '18px' }}>Quick Style Switcher</h3>
                        <p style={{ color: '#94a3b8', fontSize: '13px' }}>Click any preset to instantly dress Bubu in that visual style.</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px' }}>
                            {stylesList.map(st => (
                                <div 
                                    key={st.id} 
                                    onClick={() => { setSelectedStyle(st.id); triggerUpdate(`Applied style: ${st.name}`); }}
                                    style={{
                                        padding: '12px',
                                        background: selectedStyle === st.id ? 'rgba(59, 130, 246, 0.2)' : '#0f172a',
                                        border: selectedStyle === st.id ? '2px solid #3b82f6' : '1px solid #334155',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s'
                                    }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '14px', color: selectedStyle === st.id ? '#60a5fa' : '#f8fafc' }}>{st.name}</div>
                                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{st.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ background: '#1e293b', padding: '20px', borderRadius: '16px', border: '1px solid #334155' }}>
                        <h3 style={{ marginTop: 0, fontSize: '18px' }}>Size &amp; Opacity Customizer</h3>
                        
                        <div style={{ marginTop: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                                <span>Scale / Size:</span>
                                <strong style={{ color: '#60a5fa' }}>{Math.round(bubuPos.scale * 100)}%</strong>
                            </div>
                            <input 
                                type="range" 
                                min="0.5" 
                                max="2.5" 
                                step="0.1" 
                                value={bubuPos.scale} 
                                onChange={(e) => setBubuPos(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                                style={{ width: '100%', cursor: 'pointer' }}
                            />
                        </div>

                        <div style={{ marginTop: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                                <span>Window Opacity:</span>
                                <strong style={{ color: '#60a5fa' }}>{Math.round(bubuPos.opacity * 100)}%</strong>
                            </div>
                            <input 
                                type="range" 
                                min="0.2" 
                                max="1.0" 
                                step="0.05" 
                                value={bubuPos.opacity} 
                                onChange={(e) => setBubuPos(prev => ({ ...prev, opacity: parseFloat(e.target.value) }))}
                                style={{ width: '100%', cursor: 'pointer' }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: PRECISION ANCHORS */}
            {activeTab === 'location' && (
                <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}>
                    <h3 style={{ marginTop: 0, fontSize: '18px' }}>One-Click Screen Anchor Snapping</h3>
                    <p style={{ color: '#94a3b8', fontSize: '13px' }}>Snap Bubu to any of the 9 desktop edge zones instantly.</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 140px)', gap: '12px', justifyContent: 'center', margin: '30px 0' }}>
                        {[
                            'top-left', 'top-center', 'top-right',
                            'center-left', 'center', 'center-right',
                            'bottom-left', 'bottom-center', 'bottom-right'
                        ].map(anc => (
                            <button
                                key={anc}
                                onClick={() => handleAnchorSelect(anc)}
                                style={{
                                    padding: '16px 8px',
                                    background: bubuPos.anchor === anc ? '#3b82f6' : '#0f172a',
                                    color: '#fff',
                                    border: bubuPos.anchor === anc ? '2px solid #60a5fa' : '1px solid #334155',
                                    borderRadius: '10px',
                                    fontWeight: 'bold',
                                    fontSize: '12px',
                                    textTransform: 'capitalize',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s'
                                }}>
                                {anc.replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
