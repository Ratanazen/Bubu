import React, { useState } from 'react';
import { Play, EyeOff, Power, Monitor, Palette, Check } from 'lucide-react';
import { PetIcon } from '../components/Icons';

interface SkinItem {
    id: string;
    name: string;
    type: 'gif' | 'png' | 'webp';
    imgUrl: string;
    desc: string;
    badge: string;
}

const DEFAULT_SKINS: SkinItem[] = [
    {
        id: 'cyberpunk',
        name: 'Cyberpunk Neon',
        type: 'gif',
        imgUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif',
        desc: 'Animated Electric Pikachu GIF',
        badge: 'ANIMATED GIF'
    },
    {
        id: 'kawaii',
        name: 'Kawaii Pastel',
        type: 'gif',
        imgUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/133.gif',
        desc: 'Animated Cute Eevee GIF',
        badge: 'ANIMATED GIF'
    },
    {
        id: 'original',
        name: 'Classic Bubu',
        type: 'png',
        imgUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
        desc: 'High-res Original Static Image',
        badge: 'STATIC PNG'
    },
    {
        id: 'frosted',
        name: 'Frosted Glass',
        type: 'png',
        imgUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png',
        desc: 'Glassmorphism Style Image',
        badge: 'STATIC PNG'
    },
    {
        id: 'pixel',
        name: 'Retro Arcade',
        type: 'png',
        imgUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        desc: '8-bit Pixel Art Avatar',
        badge: 'PIXEL ART'
    }
];

export default function HomeDashboard() {
    const [bubuStatus, setBubuStatus] = useState<'running' | 'hidden' | 'stopped'>('running');
    const [skins, setSkins] = useState<SkinItem[]>(DEFAULT_SKINS);
    const [activeSkin, setActiveSkin] = useState<SkinItem>(DEFAULT_SKINS[0]);
    const [currentLocation, setCurrentLocation] = useState('Bottom Right');
    const [statusMsg, setStatusMsg] = useState<string | null>(null);

    const triggerAction = (msg: string, stateUpdate?: () => void) => {
        if (stateUpdate) stateUpdate();
        setStatusMsg(msg);
        setTimeout(() => setStatusMsg(null), 3000);
    };

    const handleRunShow = () => {
        triggerAction('Bubu Desktop Pet is now Visible and Active on Screen!', () => setBubuStatus('running'));
    };

    const handleHide = () => {
        triggerAction('Bubu Pet Window Hidden.', () => setBubuStatus('hidden'));
    };

    const handleExit = () => {
        triggerAction('Bubu Desktop Pet Terminated cleanly.', () => setBubuStatus('stopped'));
    };

    const handleLocationClick = (locName: string) => {
        setCurrentLocation(locName);
        triggerAction(`Bubu relocated to: ${locName}`);
    };

    const handleSkinSelect = (skin: SkinItem) => {
        setActiveSkin(skin);
        triggerAction(`Applied ${skin.type.toUpperCase()} Skin: ${skin.name}`);
    };

    const handleUploadSkin = (e: React.ChangeEvent<HTMLInputElement>, isGif: boolean) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);
        const newSkin: SkinItem = {
            id: 'custom-' + Date.now(),
            name: file.name.split('.')[0] || 'Custom Skin',
            type: isGif || file.type.includes('gif') ? 'gif' : 'png',
            imgUrl: objectUrl,
            desc: `Imported ${file.name}`,
            badge: isGif || file.type.includes('gif') ? 'CUSTOM GIF' : 'CUSTOM IMAGE'
        };

        setSkins(prev => [newSkin, ...prev]);
        setActiveSkin(newSkin);
        triggerAction(`Imported & applied custom ${newSkin.badge}: ${file.name}`);
    };

    const displayZones = [
        { id: 'top-left', name: 'Top Left' },
        { id: 'top-center', name: 'Top Center' },
        { id: 'top-right', name: 'Top Right' },
        { id: 'center-left', name: 'Center Left' },
        { id: 'center', name: 'Center Screen' },
        { id: 'center-right', name: 'Center Right' },
        { id: 'bottom-left', name: 'Bottom Left' },
        { id: 'bottom-center', name: 'Bottom Center' },
        { id: 'bottom-right', name: 'Bottom Right' }
    ];

    return (
        <div style={{ padding: '24px', color: '#f8fafc', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '26px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <PetIcon size={26} color="#f8fafc" aria-hidden="true" />
                        Bubu V5 Skin &amp; Location Master
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
                        Live animated GIF & Image skin switcher, custom file importer, and virtual screen relocator.
                    </p>
                </div>
                {statusMsg && (
                    <div style={{ background: '#3b82f6', color: '#fff', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Check size={14} aria-hidden="true" /> {statusMsg}
                    </div>
                )}
            </div>

            {/* Master Power Bar */}
            <div style={{ background: '#1e293b', padding: '16px 20px', borderRadius: '16px', border: '1px solid #334155', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={handleRunShow}
                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                        title="Run &amp; Show Bubu"
                        aria-label="Run and show Bubu"
                    >
                        <Play size={14} aria-hidden="true" /> Run &amp; Show Bubu
                    </button>
                    <button
                        onClick={handleHide}
                        style={{ background: '#334155', color: '#f8fafc', border: '1px solid #475569', padding: '10px 16px', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                        title="Hide Bubu"
                        aria-label="Hide Bubu"
                    >
                        <EyeOff size={14} aria-hidden="true" /> Hide
                    </button>
                    <button
                        onClick={handleExit}
                        style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                        title="Exit Pet"
                        aria-label="Exit Bubu"
                    >
                        <Power size={14} aria-hidden="true" /> Exit Pet
                    </button>
                </div>

                {/* Import Buttons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <label style={{ background: '#8b5cf6', color: '#fff', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        🎬 Add Custom GIF
                        <input type="file" accept="image/gif" style={{ display: 'none' }} onChange={(e) => handleUploadSkin(e, true)} />
                    </label>

                    <label style={{ background: '#3b82f6', color: '#fff', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        🖼️ Add Custom Image
                        <input type="file" accept="image/png,image/jpeg,image/webp" style={{ display: 'none' }} onChange={(e) => handleUploadSkin(e, false)} />
                    </label>
                </div>
            </div>

            {/* SYSTEM CONTEXT (Rule 96) */}
            <div style={{ background: '#1e293b', padding: '24px', borderRadius: '18px', border: '1px solid #334155', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Monitor size={18} color="#60a5fa" aria-hidden="true" />
                    <h2 style={{ margin: 0, fontSize: '18px', color: '#f8fafc' }}>SYSTEM CONTEXT</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div style={{ background: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Active App</div>
                        <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#f8fafc' }}>Visual Studio Code</div>
                    </div>
                    <div style={{ background: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Detected Mode</div>
                        <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#38bdf8' }}>Coding</div>
                    </div>
                    <div style={{ background: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Current Style</div>
                        <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#f8fafc' }}>Focus</div>
                    </div>
                    <div style={{ background: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Current Animation</div>
                        <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#f8fafc' }}>Thinking</div>
                    </div>
                    <div style={{ background: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Music</div>
                        <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#10b981' }}>Playing</div>
                    </div>
                    <div style={{ background: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #3b82f6' }}>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Telegram</div>
                        <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#60a5fa' }}>2 notifications</div>
                    </div>
                    <div style={{ background: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>CPU</div>
                        <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#f59e0b' }}>42%</div>
                    </div>
                    <div style={{ background: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Memory</div>
                        <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#ef4444' }}>58%</div>
                    </div>
                </div>
            </div>

            {/* Main 2-Column Split: Active Skin Preview & Screen Relocator */}
            <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px', marginBottom: '28px' }}>
                
                {/* Active Skin Live Card */}
                <div style={{ background: '#1e293b', padding: '24px', borderRadius: '18px', border: '1px solid #334155', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Active Bubu Avatar</div>
                    
                    <div style={{ 
                        width: '200px', 
                        height: '200px', 
                        margin: '0 auto 16px auto', 
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)', 
                        borderRadius: '20px', 
                        border: '2px solid #3b82f6', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        overflow: 'hidden',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                    }}>
                        <img 
                            src={activeSkin.imgUrl} 
                            alt={activeSkin.name} 
                            style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain', imageRendering: activeSkin.id === 'pixel' ? 'pixelated' : 'auto' }} 
                        />
                    </div>

                    <h2 style={{ margin: '0 0 6px 0', fontSize: '20px', color: '#f8fafc' }}>{activeSkin.name}</h2>
                    <span style={{ display: 'inline-block', background: activeSkin.type === 'gif' ? '#8b5cf6' : '#3b82f6', color: '#fff', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                        {activeSkin.badge}
                    </span>
                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: '8px 0 0 0' }}>{activeSkin.desc}</p>
                </div>

                {/* Virtual Screen Frame Relocator */}
                <div style={{ background: '#1e293b', padding: '24px', borderRadius: '18px', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '18px', color: '#f8fafc' }}>🖥️ Screen Location Grid</h3>
                            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>Click any spot below to instantly move your active skin on desktop.</p>
                        </div>
                        <div style={{ background: '#0f172a', padding: '6px 14px', borderRadius: '8px', border: '1px solid #334155', fontSize: '13px' }}>
                            Spot: <strong style={{ color: '#38bdf8' }}>{currentLocation}</strong>
                        </div>
                    </div>

                    {/* Virtual Screen Viewport */}
                    <div style={{ background: '#0b1120', borderRadius: '14px', border: '3px solid #334155', padding: '14px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                            {displayZones.map(zone => {
                                const isSelected = currentLocation === zone.name;
                                return (
                                    <button
                                        key={zone.id}
                                        onClick={() => handleLocationClick(zone.name)}
                                        style={{
                                            height: '80px',
                                            background: isSelected ? 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)' : '#1e293b',
                                            border: isSelected ? '2px solid #38bdf8' : '1px dashed #475569',
                                            borderRadius: '10px',
                                            color: isSelected ? '#38bdf8' : '#cbd5e1',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '4px',
                                            transition: 'all 0.15s ease',
                                            boxShadow: isSelected ? '0 0 16px rgba(56, 189, 248, 0.4)' : 'none'
                                        }}>
                                        {isSelected ? (
                                            <>
                                                <img src={activeSkin.imgUrl} alt="skin" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                                                <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Bubu Here</span>
                                            </>
                                        ) : (
                                            <>
                                                <span style={{ fontSize: '14px', opacity: 0.5 }}>⛶</span>
                                                <span style={{ fontSize: '11px' }}>{zone.name}</span>
                                            </>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Skins Library (One-Click Selection) */}
            <div>
                <h3 style={{ fontSize: '18px', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Palette size={18} aria-hidden="true" /> Bubu Skin Library (Image &amp; GIF)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '16px' }}>
                    {skins.map(sk => {
                        const isSelected = activeSkin.id === sk.id;
                        return (
                            <div 
                                key={sk.id}
                                onClick={() => handleSkinSelect(sk)}
                                style={{
                                    background: '#1e293b',
                                    border: isSelected ? '2px solid #3b82f6' : '1px solid #334155',
                                    borderRadius: '14px',
                                    padding: '16px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    transition: 'all 0.15s ease',
                                    boxShadow: isSelected ? '0 0 18px rgba(59, 130, 246, 0.35)' : 'none'
                                }}>
                                <div style={{ width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                                    <img src={sk.imgUrl} alt={sk.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                </div>
                                <div style={{ fontWeight: 'bold', fontSize: '14px', color: isSelected ? '#60a5fa' : '#f8fafc' }}>{sk.name}</div>
                                <span style={{ fontSize: '10px', background: sk.type === 'gif' ? '#8b5cf6' : '#334155', color: '#fff', padding: '2px 8px', borderRadius: '10px', marginTop: '4px' }}>
                                    {sk.badge}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
