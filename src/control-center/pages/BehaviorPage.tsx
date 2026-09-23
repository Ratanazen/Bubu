import { useBehaviorStore, Personality } from "../../shared/store/behaviorStore";
import { useCharacterStore } from "../../shared/store/characterStore";
import { Bot, Battery, Sparkles, Activity } from "lucide-react";

export function BehaviorPage() {
    const { autonomousEnabled, personality, energy, mood, setAutonomousEnabled, setPersonality } = useBehaviorStore();
    const { emotion } = useCharacterStore();

    const personalities: Personality[] = ['Random', 'Energetic', 'Lazy', 'Focused', 'Playful'];

    return (
        <div style={{ padding: 20 }}>
            <h2>Autonomous Life Engine</h2>
            <p style={{ color: '#666' }}>When enabled, Bubu will automatically make decisions, move around, and live on your desktop based on energy, mood, and context.</p>
            
            <div style={{ marginTop: 20, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                        <div style={{ width: 60, height: 60, background: autonomousEnabled ? '#8b5cf6' : '#f1f5f9', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Bot size={28} color={autonomousEnabled ? '#fff' : '#94a3b8'} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, color: '#1e293b' }}>"I'm Alive" Mode</h3>
                            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: 14 }}>
                                {autonomousEnabled ? "Bubu is living and breathing." : "Bubu is waiting for commands."}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setAutonomousEnabled(!autonomousEnabled)}
                        style={{ padding: '8px 16px', borderRadius: 20, border: 'none', background: autonomousEnabled ? '#f3e8ff' : '#e0e7ff', color: autonomousEnabled ? '#9333ea' : '#4f46e5', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        {autonomousEnabled ? "Disable Autonomy" : "Enable Autonomy"}
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
                <div style={{ flex: 1, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 0 }}><Activity size={18}/> Status</h3>
                    <div style={{ marginTop: 15 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                            <strong>Current Action:</strong>
                            <span style={{ textTransform: 'capitalize', color: '#3b82f6' }}>{emotion}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                            <strong>Mood:</strong>
                            <span style={{ color: '#10b981' }}>{mood}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, alignItems: 'center' }}>
                            <strong style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Battery size={14}/> Energy:</strong>
                            <div style={{ width: 100, height: 10, background: '#eee', borderRadius: 5, overflow: 'hidden' }}>
                                <div style={{ width: `${energy}%`, height: '100%', background: energy > 30 ? '#10b981' : '#ef4444', transition: 'width 0.5s ease' }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 0 }}><Sparkles size={18}/> Personality</h3>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 15 }}>
                        {personalities.map(p => (
                            <button
                                key={p}
                                onClick={() => setPersonality(p)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: 4,
                                    border: 'none',
                                    background: personality === p ? '#3b82f6' : '#f1f5f9',
                                    color: personality === p ? '#fff' : '#475569',
                                    cursor: 'pointer'
                                }}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
