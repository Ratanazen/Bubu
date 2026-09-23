import { useState } from "react";
import { useSkinStore, ActionName, ActionFrame } from "../../shared/store/skinStore";
import { Folder, Trash, Scissors, Settings } from "lucide-react";

export function AssetManagerPage() {
    const { actions, setAction, deleteAction } = useSkinStore();
    const [selectedAction, setSelectedAction] = useState<ActionName>("idle");
    const [fps, setFps] = useState(8);
    const [scale, setScale] = useState(1);
    
    // Simple Mode
    const [urls, setUrls] = useState(""); 
    
    // Sprite Sheet Mode
    const [sheetUrl, setSheetUrl] = useState("");
    const [cols, setCols] = useState(1);
    const [rows, setRows] = useState(1);
    const [frameW, setFrameW] = useState(32);
    const [frameH, setFrameH] = useState(32);
    const [mode, setMode] = useState<'simple' | 'sheet'>('simple');

    const handleSaveSimple = () => {
        const frames = urls.split(',').map(u => ({ url: u.trim() })).filter(f => f.url.length > 0);
        if (frames.length > 0) setAction(selectedAction, { fps, frames, scale });
    };

    const handleSaveSheet = () => {
        if (!sheetUrl) return;
        const frames: ActionFrame[] = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                frames.push({
                    url: sheetUrl.trim(),
                    x: c * frameW,
                    y: r * frameH,
                    w: frameW,
                    h: frameH,
                    offsetX: 0,
                    offsetY: 0
                });
            }
        }
        setAction(selectedAction, { fps, frames, scale });
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Character Sprite Studio</h2>
            <p style={{ color: '#666' }}>Upload custom pixels, map actions (eat, sleep, code), and slice sprite sheets.</p>
            
            <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
                {/* Available Actions */}
                <div style={{ flex: 1, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20, maxHeight: 600, overflowY: 'auto' }}>
                    <h3 style={{ marginTop: 0 }}><Folder size={18}/> Mapped Actions</h3>
                    {Object.keys(actions).map(act => (
                        <div key={act} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' }}>
                            <div>
                                <strong style={{ display: 'block', textTransform: 'uppercase' }}>{act}</strong>
                                <span style={{ fontSize: 12, color: '#888' }}>{actions[act].frames.length} frames @ {actions[act].fps} FPS</span>
                            </div>
                            <button onClick={() => deleteAction(act)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash size={16}/></button>
                        </div>
                    ))}
                </div>

                {/* Assignment UI */}
                <div style={{ flex: 1.5, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
                    <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}><Settings size={18}/> Configure Action</h3>
                    
                    <div style={{ marginTop: 15 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', fontSize: 14 }}>Target Action Name:</label>
                        <select value={selectedAction} onChange={e => setSelectedAction(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 5, borderRadius: 4, border: '1px solid #ccc' }}>
                            <optgroup label="Basic">
                                <option value="idle">Idle</option><option value="walk">Walk</option><option value="run">Run</option><option value="sit">Sit</option><option value="sleep">Sleep</option>
                            </optgroup>
                            <optgroup label="Emotion">
                                <option value="happy">Happy</option><option value="sad">Sad</option><option value="surprised">Surprised</option><option value="angry">Angry</option>
                            </optgroup>
                            <optgroup label="Computer Life">
                                <option value="code">Code</option><option value="type">Type</option><option value="think">Think</option><option value="gaming">Gaming</option>
                            </optgroup>
                            <optgroup label="Music">
                                <option value="dance">Dance</option><option value="sing">Sing</option><option value="listen">Listen</option>
                            </optgroup>
                            <option value="custom">-- Custom Type Name --</option>
                        </select>
                        {selectedAction === 'custom' && (
                            <input type="text" placeholder="custom_name" onChange={e => setSelectedAction(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 5 }} />
                        )}
                    </div>

                    <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontWeight: 'bold', fontSize: 14 }}>FPS:</label>
                            <input type="number" value={fps} onChange={e => setFps(Number(e.target.value))} style={{ width: '100%', padding: 8, marginTop: 5 }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontWeight: 'bold', fontSize: 14 }}>Scale Multiplier:</label>
                            <input type="number" step="0.1" value={scale} onChange={e => setScale(Number(e.target.value))} style={{ width: '100%', padding: 8, marginTop: 5 }} />
                        </div>
                    </div>

                    <div style={{ marginTop: 25, display: 'flex', gap: 10, borderBottom: '2px solid #eee', paddingBottom: 10 }}>
                        <button onClick={() => setMode('simple')} style={{ flex: 1, padding: 8, background: mode === 'simple' ? '#3b82f6' : '#eee', color: mode === 'simple' ? '#fff' : '#333', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}>Individual Images</button>
                        <button onClick={() => setMode('sheet')} style={{ flex: 1, padding: 8, background: mode === 'sheet' ? '#3b82f6' : '#eee', color: mode === 'sheet' ? '#fff' : '#333', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Scissors size={14}/> Sprite Sheet</button>
                    </div>

                    {mode === 'simple' ? (
                        <div style={{ marginTop: 15 }}>
                            <label style={{ display: 'block', fontWeight: 'bold', fontSize: 14, color: '#666' }}>Comma-separated URLs (PNG/WEBP):</label>
                            <textarea value={urls} onChange={e => setUrls(e.target.value)} rows={3} style={{ width: '100%', padding: 8, marginTop: 5, borderRadius: 4, border: '1px solid #ccc' }} placeholder="/path/to/frame1.png, /path/to/frame2.png" />
                            <button onClick={handleSaveSimple} style={{ marginTop: 15, width: '100%', padding: 12, background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>Save Simple Frames</button>
                        </div>
                    ) : (
                        <div style={{ marginTop: 15 }}>
                            <label style={{ display: 'block', fontWeight: 'bold', fontSize: 14, color: '#666' }}>Sprite Sheet URL:</label>
                            <input type="text" value={sheetUrl} onChange={e => setSheetUrl(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 5, border: '1px solid #ccc', borderRadius: 4 }} placeholder="/path/to/sheet.png" />
                            
                            <div style={{ display: 'flex', gap: 10, marginTop: 15 }}>
                                <div style={{ flex: 1 }}><label style={{ fontSize: 12, fontWeight: 'bold' }}>Columns</label><input type="number" value={cols} onChange={e => setCols(Number(e.target.value))} style={{ width: '100%', padding: 6 }} /></div>
                                <div style={{ flex: 1 }}><label style={{ fontSize: 12, fontWeight: 'bold' }}>Rows</label><input type="number" value={rows} onChange={e => setRows(Number(e.target.value))} style={{ width: '100%', padding: 6 }} /></div>
                                <div style={{ flex: 1 }}><label style={{ fontSize: 12, fontWeight: 'bold' }}>Frame W (px)</label><input type="number" value={frameW} onChange={e => setFrameW(Number(e.target.value))} style={{ width: '100%', padding: 6 }} /></div>
                                <div style={{ flex: 1 }}><label style={{ fontSize: 12, fontWeight: 'bold' }}>Frame H (px)</label><input type="number" value={frameH} onChange={e => setFrameH(Number(e.target.value))} style={{ width: '100%', padding: 6 }} /></div>
                            </div>
                            <button onClick={handleSaveSheet} style={{ marginTop: 15, width: '100%', padding: 12, background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>Slice & Save Sprite Sheet</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
