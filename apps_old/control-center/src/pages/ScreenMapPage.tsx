import React, { useEffect, useState, useRef } from 'react';
import { Monitor, Check, Map as MapIcon, Layers, Maximize } from 'lucide-react';
import { PetIcon } from '../components/Icons';

export default function ScreenMapPage() {
    const [monitors, setMonitors] = useState<any[]>([]);
    const [windows, setWindows] = useState<any[]>([]);
    const [workspaces, setWorkspaces] = useState<any[]>([]);
    const [bubuPos, setBubuPos] = useState({ x: 150, y: 150, scale: 1.0, opacity: 1.0, anchor: 'bottom-right' });
    const [statusMsg, setStatusMsg] = useState('');
    
    const [viewPan, setViewPan] = useState({ x: 0, y: 0 });
    const [viewZoom, setViewZoom] = useState(0.15);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSystemState = async () => {
            if (window.electronAPI) {
                if (window.electronAPI.getAllDisplays) {
                    const m = await window.electronAPI.getAllDisplays();
                    if (m && m.length > 0) setMonitors(m);
                }
                if (window.electronAPI.getWorkspaces) {
                    const w = await window.electronAPI.getWorkspaces();
                    if (w && w.length > 0) setWorkspaces(w);
                }
                if (window.electronAPI.getWindows) {
                    const win = await window.electronAPI.getWindows();
                    if (win && win.length > 0) setWindows(win);
                }
            }
        };
        fetchSystemState();
        const interval = setInterval(fetchSystemState, 5000);
        return () => clearInterval(interval);
    }, []);

    const triggerUpdate = (msg: string) => {
        setStatusMsg(msg);
        setTimeout(() => setStatusMsg(''), 3000);
    };

    const handleMapPan = (e: React.MouseEvent) => {
        if (e.button !== 0 || e.target !== mapContainerRef.current) return;
        const startX = e.clientX;
        const startY = e.clientY;
        const initialPanX = viewPan.x;
        const initialPanY = viewPan.y;

        const onMove = (moveEvt: MouseEvent) => {
            setViewPan({
                x: initialPanX + (moveEvt.clientX - startX),
                y: initialPanY + (moveEvt.clientY - startY)
            });
        };
        const onUp = () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
            setViewZoom(prev => Math.max(0.05, Math.min(2.0, prev * zoomDelta)));
        }
    };

    return (
        <div style={{ padding: '24px', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexShrink: 0 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '26px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <MapIcon size={24} aria-hidden="true" />
                        Bubu Screen Map (V5.1)
                        <span style={{ fontSize: '12px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.4)' }}>LIVE OS CONNECTION</span>
                    </h1>
                    <p style={{ color: '#94a3b8', margin: '6px 0 0 0', fontSize: '14px' }}>Real-time native compositor view. Drag Bubu to move him directly across your OS monitors.</p>
                </div>
                {statusMsg && (
                    <div style={{ background: '#10b981', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Check size={14} aria-hidden="true" /> {statusMsg}
                    </div>
                )}
            </div>

            <div 
                ref={mapContainerRef}
                onMouseDown={handleMapPan}
                onWheel={handleWheel}
                style={{ 
                    flex: 1, 
                    background: '#0f172a', 
                    borderRadius: '16px', 
                    border: '1px solid #334155', 
                    position: 'relative', 
                    overflow: 'hidden',
                    cursor: 'grab',
                    boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)'
                }}
            >
                <div style={{ 
                    position: 'absolute', 
                    left: '50%', 
                    top: '50%', 
                    transform: `translate(calc(-50% + ${viewPan.x}px), calc(-50% + ${viewPan.y}px)) scale(${viewZoom})`,
                    transformOrigin: 'center center'
                }}>
                    {monitors.map((m, idx) => {
                        const x = m.x || (m.bounds?.x || 0);
                        const y = m.y || (m.bounds?.y || 0);
                        const w = m.width || (m.bounds?.width || 1920);
                        const h = m.height || (m.bounds?.height || 1080);
                        return (
                            <div key={m.id || idx} style={{
                                position: 'absolute',
                                left: x,
                                top: y,
                                width: w,
                                height: h,
                                border: m.isPrimary ? '4px solid #3b82f6' : '4px dashed #64748b',
                                backgroundColor: m.isPrimary ? 'rgba(59, 130, 246, 0.05)' : 'rgba(30, 41, 59, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                color: '#f8fafc',
                                pointerEvents: 'none'
                            }}>
                                <strong style={{ fontSize: '48px' }}>{m.name || `Display ${m.id}`}</strong>
                                <span style={{ fontSize: '32px', color: '#94a3b8' }}>{w} × {h}</span>
                                {m.isPrimary && <span style={{ fontSize: '24px', background: '#3b82f6', padding: '8px 16px', borderRadius: '12px', marginTop: '16px' }}>PRIMARY</span>}
                            </div>
                        );
                    })}

                    {windows.map(win => {
                        if (!win.visible || !win.geometry) return null;
                        return (
                            <div key={win.id} style={{
                                position: 'absolute',
                                left: win.geometry.x,
                                top: win.geometry.y,
                                width: win.geometry.width,
                                height: win.geometry.height,
                                border: win.focused ? '4px solid #f59e0b' : '2px solid rgba(148, 163, 184, 0.3)',
                                backgroundColor: win.focused ? 'rgba(245, 158, 11, 0.1)' : 'rgba(15, 23, 42, 0.5)',
                                color: win.focused ? '#fcd34d' : '#94a3b8',
                                padding: '8px',
                                overflow: 'hidden',
                                pointerEvents: 'none'
                            }}>
                                <strong style={{ fontSize: '24px', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{win.application || 'Window'}</strong>
                                <span style={{ fontSize: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{win.title}</span>
                            </div>
                        );
                    })}

                    <div 
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            const startX = e.clientX;
                            const startY = e.clientY;
                            const initialBubuX = bubuPos.x;
                            const initialBubuY = bubuPos.y;

                            const onMove = (moveEvt: MouseEvent) => {
                                const dx = (moveEvt.clientX - startX) / viewZoom;
                                const dy = (moveEvt.clientY - startY) / viewZoom;
                                
                                setBubuPos(prev => ({
                                    ...prev,
                                    x: initialBubuX + dx,
                                    y: initialBubuY + dy
                                }));
                            };
                            const onUp = () => {
                                window.removeEventListener('mousemove', onMove);
                                window.removeEventListener('mouseup', onUp);
                                
                                setBubuPos(prev => {
                                    if (window.electronAPI?.movePet) {
                                        window.electronAPI.movePet(prev.x, prev.y);
                                    }
                                    return prev;
                                });
                                triggerUpdate('Bubu moved via IPC');
                            };
                            window.addEventListener('mousemove', onMove);
                            window.addEventListener('mouseup', onUp);
                        }}
                        style={{
                            position: 'absolute',
                            left: bubuPos.x,
                            top: bubuPos.y,
                            width: 150,
                            height: 150,
                            background: '#ec4899',
                            borderRadius: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'grab',
                            boxShadow: '0 12px 32px rgba(236, 72, 153, 0.5)',
                            zIndex: 9999
                        }}
                    >
                        <PetIcon size={64} color="#fff" aria-hidden="true" />
                        <span style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '12px' }}>Bubu</span>
                    </div>

                </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '20px', padding: '16px', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Layers size={18} color="#94a3b8" aria-hidden="true" />
                    <span style={{ fontSize: '14px', color: '#cbd5e1' }}>Workspaces:</span>
                    {workspaces.map(w => (
                        <span key={w.id} style={{ padding: '4px 10px', background: w.isActive ? '#3b82f6' : '#334155', borderRadius: '6px', fontSize: '12px', fontWeight: w.isActive ? 'bold' : 'normal' }}>
                            {w.name}
                        </span>
                    ))}
                    {workspaces.length === 0 && <span style={{ fontSize: '13px', color: '#64748b' }}>No native workspaces detected.</span>}
                </div>
                <div style={{ flex: 1 }} />
                <button onClick={() => { setViewPan({x:0,y:0}); setViewZoom(0.15); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                    <Maximize size={16} aria-hidden="true" /> Reset View
                </button>
            </div>
        </div>
    );
}
