import React, { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';

interface StyleAvatar {
    id: string;
    name: string;
    file: string;
    type: 'png' | 'gif' | 'webp';
    size: string;
    preview: string;
    isAnimated: boolean;
}

const DEFAULT_STYLES: StyleAvatar[] = [
    {
        id: 'classic',
        name: 'Classic Bubu',
        file: 'avatar.png',
        type: 'png',
        size: '256 × 256',
        preview: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
        isAnimated: false
    },
    {
        id: 'cyberpunk',
        name: 'Cyberpunk Neon',
        file: 'avatar.gif',
        type: 'gif',
        size: '256 × 256 (24 frames)',
        preview: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif',
        isAnimated: true
    },
    {
        id: 'glass',
        name: 'Glassmorphism Frosted',
        file: 'avatar.webp',
        type: 'webp',
        size: '512 × 512',
        preview: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png',
        isAnimated: false
    },
    {
        id: 'kawaii',
        name: 'Kawaii Pastel',
        file: 'avatar.gif',
        type: 'gif',
        size: '256 × 256 (16 frames)',
        preview: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/133.gif',
        isAnimated: true
    },
    {
        id: 'pixel',
        name: 'Pixel Retro Arcade',
        file: 'avatar.png',
        type: 'png',
        size: '128 × 128',
        preview: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        isAnimated: false
    }
];

export default function AvatarPage() {
    const [styles, setStyles] = useState<StyleAvatar[]>(DEFAULT_STYLES);
    const [activeStyle, setActiveStyle] = useState<StyleAvatar>(DEFAULT_STYLES[0]);
    const [notification, setNotification] = useState<string | null>(null);

    const showNotif = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleApplyStyle = (st: StyleAvatar) => {
        setActiveStyle(st);
        showNotif(`Applied "${st.name}" (${st.file}) to Desktop Pet!`);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isGif: boolean) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fakeUrl = URL.createObjectURL(file);
        const newStyle: StyleAvatar = {
            id: 'custom-' + Date.now(),
            name: file.name.split('.')[0] || 'Custom Avatar',
            file: file.name,
            type: isGif || file.type.includes('gif') ? 'gif' : 'png',
            size: `${Math.round(file.size / 1024)} KB`,
            preview: fakeUrl,
            isAnimated: isGif || file.type.includes('gif')
        };

        setStyles(prev => [newStyle, ...prev]);
        setActiveStyle(newStyle);
        showNotif(`Imported and applied custom ${newStyle.type.toUpperCase()}: ${file.name}`);
    };

    return (
        <div style={{ padding: '24px', color: '#f8fafc', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '26px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        🖼️ Bubu Avatar & One-Asset Style Engine
                    </h1>
                    <p style={{ color: '#94a3b8', margin: '6px 0 0 0', fontSize: '14px' }}>
                        Strict Architecture: 1 Visual Style = 1 Primary Bubu Avatar (PNG, WebP, JPG, or Animated GIF).
                    </p>
                </div>
                {notification && (
                    <div style={{ background: '#10b981', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>
                        ✓ {notification}
                    </div>
                )}
            </div>

            {/* Current Active Avatar Inspector */}
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', marginBottom: '32px' }}>
                <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155', textAlign: 'center' }}>
                    <div style={{
                        width: '200px',
                        height: '200px',
                        margin: '0 auto 16px auto',
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
                        borderRadius: '16px',
                        border: '2px solid #3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
                    }}>
                        <img 
                            src={activeStyle.preview} 
                            alt={activeStyle.name} 
                            style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain', imageRendering: activeStyle.id === 'pixel' ? 'pixelated' : 'auto' }} 
                        />
                    </div>

                    <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#f8fafc' }}>{activeStyle.name}</h2>
                    <div style={{ display: 'inline-block', background: activeStyle.isAnimated ? '#8b5cf6' : '#3b82f6', color: '#fff', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginBottom: '14px' }}>
                        {activeStyle.type.toUpperCase()} {activeStyle.isAnimated ? '• ANIMATED GIF' : '• STATIC AVATAR'}
                    </div>

                    <div style={{ textAlign: 'left', background: '#0f172a', padding: '12px 16px', borderRadius: '10px', border: '1px solid #334155', fontSize: '12px', color: '#94a3b8' }}>
                        <div style={{ marginBottom: '6px' }}><strong style={{ color: '#e2e8f0' }}>Asset File:</strong> {activeStyle.file}</div>
                        <div><strong style={{ color: '#e2e8f0' }}>Dimensions/Size:</strong> {activeStyle.size}</div>
                    </div>
                </div>

                {/* Import & Actions Panel */}
                <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#f8fafc' }}>⚡ Avatar Actions & File Import</h3>
                        <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.5 }}>
                            Upload your own custom PNG, JPG, WebP, or animated GIF. Bubu will automatically adopt the new asset while strictly preserving your current screen coordinates, scaling, and monitor layout.
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '20px' }}>
                            <label style={{ background: '#3b82f6', color: '#fff', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                🖼️ Import Image (PNG/WebP/JPG)
                                <input type="file" accept="image/png,image/jpeg,image/webp" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, false)} />
                            </label>

                            <label style={{ background: '#8b5cf6', color: '#fff', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                🎬 Import Animated GIF
                                <input type="file" accept="image/gif" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, true)} />
                            </label>

                            <button 
                                onClick={() => handleApplyStyle(DEFAULT_STYLES[0])}
                                style={{ background: '#334155', color: '#f8fafc', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                                🔄 Reset to Default
                            </button>
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '10px', border: '1px solid rgba(59, 130, 246, 0.2)', fontSize: '12px', color: '#93c5fd' }}>
                        💡 <strong>Engine Rule:</strong> Changing the visual avatar updates Desktop Pet rendering immediately without affecting your location or window hierarchy.
                    </div>
                </div>
            </div>

            {/* Style Preset Gallery (1 Style = 1 Avatar) */}
            <h2 style={{ fontSize: '20px', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Palette size={18} aria-hidden="true" /> Style Preset Library
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                {styles.map(st => {
                    const isSelected = activeStyle.id === st.id;
                    return (
                        <div 
                            key={st.id}
                            style={{
                                background: '#1e293b',
                                border: isSelected ? '2px solid #3b82f6' : '1px solid #334155',
                                borderRadius: '14px',
                                padding: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                transition: 'all 0.15s ease',
                                boxShadow: isSelected ? '0 0 16px rgba(59, 130, 246, 0.3)' : 'none'
                            }}>
                            <div style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                                <img src={st.preview} alt={st.name} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                            </div>
                            <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px', textAlign: 'center' }}>{st.name}</div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '14px' }}>{st.file} ({st.type.toUpperCase()})</div>
                            
                            <button
                                onClick={() => handleApplyStyle(st)}
                                style={{
                                    width: '100%',
                                    padding: '8px 0',
                                    background: isSelected ? '#10b981' : '#3b82f6',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                }}>
                                {isSelected ? '✓ Active Avatar' : 'Apply Avatar'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
