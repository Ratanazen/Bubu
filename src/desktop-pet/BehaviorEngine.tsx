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

    useEffect(() => {
        if (!autonomousEnabled || !char) return;

        const loop = setInterval(() => {
            const now = Date.now();
            const idleTime = now - lastActionTime.current;
            
            // Interaction Check (Look at other characters)
            for (const otherId in characters) {
                if (otherId === charId) continue;
                const other = characters[otherId];
                
                const dx = other.x - char.x;
                const dy = other.y - char.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                // If close, small chance to interact
                if (dist < 200 && Math.random() > 0.95 && idleTime > 5000) {
                    const pair = [charId, otherId].sort().join('-');
                    const rel = relationships[pair];
                    
                    if (rel) {
                        if (rel.arguments && Math.random() > 0.8) {
                            updateCharacter(charId, { emotion: 'angry', speechText: 'Hmph!' });
                        } else if (rel.playTogether) {
                            updateCharacter(charId, { emotion: 'happy', speechText: 'Hi!' });
                        }
                        lastActionTime.current = now;
                        setTimeout(() => updateCharacter(charId, { speechText: null }), 3000);
                        return;
                    }
                }
            }

            // Standard Autonomous
            if (idleTime > 8000 + Math.random() * 10000) {
                const actions = ['idle', 'walk', 'sit', 'think'];
                if (char.energy < 30) actions.push('sleep');
                if (char.personality === 'Playful') actions.push('run', 'jump', 'laugh');
                if (media?.playing) actions.push('dance', 'sing');
                if (activeWindow?.app_name?.toLowerCase().includes('code')) actions.push('code', 'type');

                const act = actions[Math.floor(Math.random() * actions.length)];
                
                updateCharacter(charId, { emotion: act, energy: Math.max(0, char.energy - 1) });

                if (act === 'walk' || act === 'run') {
                    // We don't change actual OS window X/Y here randomly, 
                    // a real walking engine would set targetX/targetY. 
                    // For demo, we just trigger the animation.
                }

                lastActionTime.current = now;
            }

        }, 1000);

        return () => clearInterval(loop);
    }, [autonomousEnabled, char, characters, relationships, media?.playing, activeWindow?.app_name]);

    return null;
}
