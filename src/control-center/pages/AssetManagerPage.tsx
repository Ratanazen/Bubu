import { useState, useEffect } from "react";
import { useSkinStore, ActionName, ActionFrame } from "../../shared/store/skinStore";
import { 
    Folder, Trash, Settings, Plus, Play, Pause, 
    Footprints, Zap, Moon, Music, Terminal, Coffee, Image as ImageIcon, Smile, Frown 
} from "lucide-react";

const getActionIcon = (action: string) => {
    const a = action.toLowerCase();
    if (a.includes('walk') || a.includes('run')) return <Footprints size={16} />;
    if (a.includes('sleep')) return <Moon size={16} />;
    if (a.includes('dance') || a.includes('sing')) return <Music size={16} />;
    if (a.includes('code') || a.includes('type')) return <Terminal size={16} />;
    if (a.includes('eat') || a.includes('drink')) return <Coffee size={16} />;
    if (a.includes('happy') || a.includes('laugh')) return <Smile size={16} />;
    if (a.includes('sad') || a.includes('cry')) return <Frown size={16} />;
    if (a.includes('jump')) return <Zap size={16} />;
    return <ImageIcon size={16} />;
};

export function AssetManagerPage() {
    const { actions, setAction, deleteAction } = useSkinStore();
    
    // Editor State
    const [selectedAction, setSelectedAction] = useState<ActionName>("walk");
    const [customAction, setCustomAction] = useState("");
    const [fps, setFps] = useState(8);
    const [scale, setScale] = useState(1);
    const [frames, setFrames] = useState<ActionFrame[]>([]);
    
    // Preview State
    const [previewPlaying, setPreviewPlaying] = useState(true);
    const [previewFrame, setPreviewFrame] = useState(0);

    const activeAction = selectedAction === 'custom' ? customAction : selectedAction;

    // Load existing action into editor when selected
    useEffect(() => {
        if (selectedAction !== 'custom' && actions[selectedAction]) {
            setFrames(actions[selectedAction].frames || []);
            setFps(actions[selectedAction].fps || 8);
            setScale(actions[selectedAction].scale || 1);
        } else if (selectedAction !== 'custom') {
            setFrames([]);
        }
    }, [selectedAction, actions]);

    // Live Preview Loop
    useEffect(() => {
        if (!previewPlaying || frames.length === 0) return;
        const interval = setInterval(() => {
            setPreviewFrame(prev => (prev + 1) % frames.length);
        }, 1000 / Math.max(1, fps));
        return () => clearInterval(interval);
    }, [previewPlaying, frames.length, fps]);

    // Reset preview frame when frames change
    useEffect(() => {
        if (previewFrame >= frames.length) setPreviewFrame(0);
    }, [frames.length]);

    const handlePasteUrls = (text: string) => {
        // Split by comma or newline, trim, filter empty
        const urls = text.split(/[\n,]+/).map(u => u.trim()).filter(u => u.length > 0);
        
        // Auto-sort based on numbers in filename (e.g. walk_01.png, walk_02.png)
        urls.sort((a, b) => {
            const numA = a.match(/\d+/g)?.pop() || "0";
            const numB = b.match(/\d+/g)?.pop() || "0";
            return parseInt(numA) - parseInt(numB);
        });

        const newFrames = urls.map(url => ({ url, offsetX: 0, offsetY: 0 }));
        setFrames(prev => [...prev, ...newFrames]);
    };

    const handleSave = () => {
        if (!activeAction || frames.length === 0) return;
        setAction(activeAction.toLowerCase(), { fps, frames, scale });
    };

    const removeFrame = (index: number) => {
        setFrames(frames.filter((_, i) => i !== index));
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Animation Studio</h2>
            <p style={{ color: '#666' }}>Map multiple images into a single animation state.</p>
            
            <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
                {/* Available Actions Sidebar */}
                <div style={{ flex: 1, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20, maxHeight: 650, overflowY: 'auto' }}>
                    <h3 style={{ marginTop: 0 }}><Folder size={18}/> Mapped Actions</h3>
                    {Object.keys(actions).map(act => (
                        <div key={act} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee', background: activeAction === act ? '#f0f9ff' : 'transparent' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ color: '#3b82f6' }}>{getActionIcon(act)}</div>
                                <div>
                                    <strong style={{ display: 'block', textTransform: 'uppercase' }}>{act}</strong>
                                    <span style={{ fontSize: 12, color: '#888' }}>{actions[act].frames.length} frames @ {actions[act].fps} FPS</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button onClick={() => setSelectedAction(act)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 'bold' }}>Edit</button>
                                <button onClick={() => deleteAction(act)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash size={16}/></button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Editor */}
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 20 }}>
                    
                    {/* Action Selector */}
                    <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
                        <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}><Settings size={18}/> 1. Select Action</h3>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <select value={selectedAction} onChange={e => setSelectedAction(e.target.value)} style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}>
                                <optgroup label="Basic">
                                    <option value="idle">Idle</option><option value="walk">Walk</option><option value="run">Run</option><option value="jump">Jump</option><option value="sit">Sit</option><option value="sleep">Sleep</option>
                                </optgroup>
                                <optgroup label="Emotion">
                                    <option value="happy">Happy</option><option value="sad">Sad</option><option value="surprised">Surprised</option><option value="angry">Angry</option><option value="laugh">Laugh</option><option value="cry">Cry</option>
                                </optgroup>
                                <optgroup label="Computer Life">
                                    <option value="code">Code</option><option value="type">Type</option><option value="think">Think</option><option value="gaming">Gaming</option><option value="read">Read</option>
                                </optgroup>
                                <optgroup label="Music">
                                    <option value="dance">Dance</option><option value="sing">Sing</option><option value="listen">Listen</option>
                                </optgroup>
                                <option value="custom">-- Custom Type Name --</option>
                            </select>
                            {selectedAction === 'custom' && (
                                <input type="text" placeholder="custom_action_name" value={customAction} onChange={e => setCustomAction(e.target.value)} style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }} />
                            )}
                        </div>
                    </div>

                    {/* Frame Slots */}
                    <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
                        <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>2. Animation Frames</span>
                            <span style={{ fontSize: 14, color: '#666', fontWeight: 'normal' }}>{frames.length} frames</span>
                        </h3>
                        
                        {/* Drag/Paste Dropzone */}
                        <div style={{ marginBottom: 20 }}>
                            <textarea 
                                placeholder="Paste multiple image URLs/paths here (comma or newline separated). They will be automatically sorted and added as frames."
                                rows={2}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        handlePasteUrls(e.target.value);
                                        e.target.value = ''; // clear after reading
                                    }
                                }}
                                style={{ width: '100%', padding: 10, borderRadius: 6, border: '2px dashed #cbd5e1', resize: 'vertical' }}
                            />
                        </div>

                        {/* Visual Frame Slots */}
                        <div style={{ display: 'flex', gap: 15, overflowX: 'auto', paddingBottom: 15 }}>
                            {frames.map((frame, idx) => (
                                <div key={idx} style={{ minWidth: 100, border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden', position: 'relative', background: '#f8fafc' }}>
                                    
                                    {/* Action Icon Badge */}
                                    <div style={{ position: 'absolute', top: 5, left: 5, background: 'rgba(255,255,255,0.9)', borderRadius: '50%', padding: 4, display: 'flex', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                        {getActionIcon(activeAction)}
                                    </div>
                                    
                                    {/* Delete Button */}
                                    <button onClick={() => removeFrame(idx)} style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Trash size={12}/>
                                    </button>

                                    {/* Image Thumbnail */}
                                    <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                                        <img src={frame.url} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', imageRendering: 'pixelated' }} alt={`Frame ${idx + 1}`} />
                                    </div>
                                    
                                    {/* Label */}
                                    <div style={{ padding: 8, background: '#e2e8f0', fontSize: 12, textAlign: 'center', fontWeight: 'bold', color: '#475569' }}>
                                        Frame {idx + 1}
                                    </div>
                                </div>
                            ))}

                            {/* Add Single Frame Button */}
                            <div 
                                onClick={() => {
                                    const url = prompt("Enter image URL/path:");
                                    if (url) setFrames([...frames, { url, offsetX: 0, offsetY: 0 }]);
                                }}
                                style={{ minWidth: 100, height: 135, border: '2px dashed #cbd5e1', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', background: '#f8fafc' }}
                            >
                                <Plus size={24} />
                                <span style={{ fontSize: 12, marginTop: 5, fontWeight: 'bold' }}>Add Frame</span>
                            </div>
                        </div>
                    </div>

                    {/* Preview & Save */}
                    <div style={{ display: 'flex', gap: 20 }}>
                        <div style={{ flex: 1, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
                            <h3 style={{ marginTop: 0 }}>3. Settings</h3>
                            <label style={{ display: 'block', fontWeight: 'bold', fontSize: 14 }}>FPS (Speed):</label>
                            <input type="number" value={fps} onChange={e => setFps(Number(e.target.value))} style={{ width: '100%', padding: 10, marginTop: 5, borderRadius: 4, border: '1px solid #ccc' }} />
                            
                            <label style={{ display: 'block', fontWeight: 'bold', fontSize: 14, marginTop: 15 }}>Scale Multiplier:</label>
                            <input type="number" step="0.1" value={scale} onChange={e => setScale(Number(e.target.value))} style={{ width: '100%', padding: 10, marginTop: 5, borderRadius: 4, border: '1px solid #ccc' }} />
                            
                            <button onClick={handleSave} style={{ marginTop: 25, width: '100%', padding: 15, background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 16, fontWeight: 'bold' }}>
                                Save {activeAction.toUpperCase()} Animation
                            </button>
                        </div>

                        <div style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: 20, color: '#fff', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                Live Preview
                                <div style={{ display: 'flex', gap: 5 }}>
                                    <button onClick={() => setPreviewPlaying(!previewPlaying)} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 4, padding: 5, cursor: 'pointer' }}>
                                        {previewPlaying ? <Pause size={16}/> : <Play size={16}/>}
                                    </button>
                                </div>
                            </h3>
                            
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
                                {frames.length > 0 ? (
                                    <img 
                                        src={frames[previewFrame]?.url} 
                                        style={{ 
                                            maxWidth: 150 * scale, 
                                            maxHeight: 150 * scale, 
                                            imageRendering: 'pixelated',
                                            transform: `translateX(${frames[previewFrame]?.offsetX || 0}px) translateY(${frames[previewFrame]?.offsetY || 0}px)`
                                        }} 
                                    />
                                ) : (
                                    <span style={{ color: '#64748b' }}>No frames</span>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
