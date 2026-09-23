import { useState } from "react";
import { useCharacterStore } from "../../shared/store/characterStore";
import { useRelationshipStore } from "../../shared/store/relationshipStore";
import { useBehaviorStore } from "../../shared/store/behaviorStore";
import { Users, Plus, Play, Square, Heart } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";

export function CharacterManagerPage() {
    const { characters, addCharacter,  updateCharacter } = useCharacterStore();
    const { autonomousEnabled, setAutonomousEnabled } = useBehaviorStore();
    const { relationships, updateRelationship } = useRelationshipStore();
    const [newCharId, setNewCharId] = useState("");

    const handleSpawn = (id: string) => {
        invoke("spawn_pet_window", { id }).catch(console.error);
    };

    const handleAdd = () => {
        if (!newCharId) return;
        const id = newCharId.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (characters[id]) return;
        
        addCharacter({
            id,
            name: newCharId,
            emotion: 'idle',
            speechText: null,
            x: 200,
            y: 200,
            personality: 'Playful',
            energy: 100,
            mood: 'Happy'
        });
        setNewCharId("");
    };

    return (
        <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>Multi-Character Engine</h2>
                    <p style={{ color: '#666' }}>Spawn Bubu, Bibi, and friends! They will interact autonomously.</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button 
                        onClick={() => setAutonomousEnabled(!autonomousEnabled)}
                        style={{ padding: '10px 20px', background: autonomousEnabled ? '#ef4444' : '#10b981', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 'bold' }}
                    >
                        {autonomousEnabled ? <Square size={18}/> : <Play size={18}/>}
                        {autonomousEnabled ? 'STOP AUTONOMOUS LIFE' : 'START AUTONOMOUS LIFE'}
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
                {/* Character Roster */}
                <div style={{ flex: 1, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
                    <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}><Users size={18}/> Roster</h3>
                    
                    <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                        <input value={newCharId} onChange={e => setNewCharId(e.target.value)} placeholder="New Character Name" style={{ flex: 1, padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
                        <button onClick={handleAdd} style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}><Plus size={16}/></button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                        {Object.values(characters).map(char => (
                            <div key={char.id} style={{ padding: 15, border: '1px solid #eee', borderRadius: 8, background: '#f8fafc' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <strong style={{ fontSize: 18 }}>{char.name}</strong>
                                    <button onClick={() => handleSpawn(char.id)} style={{ padding: '5px 10px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Spawn Window</button>
                                </div>
                                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
                                    <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        Personality:
                                        <select value={char.personality} onChange={e => updateCharacter(char.id, { personality: e.target.value as any })}>
                                            <option>Playful</option><option>Calm</option><option>Energetic</option><option>Lazy</option>
                                        </select>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Relationship Editor */}
                <div style={{ flex: 1, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
                    <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}><Heart size={18}/> Relationships</h3>
                    
                    {Object.keys(characters).length >= 2 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                            {Object.keys(relationships).map(pair => {
                                const rel = relationships[pair];
                                return (
                                    <div key={pair} style={{ padding: 15, border: '1px solid #eee', borderRadius: 8 }}>
                                        <strong style={{ fontSize: 16 }}>{pair.replace('-', ' ❤️ ')}</strong>
                                        
                                        <div style={{ marginTop: 15, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                Level:
                                                <select value={rel.level} onChange={e => updateRelationship(pair, { level: e.target.value as any })}>
                                                    <option>Stranger</option><option>Friend</option><option>Close Friend</option><option>Lovers</option>
                                                </select>
                                            </label>
                                            
                                            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                Play Together:
                                                <input type="checkbox" checked={rel.playTogether} onChange={e => updateRelationship(pair, { playTogether: e.target.checked })} />
                                            </label>

                                            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                Arguments & Conflict:
                                                <input type="checkbox" checked={rel.arguments} onChange={e => updateRelationship(pair, { arguments: e.target.checked })} />
                                            </label>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <p style={{ color: '#666' }}>Add at least 2 characters to configure relationships!</p>
                    )}
                </div>
            </div>
        </div>
    );
}
