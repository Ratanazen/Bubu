import { Play, Pause, Plus, Save } from "lucide-react";

export function AnimationPage() {
    return (
        <div style={{ padding: 20 }}>
            <h2>Animation Editor</h2>
            <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
                {/* Preview Panel */}
                <div style={{ flex: 1, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 150, height: 150, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #ccc' }}>
                        Preview
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 15 }}>
                        <button style={{ padding: '8px 12px' }}><Play size={16} /></button>
                        <button style={{ padding: '8px 12px' }}><Pause size={16} /></button>
                    </div>
                </div>

                {/* Properties Panel */}
                <div style={{ flex: 1, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
                    <h3>Timeline Settings</h3>
                    <div style={{ marginTop: 15 }}>
                        <label>Animation Name: <input type="text" defaultValue="idle" style={{ width: '100%' }} /></label>
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <label>FPS: <input type="number" defaultValue={8} style={{ width: '100%' }} /></label>
                    </div>
                    <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                        <button style={{ flex: 1, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Plus size={16} /> Add Frame</button>
                        <button style={{ flex: 1, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#1e1e2e', color: '#fff' }}><Save size={16} /> Save</button>
                    </div>
                </div>
            </div>

            {/* Timeline Strip */}
            <div style={{ marginTop: 20, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20, overflowX: 'auto' }}>
                <h3 style={{ marginBottom: 10 }}>Frames</h3>
                <div style={{ display: 'flex', gap: 10 }}>
                    {[1, 2, 3, 4].map(f => (
                        <div key={f} style={{ minWidth: 80, height: 80, background: '#eee', border: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Frame {f}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
