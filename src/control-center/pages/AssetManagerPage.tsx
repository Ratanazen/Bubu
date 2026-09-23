import { useState } from "react";
import { useSkinStore, ActionName } from "../../shared/store/skinStore";
import { Folder, Upload, Trash } from "lucide-react";

export function AssetManagerPage() {
    const { actions, setAction, deleteAction } = useSkinStore();
    const [selectedAction, setSelectedAction] = useState<ActionName>("idle");
    const [fps, setFps] = useState(1);
    const [urls, setUrls] = useState(""); // comma separated for quick demo

    const handleSave = () => {
        const frames = urls.split(',').map(u => ({ url: u.trim() })).filter(f => f.url.length > 0);
        if (frames.length > 0) {
            setAction(selectedAction, { fps, frames });
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Action Library & Custom Skins</h2>
            <p style={{ color: '#666' }}>Map custom multi-frame animations to Bubu's actions. If an action is missing, Bubu uses Smart Fallbacks.</p>
            
            <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
                {/* Available Actions */}
                <div style={{ flex: 1, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20, maxHeight: 400, overflowY: 'auto' }}>
                    <h3 style={{ marginTop: 0 }}><Folder size={18}/> Mapped Actions</h3>
                    {Object.keys(actions).map(act => (
                        <div key={act} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
                            <strong>{act.toUpperCase()}</strong>
                            <span>{actions[act].frames.length} frames ({actions[act].fps} FPS)</span>
                            <button onClick={() => deleteAction(act)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash size={14}/></button>
                        </div>
                    ))}
                </div>

                {/* Assignment UI */}
                <div style={{ flex: 1, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
                    <h3 style={{ marginTop: 0 }}><Upload size={18}/> Assign New Action</h3>
                    
                    <div style={{ marginTop: 15 }}>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>Action Name (e.g. eat, laugh, code):</label>
                        <input type="text" value={selectedAction} onChange={e => setSelectedAction(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 5 }} />
                    </div>

                    <div style={{ marginTop: 15 }}>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>Frame URLs (comma separated absolute paths):</label>
                        <textarea value={urls} onChange={e => setUrls(e.target.value)} rows={3} style={{ width: '100%', padding: 8, marginTop: 5 }} placeholder="/absolute/path/frame1.png, /absolute/path/frame2.png" />
                    </div>

                    <div style={{ marginTop: 15 }}>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>FPS (Speed):</label>
                        <input type="number" value={fps} onChange={e => setFps(Number(e.target.value))} style={{ width: '100%', padding: 8, marginTop: 5 }} />
                    </div>

                    <button onClick={handleSave} style={{ marginTop: 20, width: '100%', padding: 10, background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                        Save Mapping
                    </button>
                </div>
            </div>
        </div>
    );
}
