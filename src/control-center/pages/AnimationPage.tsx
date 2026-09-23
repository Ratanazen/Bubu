
import { useCharacterStore, Emotion } from "../../shared/store/characterStore";

export function AnimationPage() {
    const { emotion, setEmotion, setSpeechText } = useCharacterStore();

    const emotions: Emotion[] = ['idle', 'happy', 'sad', 'sleep', 'run', 'dance'];

    return (
        <div style={{ padding: 20 }}>
            <h2>Animation & Emotion Tester</h2>
            <p>Click below to test Bubu's live reactions.</p>
            
            <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
                {/* Properties Panel */}
                <div style={{ flex: 1, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
                    <h3>Trigger Emotions</h3>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 15 }}>
                        {emotions.map(e => (
                            <button 
                                key={e}
                                onClick={() => setEmotion(e)}
                                style={{ 
                                    padding: '8px 16px', 
                                    background: emotion === e ? '#3b82f6' : '#e2e8f0', 
                                    color: emotion === e ? '#fff' : '#333', 
                                    border: 'none', 
                                    borderRadius: 4, 
                                    cursor: 'pointer',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {e}
                            </button>
                        ))}
                    </div>

                    <h3 style={{ marginTop: 25 }}>Trigger Speech</h3>
                    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                        <button onClick={() => setSpeechText("Hello world!")} style={{ padding: '8px 16px' }}>Say Hello</button>
                        <button onClick={() => setSpeechText("I love Rust! 🦀")} style={{ padding: '8px 16px' }}>Say Rust</button>
                        <button onClick={() => setSpeechText(null)} style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none' }}>Clear Speech</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
