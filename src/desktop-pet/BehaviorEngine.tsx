import { useEffect, useRef } from "react";
import { useBehaviorStore } from "../shared/store/behaviorStore";
import { useCharacterStore } from "../shared/store/characterStore";
import { useRelationshipStore } from "../shared/store/relationshipStore";
import { useMusicStore } from "../shared/store/musicStore";
import { useContextStore } from "../shared/store/contextStore";

export function BehaviorEngine({ charId }: { charId: string }) {
    const { autonomousEnabled } = useBehaviorStore();
    const { characters, updateCharacter } = useCharacterStore();
    const { relationships } = useRelationshipStore();
    const { media } = useMusicStore();
    const { activeWindow } = useContextStore();

    const char = characters[charId];
    const lastActionTime = useRef(Date.now());
    const interactionLock = useRef(false);

    useEffect(() => {
        if (!autonomousEnabled || !char) return;

        const loop = setInterval(() => {
            const now = Date.now();
            const idleTime = now - lastActionTime.current;
            
            if (interactionLock.current) return; // Busy in a sequence

            // 1. Check for proximity interactions
            for (const otherId in characters) {
                if (otherId === charId) continue;
                const other = characters[otherId];
                
                const dx = other.x - char.x;
                const dy = other.y - char.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < 250 && Math.random() > 0.95 && idleTime > 6000) {
                    const pair = [charId, otherId].sort().join('-');
                    const rel = relationships[pair];
                    
                    if (rel) {
                        interactionLock.current = true;
                        
                        // Decide interaction type
                        const isArgument = rel.arguments && Math.random() > 0.8;
                        
                        if (isArgument) {
                            // ARGUMENT SEQUENCE
                            updateCharacter(charId, { emotion: 'angry', speechText: 'Hey!' });
                            updateCharacter(otherId, { emotion: 'surprised', speechText: '?!' });
                            
                            setTimeout(() => {
                                updateCharacter(otherId, { emotion: 'angry', speechText: "Don't 'Hey' me!" });
                            }, 2000);

                            setTimeout(() => {
                                updateCharacter(charId, { emotion: 'sad', speechText: null });
                                updateCharacter(otherId, { emotion: 'sad', speechText: null });
                                // Move apart slightly (demo only, usually handled by movement engine)
                                updateCharacter(charId, { x: char.x - 50 });
                                updateCharacter(otherId, { x: other.x + 50 });
                            }, 5000);

                            if (rel.makeUp) {
                                setTimeout(() => {
                                    updateCharacter(charId, { emotion: 'happy', speechText: "Sorry..." });
                                    updateCharacter(otherId, { emotion: 'happy', speechText: "Me too 💕" });
                                }, 10000);
                                setTimeout(() => {
                                    updateCharacter(charId, { emotion: 'idle', speechText: null });
                                    updateCharacter(otherId, { emotion: 'idle', speechText: null });
                                    interactionLock.current = false;
                                    lastActionTime.current = Date.now();
                                }, 14000);
                            } else {
                                setTimeout(() => {
                                    updateCharacter(charId, { emotion: 'idle' });
                                    updateCharacter(otherId, { emotion: 'idle' });
                                    interactionLock.current = false;
                                    lastActionTime.current = Date.now();
                                }, 8000);
                            }
                            return;
                        } else if (rel.playTogether) {
                            // PLAY TOGETHER SEQUENCE
                            updateCharacter(charId, { emotion: 'happy', speechText: 'Hi!' });
                            updateCharacter(otherId, { emotion: 'happy', speechText: 'Hello! ✨' });
                            
                            setTimeout(() => {
                                updateCharacter(charId, { emotion: 'jump', speechText: null });
                                updateCharacter(otherId, { emotion: 'dance', speechText: null });
                            }, 3000);

                            setTimeout(() => {
                                updateCharacter(charId, { emotion: 'idle' });
                                updateCharacter(otherId, { emotion: 'idle' });
                                interactionLock.current = false;
                                lastActionTime.current = Date.now();
                            }, 8000);
                            return;
                        }
                    }
                }
            }

            // 2. Standard Autonomous Behavior
            if (idleTime > 8000 + Math.random() * 10000) {
                const actions = ['idle', 'walk', 'sit', 'think', 'look around'];
                if (char.energy < 30) actions.push('sleep', 'stretch');
                if (char.personality === 'Playful') actions.push('run', 'jump', 'laugh', 'celebrate');
                if (char.personality === 'Lazy') actions.push('sleep', 'sit', 'relax');
                
                if (media?.playing) actions.push('dance', 'sing', 'bounce');
                if (activeWindow?.app_name?.toLowerCase().includes('code')) actions.push('code', 'type');

                const act = actions[Math.floor(Math.random() * actions.length)];
                
                updateCharacter(charId, { emotion: act, energy: Math.max(0, char.energy - 1) });
                lastActionTime.current = now;
            }

        }, 1000); // Check every second

        return () => clearInterval(loop);
    }, [autonomousEnabled, char, characters, relationships, media?.playing, activeWindow?.app_name, charId, updateCharacter]);

    return null;
}
