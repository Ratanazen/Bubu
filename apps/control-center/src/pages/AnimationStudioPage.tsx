import React, { useState, useEffect, useRef } from 'react';

export interface FrameItem {
  id: string;
  name: string;
  asset: string;       // base64, object URL, or asset path
  duration: number;    // ms
}

const DEFAULT_STATES = [
  { id: 'IDLE', label: '🐾 Idle', defaultFps: 4 },
  { id: 'WALK', label: '🚶 Walk', defaultFps: 8 },
  { id: 'RUN', label: '🏃 Run', defaultFps: 12 },
  { id: 'SLEEP', label: '😴 Sleep', defaultFps: 2 },
  { id: 'WAKE', label: '🌅 Wake', defaultFps: 4 },
  { id: 'SIT', label: '🪑 Sit', defaultFps: 4 },
  { id: 'HAPPY', label: '😊 Happy', defaultFps: 6 },
  { id: 'SAD', label: '😢 Sad', defaultFps: 4 },
  { id: 'SURPRISED', label: '😮 Surprised', defaultFps: 6 },
  { id: 'DANCE', label: '💃 Dance', defaultFps: 8 },
  { id: 'MUSIC', label: '🎵 Music', defaultFps: 8 },
  { id: 'NOTIFICATION', label: '🔔 Notification', defaultFps: 6 },
  { id: 'DRAG', label: '🖱️ Drag', defaultFps: 4 },
  { id: 'PET', label: '💖 Pet / Affection', defaultFps: 6 },
  { id: 'CUSTOM', label: '✨ Custom State', defaultFps: 8 },
];

export default function AnimationStudioPage() {
  const [selectedState, setSelectedState] = useState('WALK');
  const [fps, setFps] = useState(8);
  const [loop, setLoop] = useState(true);
  const [direction, setDirection] = useState<'normal' | 'reverse' | 'alternate'>('normal');
  const [anchorPreset, setAnchorPreset] = useState<'center' | 'bottom-center' | 'top-center'>('bottom-center');
  const [canvasScale, setCanvasScale] = useState(100);

  // State-specific frame libraries
  const [stateFrames, setStateFrames] = useState<Record<string, FrameItem[]>>({
    IDLE: [
      { id: 'idle-1', name: 'idle_01.png', asset: '/assets/characters/bubu-reference.png', duration: 250 }
    ],
    WALK: [
      { id: 'walk-1', name: 'walk_01.png', asset: '/assets/characters/bubu-reference.png', duration: 125 },
      { id: 'walk-2', name: 'walk_02.png', asset: '/assets/characters/bubu-reference.png', duration: 125 }
    ],
    SLEEP: [
      { id: 'sleep-1', name: 'sleep_01.png', asset: '/assets/characters/bubu-reference.png', duration: 500 }
    ],
    DANCE: [
      { id: 'dance-1', name: 'dance_01.png', asset: '/assets/characters/bubu-reference.png', duration: 125 },
      { id: 'dance-2', name: 'dance_02.png', asset: '/assets/characters/bubu-reference.png', duration: 125 }
    ]
  });

  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [saveToast, setSaveToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeFrames = stateFrames[selectedState] || [];

  // Playback timer driven by FPS and per-frame duration
  useEffect(() => {
    if (!isPlaying || activeFrames.length === 0) return;

    const currentFrame = activeFrames[currentFrameIndex];
    const duration = currentFrame?.duration || (1000 / Math.max(1, fps));

    const timer = setTimeout(() => {
      setCurrentFrameIndex(prev => {
        if (prev >= activeFrames.length - 1) {
          return loop ? 0 : prev;
        }
        return prev + 1;
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [isPlaying, currentFrameIndex, activeFrames, fps, loop]);

  // Bulk image upload handler
  const handleImageFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFrames: FrameItem[] = [];
    const frameDuration = Math.round(1000 / Math.max(1, fps));

    Array.from(files).forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        newFrames.push({
          id: `${selectedState}-${Date.now()}-${idx}`,
          name: file.name,
          asset: base64,
          duration: frameDuration
        });

        if (newFrames.length === files.length) {
          // Sort frames by name (e.g. walk_01, walk_02)
          newFrames.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
          setStateFrames(prev => ({
            ...prev,
            [selectedState]: [...(prev[selectedState] || []), ...newFrames]
          }));
          setCurrentFrameIndex(0);
          setIsPlaying(true);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFrameDelete = (idx: number) => {
    setStateFrames(prev => {
      const updated = [...(prev[selectedState] || [])];
      updated.splice(idx, 1);
      return { ...prev, [selectedState]: updated };
    });
    if (currentFrameIndex >= activeFrames.length - 1) {
      setCurrentFrameIndex(Math.max(0, activeFrames.length - 2));
    }
  };

  const handleFrameMove = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= activeFrames.length) return;
    setStateFrames(prev => {
      const updated = [...(prev[selectedState] || [])];
      const [moved] = updated.splice(fromIdx, 1);
      updated.splice(toIdx, 0, moved);
      return { ...prev, [selectedState]: updated };
    });
    setCurrentFrameIndex(toIdx);
  };

  const handleFrameDurationChange = (idx: number, durationMs: number) => {
    setStateFrames(prev => {
      const updated = [...(prev[selectedState] || [])];
      if (updated[idx]) {
        updated[idx] = { ...updated[idx], duration: Math.max(20, durationMs) };
      }
      return { ...prev, [selectedState]: updated };
    });
  };

  const handleSaveAnimation = () => {
    const manifest = {
      state: selectedState,
      fps,
      loop,
      direction,
      anchorPreset,
      scale: canvasScale / 100,
      frames: activeFrames.map(f => ({
        name: f.name,
        duration: f.duration
      }))
    };

    // Save to localStorage or pass to Electron backend
    localStorage.setItem(`bubu-anim-${selectedState}`, JSON.stringify(manifest));

    // Notify Electron pet window if running
    if (window.electronAPI?.saveSettings) {
      window.electronAPI.saveSettings({ [`animation_${selectedState}`]: manifest });
    }

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div>
      {/* Hidden File Input for Bulk Adding */}
      <input
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => handleImageFiles(e.target.files)}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 className="page-title" style={{ margin: 0 }}>🕺 Animation Studio V3</h2>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Import your own character frames per animation state to generate smooth desktop companion movement.
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {saveToast && <span className="badge badge-success">✓ Saved to Desktop Pet!</span>}
          <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
            + Import Frame Images
          </button>
          <button className="btn btn-primary" onClick={handleSaveAnimation}>
            💾 Save Animation
          </button>
        </div>
      </div>

      {/* Main Grid: Preview & Controls */}
      <div className="grid grid-2" style={{ marginBottom: '20px' }}>
        {/* Playback Canvas Preview */}
        <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
          <div className="card-title" style={{ marginBottom: '16px' }}>
            State Preview: <span style={{ color: 'var(--accent)' }}>{selectedState}</span>
          </div>

          <div style={{
            width: '200px',
            height: '200px',
            margin: '0 auto',
            backgroundColor: '#0a0a10',
            borderRadius: '16px',
            border: '2px solid var(--border)',
            display: 'flex',
            alignItems: anchorPreset === 'bottom-center' ? 'flex-end' : anchorPreset === 'top-center' ? 'flex-start' : 'center',
            justifyContent: 'center',
            padding: '16px',
            overflow: 'hidden'
          }}>
            {activeFrames.length > 0 && activeFrames[currentFrameIndex] ? (
              <img
                src={activeFrames[currentFrameIndex].asset}
                alt={`Frame ${currentFrameIndex + 1}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  imageRendering: 'pixelated',
                  transform: `scale(${canvasScale / 100})`,
                  transition: 'transform 0.05s ease'
                }}
              />
            ) : (
              <div style={{ color: '#666', fontSize: '12px' }}>
                No frames added.<br />Click "+ Import Frame Images" to begin.
              </div>
            )}
          </div>

          {/* Transport Controls */}
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <button className="btn btn-ghost" onClick={() => setCurrentFrameIndex(prev => Math.max(0, prev - 1))}>
              ⏮
            </button>
            <button className="btn btn-primary" style={{ width: '48px' }} onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button className="btn btn-ghost" onClick={() => setCurrentFrameIndex(prev => (prev + 1) % (activeFrames.length || 1))}>
              ⏭
            </button>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '12px' }}>
              Frame {activeFrames.length ? currentFrameIndex + 1 : 0} of {activeFrames.length}
            </span>
          </div>
        </div>

        {/* State Selection & Frame Engine Controls */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: '16px' }}>Animation State & Timing</div>

          <div className="status-row">
            <span className="status-label">Target Animation State</span>
            <select
              value={selectedState}
              onChange={e => {
                setSelectedState(e.target.value);
                setCurrentFrameIndex(0);
              }}
              style={{ width: '180px' }}
            >
              {DEFAULT_STATES.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="status-row">
            <span className="status-label">Playback Speed ({fps} FPS)</span>
            <input
              type="range"
              min="1"
              max="30"
              value={fps}
              onChange={e => setFps(Number(e.target.value))}
              style={{ width: '140px' }}
            />
          </div>

          <div className="status-row">
            <span className="status-label">Loop Mode</span>
            <div
              className={`toggle ${loop ? 'active' : ''}`}
              onClick={() => setLoop(!loop)}
            />
          </div>

          <div className="status-row">
            <span className="status-label">Anchor Point</span>
            <select
              value={anchorPreset}
              onChange={e => setAnchorPreset(e.target.value as any)}
              style={{ width: '140px' }}
            >
              <option value="bottom-center">Bottom Center (Ground)</option>
              <option value="center">Center</option>
              <option value="top-center">Top Center (Ceiling)</option>
            </select>
          </div>

          <div className="status-row">
            <span className="status-label">Scale ({canvasScale}%)</span>
            <input
              type="range"
              min="50"
              max="200"
              value={canvasScale}
              onChange={e => setCanvasScale(Number(e.target.value))}
              style={{ width: '140px' }}
            />
          </div>
        </div>
      </div>

      {/* Frame Timeline & Reordering */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <span className="card-title">Frame Timeline & Duration</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '10px' }}>
              Drag, reorder, or customize per-frame durations in milliseconds.
            </span>
          </div>
          <button className="btn btn-ghost" style={{ fontSize: '11px' }} onClick={() => fileInputRef.current?.click()}>
            + Add Frames to {selectedState}
          </button>
        </div>

        {activeFrames.length === 0 ? (
          <div
            style={{
              padding: '40px',
              border: '2px dashed var(--border)',
              borderRadius: '12px',
              textAlign: 'center',
              cursor: 'pointer'
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
            <div style={{ fontWeight: 600 }}>Drop PNG / WebP images here or click to import</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Name them sequentially (e.g. {selectedState.toLowerCase()}_01.png, {selectedState.toLowerCase()}_02.png) for automatic timeline generation.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px' }}>
            {activeFrames.map((frame, idx) => (
              <div
                key={frame.id}
                style={{
                  minWidth: '130px',
                  padding: '10px',
                  borderRadius: '12px',
                  border: idx === currentFrameIndex ? '2px solid var(--accent)' : '1px solid var(--border)',
                  backgroundColor: idx === currentFrameIndex ? 'var(--accent-light)' : 'var(--bg-primary)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setCurrentFrameIndex(idx);
                    setIsPlaying(false);
                  }}
                >
                  <img
                    src={frame.asset}
                    alt={frame.name}
                    style={{ width: '60px', height: '60px', objectFit: 'contain', imageRendering: 'pixelated' }}
                  />
                  <div style={{ fontSize: '11px', fontWeight: 600, marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {frame.name}
                  </div>
                </div>

                {/* Duration input */}
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <input
                    type="number"
                    value={frame.duration}
                    onChange={e => handleFrameDurationChange(idx, Number(e.target.value))}
                    style={{ width: '56px', padding: '2px 4px', fontSize: '11px', textAlign: 'center', borderRadius: '4px', border: '1px solid var(--border)' }}
                  />
                  <span style={{ fontSize: '10px', color: '#888' }}>ms</span>
                </div>

                {/* Reorder and Delete Controls */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '8px' }}>
                  <button
                    className="btn btn-ghost"
                    style={{ padding: '2px 6px', fontSize: '10px' }}
                    disabled={idx === 0}
                    onClick={() => handleFrameMove(idx, idx - 1)}
                  >
                    ←
                  </button>
                  <button
                    className="btn btn-ghost"
                    style={{ padding: '2px 6px', fontSize: '10px' }}
                    disabled={idx === activeFrames.length - 1}
                    onClick={() => handleFrameMove(idx, idx + 1)}
                  >
                    →
                  </button>
                  <button
                    className="btn btn-ghost"
                    style={{ padding: '2px 6px', fontSize: '10px', color: '#ff6b6b' }}
                    onClick={() => handleFrameDelete(idx)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
