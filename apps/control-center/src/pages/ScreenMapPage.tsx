import React, { useState, useEffect, useRef } from 'react';

interface DisplayBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Monitor {
  id: string;
  name: string;
  bounds: DisplayBounds;
  workArea: DisplayBounds;
  scaleFactor: number;
  isPrimary: boolean;
  refreshRate?: number;
  rotation?: number;
}

type ScreenZone =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'center'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right';

type MultiMonitorMode =
  | 'fixed'
  | 'active'
  | 'primary'
  | 'random'
  | 'follow-mouse'
  | 'follow-app';

export default function ScreenMapPage() {
  const [monitors, setMonitors] = useState<Monitor[]>([
    {
      id: 'DISPLAY-1',
      name: 'Primary Display (eDP-1)',
      bounds: { x: 0, y: 0, width: 1920, height: 1080 },
      workArea: { x: 0, y: 0, width: 1920, height: 1040 },
      scaleFactor: 1.0,
      isPrimary: true,
      refreshRate: 144,
      rotation: 0
    },
    {
      id: 'DISPLAY-2',
      name: 'External Monitor (HDMI-A-1)',
      bounds: { x: 1920, y: 0, width: 2560, height: 1440 },
      workArea: { x: 1920, y: 0, width: 2560, height: 1400 },
      scaleFactor: 1.0,
      isPrimary: false,
      refreshRate: 75,
      rotation: 0
    }
  ]);

  const [selectedMonitorId, setSelectedMonitorId] = useState<string>('DISPLAY-1');
  const [bubuPos, setBubuPos] = useState<{ x: number; y: number; monitorId: string }>({
    x: 1600,
    y: 800,
    monitorId: 'DISPLAY-1'
  });
  const [activeZone, setActiveZone] = useState<ScreenZone>('bottom-right');
  const [multiMonitorMode, setMultiMonitorMode] = useState<MultiMonitorMode>('primary');
  const [alwaysOnTop, setAlwaysOnTop] = useState(true);
  const [clickThrough, setClickThrough] = useState(false);
  const [opacity, setOpacity] = useState(100);
  const [bubuSize, setBubuSize] = useState(180);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [isDraggingBubu, setIsDraggingBubu] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Synchronize with real Electron API if available in desktop window
  useEffect(() => {
    if (window.electronAPI?.getAllDisplays) {
      window.electronAPI.getAllDisplays().then(displays => {
        if (displays && displays.length > 0) {
          setMonitors(displays);
          const primary = displays.find(d => d.isPrimary) || displays[0];
          setSelectedMonitorId(primary.id);
        }
      });
    }
  }, []);

  // Compute bounding canvas box to scale real monitors geometrically
  const minX = Math.min(...monitors.map(m => m.bounds.x));
  const minY = Math.min(...monitors.map(m => m.bounds.y));
  const maxX = Math.max(...monitors.map(m => m.bounds.x + m.bounds.width));
  const maxY = Math.max(...monitors.map(m => m.bounds.y + m.bounds.height));

  const totalWidth = maxX - minX || 1920;
  const totalHeight = maxY - minY || 1080;

  const mapScale = (360 / Math.max(totalWidth, totalHeight * 1.5)) * zoomLevel;

  const handleZoneSelect = (zone: ScreenZone) => {
    setActiveZone(zone);
    const m = monitors.find(mon => mon.id === selectedMonitorId) || monitors[0];
    if (!m) return;

    let targetX = m.bounds.x + (m.bounds.width - bubuSize) / 2;
    let targetY = m.bounds.y + (m.bounds.height - bubuSize) / 2;
    const margin = 30;

    switch (zone) {
      case 'top-left':
        targetX = m.bounds.x + margin;
        targetY = m.bounds.y + margin;
        break;
      case 'top':
        targetX = m.bounds.x + (m.bounds.width - bubuSize) / 2;
        targetY = m.bounds.y + margin;
        break;
      case 'top-right':
        targetX = m.bounds.x + m.bounds.width - bubuSize - margin;
        targetY = m.bounds.y + margin;
        break;
      case 'left':
        targetX = m.bounds.x + margin;
        targetY = m.bounds.y + (m.bounds.height - bubuSize) / 2;
        break;
      case 'center':
        targetX = m.bounds.x + (m.bounds.width - bubuSize) / 2;
        targetY = m.bounds.y + (m.bounds.height - bubuSize) / 2;
        break;
      case 'right':
        targetX = m.bounds.x + m.bounds.width - bubuSize - margin;
        targetY = m.bounds.y + (m.bounds.height - bubuSize) / 2;
        break;
      case 'bottom-left':
        targetX = m.bounds.x + margin;
        targetY = m.bounds.y + m.bounds.height - bubuSize - margin;
        break;
      case 'bottom':
        targetX = m.bounds.x + (m.bounds.width - bubuSize) / 2;
        targetY = m.bounds.y + m.bounds.height - bubuSize - margin;
        break;
      case 'bottom-right':
        targetX = m.bounds.x + m.bounds.width - bubuSize - margin;
        targetY = m.bounds.y + m.bounds.height - bubuSize - margin;
        break;
    }

    setBubuPos({ x: targetX, y: targetY, monitorId: m.id });

    // Send real command to desktop window if connected
    if (window.electronAPI?.setWindowPosition) {
      window.electronAPI.setWindowPosition(targetX, targetY);
    }
  };

  const handleMoveToMonitor = (monitorId: string) => {
    setSelectedMonitorId(monitorId);
    const m = monitors.find(mon => mon.id === monitorId);
    if (!m) return;
    const targetX = m.bounds.x + (m.bounds.width - bubuSize) / 2;
    const targetY = m.bounds.y + (m.bounds.height - bubuSize) / 2;
    setBubuPos({ x: targetX, y: targetY, monitorId });
    if (window.electronAPI?.setWindowPosition) {
      window.electronAPI.setWindowPosition(targetX, targetY);
    }
  };

  const handleUpdateProperties = (props: { alwaysOnTop?: boolean; opacity?: number; clickThrough?: boolean }) => {
    if (props.alwaysOnTop !== undefined) setAlwaysOnTop(props.alwaysOnTop);
    if (props.opacity !== undefined) setOpacity(props.opacity);
    if (props.clickThrough !== undefined) setClickThrough(props.clickThrough);

    if (window.electronAPI?.setWindowProperties) {
      window.electronAPI.setWindowProperties({
        alwaysOnTop: props.alwaysOnTop ?? alwaysOnTop,
        opacity: (props.opacity ?? opacity) / 100,
        clickThrough: props.clickThrough ?? clickThrough
      });
    }
  };

  const activeMonitor = monitors.find(m => m.id === selectedMonitorId) || monitors[0];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 className="page-title" style={{ margin: 0 }}>🖥️ Screen Control Map</h2>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Interactive geometric layout of your real physical monitors and Bubu window placement.
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-ghost" onClick={() => setZoomLevel(prev => Math.min(2.0, prev + 0.2))}>🔍 +</button>
          <button className="btn btn-ghost" onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.2))}>🔍 -</button>
          <button className="btn btn-ghost" onClick={() => setZoomLevel(1.0)}>Reset Zoom</button>
        </div>
      </div>

      {/* Screen Map Canvas */}
      <div
        ref={canvasRef}
        className="card"
        style={{
          position: 'relative',
          height: '380px',
          backgroundColor: '#0a0a10',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }}
      >
        <div style={{
          position: 'relative',
          width: `${totalWidth * mapScale}px`,
          height: `${totalHeight * mapScale}px`
        }}>
          {monitors.map(m => {
            const left = (m.bounds.x - minX) * mapScale;
            const top = (m.bounds.y - minY) * mapScale;
            const width = m.bounds.width * mapScale;
            const height = m.bounds.height * mapScale;
            const isSelected = m.id === selectedMonitorId;

            return (
              <div
                key={m.id}
                onClick={() => setSelectedMonitorId(m.id)}
                style={{
                  position: 'absolute',
                  left: `${left}px`,
                  top: `${top}px`,
                  width: `${width}px`,
                  height: `${height}px`,
                  backgroundColor: isSelected ? 'rgba(255, 183, 178, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                  border: isSelected ? '2px solid var(--accent, #ffb7b2)' : '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  boxShadow: isSelected ? '0 0 16px rgba(255, 183, 178, 0.3)' : 'none',
                  cursor: 'pointer',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: isSelected ? '#ffb7b2' : '#eee' }}>
                    {m.name}
                  </span>
                  {m.isPrimary && (
                    <span style={{
                      fontSize: '9px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(74, 222, 128, 0.2)',
                      color: '#4ade80'
                    }}>
                      PRIMARY
                    </span>
                  )}
                </div>

                <div style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>
                  {m.bounds.width} × {m.bounds.height} ({m.refreshRate || 60}Hz)
                </div>

                <div style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.3)' }}>
                  X: {m.bounds.x}, Y: {m.bounds.y}
                </div>
              </div>
            );
          })}

          {/* Bubu Desktop Pet Icon Pin */}
          <div
            style={{
              position: 'absolute',
              left: `${(bubuPos.x - minX) * mapScale}px`,
              top: `${(bubuPos.y - minY) * mapScale}px`,
              width: `${Math.max(28, bubuSize * mapScale)}px`,
              height: `${Math.max(28, bubuSize * mapScale)}px`,
              backgroundColor: 'var(--accent, #ffb7b2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              cursor: 'grab',
              boxShadow: '0 0 14px #ffb7b2',
              zIndex: 10,
              transition: isDraggingBubu ? 'none' : 'all 0.25s ease'
            }}
            title="🐾 Bubu Position (Drag to reposition)"
          >
            🐾
          </div>
        </div>
      </div>

      {/* Control Grid: Zones & Properties */}
      <div className="grid grid-3" style={{ marginBottom: '20px' }}>
        {/* Screen Zones */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: '12px' }}>🎯 Quick Screen Zones</div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            marginBottom: '12px'
          }}>
            {[
              { id: 'top-left', label: '↖ TL' },
              { id: 'top', label: '↑ Top' },
              { id: 'top-right', label: '↗ TR' },
              { id: 'left', label: '← Left' },
              { id: 'center', label: '• Center' },
              { id: 'right', label: 'Right →' },
              { id: 'bottom-left', label: '↙ BL' },
              { id: 'bottom', label: '↓ Bottom' },
              { id: 'bottom-right', label: '↘ BR' }
            ].map(z => (
              <button
                key={z.id}
                className={`btn ${activeZone === z.id ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '8px 4px', fontSize: '11px', textAlign: 'center' }}
                onClick={() => handleZoneSelect(z.id as ScreenZone)}
              >
                {z.label}
              </button>
            ))}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Moves Bubu to the assigned edge zone on {activeMonitor.name}.
          </div>
        </div>

        {/* Multi-Monitor Mode */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: '12px' }}>🖥️ Multi-Monitor Policy</div>
          <div className="status-row">
            <span className="status-label">Placement Policy</span>
            <select
              value={multiMonitorMode}
              onChange={e => setMultiMonitorMode(e.target.value as MultiMonitorMode)}
              style={{ width: '140px' }}
            >
              <option value="primary">Primary Display</option>
              <option value="active">Follow Active</option>
              <option value="fixed">Fixed Display</option>
              <option value="random">Wander Displays</option>
              <option value="follow-mouse">Follow Cursor</option>
            </select>
          </div>
          <div className="status-row">
            <span className="status-label">Target Display</span>
            <select
              value={selectedMonitorId}
              onChange={e => handleMoveToMonitor(e.target.value)}
              style={{ width: '140px' }}
            >
              {monitors.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div style={{ marginTop: '12px' }}>
            <button
              className="btn btn-secondary"
              style={{ width: '100%' }}
              onClick={() => handleMoveToMonitor(selectedMonitorId)}
            >
              Move Bubu To Selected Display
            </button>
          </div>
        </div>

        {/* Window & Desktop Layer Properties */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: '12px' }}>🪟 Window Properties</div>
          <div className="status-row">
            <span className="status-label">Always On Top</span>
            <div
              className={`toggle ${alwaysOnTop ? 'active' : ''}`}
              onClick={() => handleUpdateProperties({ alwaysOnTop: !alwaysOnTop })}
            />
          </div>
          <div className="status-row">
            <span className="status-label">Click-Through</span>
            <div
              className={`toggle ${clickThrough ? 'active' : ''}`}
              onClick={() => handleUpdateProperties({ clickThrough: !clickThrough })}
            />
          </div>
          <div className="status-row">
            <span className="status-label">Window Opacity ({opacity}%)</span>
            <input
              type="range"
              min="20"
              max="100"
              value={opacity}
              onChange={e => handleUpdateProperties({ opacity: Number(e.target.value) })}
              style={{ width: '120px' }}
            />
          </div>
          <div className="status-row">
            <span className="status-label">Pet Silhouette Size ({bubuSize}px)</span>
            <input
              type="range"
              min="100"
              max="320"
              value={bubuSize}
              onChange={e => setBubuSize(Number(e.target.value))}
              style={{ width: '120px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
