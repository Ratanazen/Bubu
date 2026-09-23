import { useMovementStore, WalkSpeed } from "../../shared/store/movementStore";

import { Navigation, Footprints, Trash, MapPin } from "lucide-react";
import { useState } from "react";

export function MovementPage() {
    const { walkSpeed, clickToMove, setWalkSpeed, setClickToMove, setIsSelectingTarget, presets, addPreset, removePreset, setTargetPosition } = useMovementStore();
    const [newPresetName, setNewPresetName] = useState("");

    const handleSelectTarget = () => {
        setIsSelectingTarget(true);
    };

    const handleSavePreset = () => {
        if (!newPresetName) return;
        // In a real app we'd fetch current pet pos, or let user pick. For demo, we just save a mock center pos.
        // Or we let them pick!
        const id = Date.now().toString();
        addPreset({ id, name: newPresetName, x: 500, y: 500 }); 
        setNewPresetName("");
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Movement Engine & Walk-to-Location</h2>
            <p style={{ color: '#666' }}>Control how Bubu physically moves around your desktop.</p>
            
            <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
                {/* Controls */}
                <div style={{ flex: 1, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 0 }}><Navigation size={18}/> Manual Control</h3>
                    
                    <button onClick={handleSelectTarget} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 16, fontWeight: 'bold' }}>
                        <MapPin size={20} /> Select Destination on Desktop
                    </button>
                    
                    <p style={{ fontSize: 13, color: '#999', marginTop: 10 }}>Click above, then click anywhere on your screen. Bubu will turn and walk there.</p>

                    <div style={{ marginTop: 25 }}>
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 'bold' }}>
                            Walk Speed:
                            <select value={walkSpeed} onChange={e => setWalkSpeed(e.target.value as WalkSpeed)} style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}>
                                <option value="Slow">Slow</option>
                                <option value="Normal">Normal</option>
                                <option value="Fast">Fast</option>
                            </select>
                        </label>
                    </div>

                    <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 15, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                        <div>
                            <strong style={{ display: 'block' }}>Click-to-Move Mode</strong>
                            <span style={{ fontSize: 13, color: '#64748b' }}>If enabled, clicking the desktop always moves Bubu.</span>
                        </div>
                        <input type="checkbox" checked={clickToMove} onChange={e => setClickToMove(e.target.checked)} style={{ transform: 'scale(1.5)' }} />
                    </div>
                </div>

                {/* Presets */}
                <div style={{ flex: 1, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 0 }}><Footprints size={18}/> Saved Locations</h3>
                    
                    <div style={{ display: 'flex', gap: 8, marginBottom: 15 }}>
                        <input type="text" placeholder="Preset Name (e.g. Center)" value={newPresetName} onChange={e => setNewPresetName(e.target.value)} style={{ flex: 1, padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
                        <button onClick={handleSavePreset} style={{ padding: '8px 16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Save</button>
                    </div>

                    <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                        {presets.map(p => (
                            <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
                                <button onClick={() => setTargetPosition({ x: p.x, y: p.y })} style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: 'bold', cursor: 'pointer' }}>
                                    {p.name}
                                </button>
                                <button onClick={() => removePreset(p.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash size={14}/></button>
                            </div>
                        ))}
                        {presets.length === 0 && <p style={{ color: '#999', textAlign: 'center' }}>No saved locations yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
