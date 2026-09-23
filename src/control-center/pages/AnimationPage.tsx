import { useCharacterStore } from "../../shared/store/characterStore";


export function AnimationPage() {
    const { characters, updateCharacter } = useCharacterStore();
    console.log(characters['bubu']?.emotion || 'idle');

    return (
        <div style={{ padding: 20 }}>
            <h2>Animation Studio</h2>
            <div style={{ marginTop: 20 }}>
                <h3>Set Emotion</h3>
                {['idle', 'happy', 'sad', 'sleep', 'dance', 'code'].map(e => (
                    <button key={e} onClick={() => updateCharacter('bubu', { emotion: e })} style={{ margin: 5, padding: 10 }}>{e}</button>
                ))}
            </div>
            <div style={{ marginTop: 20 }}>
                <h3>Speech Test</h3>
                <button onClick={() => updateCharacter('bubu', { speechText: "Hello!" })} style={{ margin: 5, padding: 10 }}>Say Hello</button>
                <button onClick={() => updateCharacter('bubu', { speechText: null })} style={{ margin: 5, padding: 10 }}>Clear</button>
            </div>
        </div>
    );
}
