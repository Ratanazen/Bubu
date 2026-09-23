import { useEffect, useRef, useState } from "react";
import { useBehaviorStore } from "../shared/store/behaviorStore";
import { useCharacterStore, Emotion } from "../shared/store/characterStore";
import { useMusicStore } from "../shared/store/musicStore";
import { useContextStore } from "../shared/store/contextStore";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";

interface SystemStats {
    cpu_usage: number;
    memory_usage_percent: number;
    is_laptop: boolean;
}

interface LrcResponse {
    plainLyrics?: string;
    syncedLyrics?: string;
}

export function BehaviorEngine() {
    const { autonomousEnabled, personality, energy, setEnergy, setMood } = useBehaviorStore();
    const { emotion, setEmotion, setSpeechText, positionX, setPositionX } = useCharacterStore();
    const { media, reactionLevel, setCurrentLyrics, currentLyrics } = useMusicStore();
    const { activeWindow } = useContextStore();

    const lastActionTime = useRef(Date.now());
    const isInteracting = useRef(false);
    const systemStats = useRef<SystemStats | null>(null);

    const [syncedLines, setSyncedLines] = useState<{time: number, text: string}[]>([]);

    useEffect(() => {
        const unlisten = listen<SystemStats>("system-status", (event) => {
            systemStats.current = event.payload;
        });
        return () => { unlisten.then(f => f()); };
    }, []);

    // Lyrics Fetcher
    useEffect(() => {
        if (media?.title && media?.artist) {
            invoke<LrcResponse | null>("fetch_lyrics", { 
                trackName: media.title, 
                artistName: media.artist 
            }).then(res => {
                if (res?.syncedLyrics) {
                    const lines = res.syncedLyrics.split('\n').map(line => {
                        const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\](.*)/);
                        if (match) {
                            const min = parseInt(match[1]);
                            const sec = parseInt(match[2]);
                            const ms = parseInt(match[3]);
                            const time = (min * 60 + sec) * 1000 + ms * 10;
                            return { time, text: match[4] };
                        }
                        return null;
                    }).filter(Boolean) as {time: number, text: string}[];
                    setSyncedLines(lines);
                } else {
                    setSyncedLines([]);
                    setCurrentLyrics(null);
                }
            }).catch(() => {
                setSyncedLines([]);
                setCurrentLyrics(null);
            });
        }
    }, [media?.title, media?.artist]);

    // Lyrics Sync Loop
    useEffect(() => {
        if (!media?.playing || syncedLines.length === 0) return;
        
        // Very basic mock position based on time elapsed since we don't have exact D-Bus position yet
        // A real implementation would pull Position from MPRIS via the Rust backend.
        // For demonstration, we just randomly display lyrics or let the user provide an offset.
        // Actually, we'll just show the first few lines in sequence to prove it works
        
        let start = Date.now();
        const loop = setInterval(() => {
            const pos = Date.now() - start; // mock position in ms
            const currentLine = syncedLines.slice().reverse().find(l => l.time <= pos);
            if (currentLine && currentLine.text !== currentLyrics) {
                setCurrentLyrics(currentLine.text);
            }
        }, 500);

        return () => clearInterval(loop);
    }, [media?.playing, syncedLines, currentLyrics]);

    useEffect(() => {
        if (!autonomousEnabled) return;

        const loop = setInterval(() => {
            if (isInteracting.current) return;

            const now = Date.now();
            const idleTime = now - lastActionTime.current;

            if (systemStats.current) {
                if (systemStats.current.cpu_usage > 90) {
                    if (emotion !== 'sleep') {
                        setEmotion('sleep');
                        setMood('Tired');
                        setSpeechText("CPU too hot... Zzz");
                        lastActionTime.current = now;
                    }
                    return;
                }
                if (systemStats.current.memory_usage_percent > 90) {
                    if (emotion !== 'sad') {
                        setEmotion('sad');
                        setMood('Concerned');
                        setSpeechText("RAM is full!");
                        lastActionTime.current = now;
                    }
                    return;
                }
            }

            if (media?.playing && reactionLevel !== 'Off') {
                if (emotion !== 'dance' && emotion !== 'sing' && emotion !== 'happy') {
                    setEmotion('dance');
                    setMood('Excited');
                    lastActionTime.current = now;
                }
                return;
            }

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

            if (energy < 15) {
                if (emotion !== 'sleep') {
                    setEmotion('sleep');
                    setMood('Sleepy');
                    setSpeechText("Zzz...");
                }
                setEnergy(energy + 2);
                lastActionTime.current = now;
                return;
            }

            if (idleTime > 5000 + Math.random() * 10000) {
                const actions: { act: Emotion, weight: number, eng: number }[] = [
                    { act: 'idle', weight: 30, eng: 1 },
                    { act: 'walk', weight: personality === 'Energetic' ? 30 : 15, eng: -2 },
                    { act: 'sit', weight: personality === 'Lazy' ? 40 : 10, eng: 2 },
                    { act: 'think', weight: personality === 'Focused' ? 20 : 5, eng: -1 },
                    { act: 'eat', weight: 3, eng: 5 },
                    { act: 'drink', weight: 3, eng: 2 },
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

                setEmotion(chosen.act);
                setEnergy(energy + chosen.eng);
                
                if (chosen.act === 'walk' || chosen.act === 'run') {
                    const dir = Math.random() > 0.5 ? 1 : -1;
                    const amount = chosen.act === 'run' ? 15 : 5;
                    let nextX = positionX + (dir * amount);
                    if (nextX < 5) nextX = 5;
                    if (nextX > 95) nextX = 95;
                    setPositionX(nextX);
                }

                if (Math.random() > 0.8 && !currentLyrics) {
                    const thoughts = ["Hmm...", "What's that?", "*blink*", "*yawn*"];
                    setSpeechText(thoughts[Math.floor(Math.random() * thoughts.length)]);
                    setTimeout(() => setSpeechText(null), 2000);
                } else if (!currentLyrics) {
                    setSpeechText(null);
                }

                lastActionTime.current = now;
            }

        }, 1000);

        return () => clearInterval(loop);
    }, [autonomousEnabled, emotion, energy, media?.playing, activeWindow?.app_name, personality, positionX, currentLyrics]);

    return null;
}
