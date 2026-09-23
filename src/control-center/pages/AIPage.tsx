import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useCharacterStore } from "../../shared/store/characterStore";


export function AIPage() {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const { updateCharacter } = useCharacterStore();

    const generateResponse = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        try {
            const res: string = await invoke("generate_chat", { prompt });
            updateCharacter('bubu', { speechText: res, emotion: 'happy' });
            setTimeout(() => {
                updateCharacter('bubu', { speechText: null, emotion: 'idle' });
            }, 5000);
        } catch (e) {
            console.error(e);
            updateCharacter('bubu', { speechText: "I couldn't reach my brain...", emotion: 'sad' });
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Smart Personality Engine</h2>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <input value={prompt} onChange={e => setPrompt(e.target.value)} style={{ flex: 1, padding: 10 }} />
                <button onClick={generateResponse} disabled={loading} style={{ padding: 10 }}>Generate</button>
            </div>
        </div>
    );
}
