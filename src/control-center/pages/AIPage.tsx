import { useState } from "react";
import { useAIStore } from "../../shared/store/aiStore";
import { useContextStore } from "../../shared/store/contextStore";
import { useMusicStore } from "../../shared/store/musicStore";
import { useCharacterStore } from "../../shared/store/characterStore";
import { invoke } from "@tauri-apps/api/core";
import { BrainCircuit, MessageCircle, Lock, Loader2 } from "lucide-react";

export function AIPage() {
    const { apiKey, enabled, setApiKey, setEnabled } = useAIStore();
    const { activeWindow } = useContextStore();
    const { media } = useMusicStore();
    const { setSpeechText, setEmotion } = useCharacterStore();
    
    const [testResponse, setTestResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const testBrain = async () => {
        if (!apiKey) return;
        setLoading(true);
        try {
            const res = await invoke<string>("generate_chat", {
                apiKey,
                activeApp: activeWindow?.app_name || null,
                currentSong: media?.title || null
            });
            setTestResponse(res);
            setSpeechText(res);
            setEmotion("happy");
            setTimeout(() => { setSpeechText(null); setEmotion("idle"); }, 5000);
        } catch (e) {
            console.error(e);
            setTestResponse("Error contacting Gemini: " + e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Smart Personality Engine</h2>
            <p style={{ color: '#666' }}>Bubu can occasionally make witty comments about what you're doing. This runs securely via the Gemini API.</p>
            
            <div style={{ marginTop: 20, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                        <div style={{ width: 60, height: 60, background: enabled ? '#10b981' : '#f1f5f9', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BrainCircuit size={28} color={enabled ? '#fff' : '#94a3b8'} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, color: '#1e293b' }}>AI Personality</h3>
                            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: 14 }}>
                                {enabled ? "Active and thinking" : "Strictly Offline Mode"}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setEnabled(!enabled)}
                        style={{ padding: '8px 16px', borderRadius: 20, border: 'none', background: enabled ? '#fee2e2' : '#e0e7ff', color: enabled ? '#ef4444' : '#4f46e5', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        {enabled ? "Disable AI" : "Enable AI"}
                    </button>
                </div>

                <div style={{ marginTop: 25 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 'bold', marginBottom: 10, color: '#334155' }}>
                        <Lock size={16} /> Gemini API Key
                    </label>
                    <input 
                        type="password" 
                        value={apiKey} 
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="AIzaSy..." 
                        style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14 }}
                    />
                </div>
            </div>

            {enabled && (
                <div style={{ marginTop: 20, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
                    <h3>Test Bubu's Brain</h3>
                    <p style={{ color: '#64748b', fontSize: 14 }}>Sends your active app ({activeWindow?.app_name || 'None'}) and song ({media?.title || 'None'}) to Gemini.</p>
                    <button 
                        onClick={testBrain}
                        disabled={!apiKey || loading}
                        style={{ marginTop: 10, padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: loading || !apiKey ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <MessageCircle size={16} />}
                        {loading ? "Thinking..." : "Generate Test Response"}
                    </button>
                    
                    {testResponse && (
                        <div style={{ marginTop: 20, padding: 15, background: '#fff', borderLeft: '4px solid #8b5cf6', borderRadius: 4, fontStyle: 'italic', color: '#475569' }}>
                            "{testResponse}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
