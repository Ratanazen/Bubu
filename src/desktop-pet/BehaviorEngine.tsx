import { useEffect, useRef } from "react";
import { useBehaviorStore } from "../shared/store/behaviorStore";
import { useCharacterStore, Emotion } from "../shared/store/characterStore";
import { useMusicStore } from "../shared/store/musicStore";
import { useContextStore } from "../shared/store/contextStore";

export function BehaviorEngine() {
    const { autonomousEnabled, personality, energy, setEnergy, setMood } = useBehaviorStore();
    const { emotion, setEmotion, setSpeechText, positionX, setPositionX } = useCharacterStore();
    const { media, reactionLevel } = useMusicStore();
    const { activeWindow } = useContextStore();

    const lastActionTime = useRef(Date.now());
    const isInteracting = useRef(false);

    useEffect(() => {
        if (!autonomousEnabled) return;

        const loop = setInterval(() => {
            if (isInteracting.current) return; // Don't interrupt user interaction

            const now = Date.now();
            const idleTime = now - lastActionTime.current;

            // Priority 1: Music Reaction
            if (media?.playing && reactionLevel !== 'Off') {
                if (emotion !== 'dance' && emotion !== 'sing' && emotion !== 'happy') {
                    setEmotion('dance');
                    setMood('Excited');
                    lastActionTime.current = now;
                }
                return;
            }

            // Priority 2: Context Aware
            if (activeWindow?.app_name) {
                const app = activeWindow.app_name.toLowerCase();
                if (app.includes('code') || app.includes('cursor')) {
                    if (Math.random() > 0.8 && emotion !== 'code') {
                        setEmotion('code');
                        setSpeechText("Compiling...");
                        setTimeout(() => setSpeechText(null), 3000);
                        setMood('Focused');
                        lastActionTime.current = now;
                    }
                }
            }

            // Priority 3: Energy / Sleep
            if (energy < 15) {
                if (emotion !== 'sleep') {
                    setEmotion('sleep');
                    setMood('Sleepy');
                    setSpeechText("Zzz...");
                }
                setEnergy(energy + 2); // Recover energy
                lastActionTime.current = now;
                return;
            }

            // Priority 4: Random Autonomous (I'M ALIVE)
            // Trigger every 5-15 seconds if idle
            if (idleTime > 5000 + Math.random() * 10000) {
                // Determine next action
                const actions: { act: Emotion, weight: number, eng: number }[] = [
                    { act: 'idle', weight: 30, eng: 1 },
                    { act: 'walk', weight: personality === 'Energetic' ? 30 : 15, eng: -2 },
                    { act: 'sit', weight: personality === 'Lazy' ? 40 : 10, eng: 2 },
                    { act: 'look around', weight: 10, eng: 0 } as any, // fallback to idle visually
                    { act: 'stretch', weight: 5, eng: -1 },
                    { act: 'think', weight: personality === 'Focused' ? 20 : 5, eng: -1 },
                    { act: 'eat', weight: 3, eng: 5 },
                    { act: 'celebrate', weight: 2, eng: -3 },
                    { act: 'run', weight: personality === 'Energetic' ? 20 : 2, eng: -5 }
                ];

                const totalWeight = actions.reduce((sum, a) => sum + a.weight, 0);
                let rand = Math.random() * totalWeight;
                let chosen = actions[0];
                for (const a of actions) {
                    if (rand < a.weight) {
                        chosen = a;
                        break;
                    }
                    rand -= a.weight;
                }

                // Execute action
                let nextEmotion: Emotion = chosen.act === 'look around' ? 'idle' : chosen.act;
                setEmotion(nextEmotion);
                setEnergy(energy + chosen.eng);
                
                // Optional movement
                if (chosen.act === 'walk' || chosen.act === 'run') {
                    const dir = Math.random() > 0.5 ? 1 : -1;
                    const amount = chosen.act === 'run' ? 15 : 5;
                    let nextX = positionX + (dir * amount);
                    if (nextX < 5) nextX = 5;
                    if (nextX > 95) nextX = 95;
                    setPositionX(nextX);
                }

                // Optional micro-behaviors (speech bubbles)
                if (Math.random() > 0.8) {
                    const thoughts = ["Hmm...", "What's that?", "*blink*", "*yawn*"];
                    setSpeechText(thoughts[Math.floor(Math.random() * thoughts.length)]);
                    setTimeout(() => setSpeechText(null), 2000);
                } else {
                    setSpeechText(null);
                }

                lastActionTime.current = now;
            }

        }, 1000);

        return () => clearInterval(loop);
    }, [autonomousEnabled, emotion, energy, media?.playing, activeWindow?.app_name, personality, positionX]);

    return null; // Headless component
}
