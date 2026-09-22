import React, { useEffect, useState } from 'react';

export default function ScreenMapPage() {
    const [monitors, setMonitors] = useState<any[]>([]);

    useEffect(() => {
        if (window.electronAPI && window.electronAPI.getAllDisplays) {
            window.electronAPI.getAllDisplays().then(setMonitors);
        } else {
            // Mock
            setMonitors([
                { id: 1, name: 'DP-1', bounds: { width: 2560, height: 1440, x: 0, y: 0 }, isPrimary: true }
            ]);
        }
    }, []);

    return (
        <div style={{ padding: '24px' }}>
            <h2>Desktop & Screen Map</h2>
            <div style={{ position: 'relative', height: '400px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden', marginTop: '20px' }}>
                {monitors.map(m => {
                    const scale = 0.1;
                    return (
                        <div key={m.id} style={{
                            position: 'absolute',
                            left: (m.bounds?.x || 0) * scale + 100,
                            top: (m.bounds?.y || 0) * scale + 100,
                            width: (m.bounds?.width || 1920) * scale,
                            height: (m.bounds?.height || 1080) * scale,
                            border: '2px solid var(--accent)',
                            backgroundColor: 'rgba(0,255,100,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            color: 'white',
                            fontSize: '12px'
                        }}>
                            <strong>{m.name} {m.isPrimary && '(Primary)'}</strong>
                            <span>{m.bounds?.width}x{m.bounds?.height}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
