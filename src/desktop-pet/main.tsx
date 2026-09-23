import ReactDOM from "react-dom/client";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useCharacterStore } from "../shared/store/characterStore";
import { useSkinStore } from "../shared/store/skinStore";
import { useMusicStore } from "../shared/store/musicStore";
import { useEffect, useState } from "react";
import { BehaviorEngine } from "./BehaviorEngine";

function DesktopPet() {
    const { emotion, speechText, positionX, setEmotion, setSpeechText } = useCharacterStore();
    const { actions } = useSkinStore();
    const { currentLyrics } = useMusicStore();
    
    const [bounce, setBounce] = useState(0);
    const [frameIndex, setFrameIndex] = useState(0);
    const [currentFrameUrl, setCurrentFrameUrl] = useState("");

    // Fallback Logic
    const getMapping = (requested: string) => {
        if (actions[requested] && actions[requested].frames.length > 0) return actions[requested];
        
        // Smart Fallbacks
        const fallbacks: Record<string, string> = {
            'code': 'think',
            'study': 'think',
            'read': 'think',
            'drink': 'sit',
            'eat': 'sit',
            'dance': 'happy',
            'sing': 'happy',
            'run': 'walk',
            'stretch': 'idle',
            'celebrate': 'happy'
        };
        
        let fallback = fallbacks[requested];
        while (fallback) {
            if (actions[fallback] && actions[fallback].frames.length > 0) return actions[fallback];
            fallback = fallbacks[fallback];
        }
        
        return actions['idle']; // Ultimate fallback
    };

    // Frame Animation Loop
    useEffect(() => {
        const mapping = getMapping(emotion);
        if (!mapping || mapping.frames.length === 0) return;
        
        const fps = mapping.fps || 1;
        const msPerFrame = 1000 / fps;
        
        const interval = setInterval(() => {
            setFrameIndex(prev => (prev + 1) % mapping.frames.length);
        }, msPerFrame);
        
        return () => clearInterval(interval);
    }, [emotion, actions]);

    useEffect(() => {
        const mapping = getMapping(emotion);
        if (mapping && mapping.frames.length > 0) {
            const idx = frameIndex % mapping.frames.length;
            setCurrentFrameUrl(mapping.frames[idx].url);
        }
    }, [frameIndex, emotion, actions]);

    // CSS Bounce Loop
    useEffect(() => {
        let frame = 0;
        const interval = setInterval(() => {
            frame++;
            if (emotion === 'happy' || emotion === 'dance' || emotion === 'run') {
                setBounce(Math.sin(frame) * 15);
            } else if (emotion === 'sad') {
                setBounce(Math.sin(frame * 2) * 3);
            } else if (emotion === 'walk') {
                setBounce(Math.sin(frame) * 5);
            } else if (['idle', 'think', 'read', 'code', 'sit'].includes(emotion)) {
                setBounce(Math.sin(frame * 0.5) * 5);
            } else if (emotion === 'sleep') {
                setBounce(0);
            }
        }, 100);
        return () => clearInterval(interval);
    }, [emotion]);

    const handleInteract = () => {
        setEmotion('happy');
        setSpeechText("Hi there! 💕");
        setTimeout(() => {
            setEmotion('idle');
            setSpeechText(null);
        }, 3000);
    };

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
            <BehaviorEngine />
            
            <div style={{ 
                position: 'absolute', 
                bottom: 20, 
                left: `${positionX}%`, 
                transform: 'translateX(-50%)',
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                transition: 'left 1s ease-in-out'
            }}>
                {/* Speech Bubble */}
                <div style={{ 
                    opacity: (speechText || currentLyrics) ? 1 : 0,
                    transform: (speechText || currentLyrics) ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'all 0.3s ease',
                    background: 'white',
                    padding: '10px 15px',
                    borderRadius: '20px',
                    borderBottomRightRadius: '0px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    marginBottom: 15,
                    maxWidth: 200,
                    textAlign: 'center',
                    fontFamily: 'sans-serif',
                    fontSize: 14,
                    color: '#333',
                    fontWeight: 'bold',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap'
                }}>
                    {speechText}{currentLyrics ? `🎵 ${currentLyrics}` : speechText}
                </div>

                {/* Pet Sprite */}
                <div 
                    style={{ 
                        width: 150, 
                        height: 150, 
                        cursor: "grab", 
                        backgroundImage: `url(${currentFrameUrl})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        filter: emotion === 'sleep' ? "brightness(0.7) drop-shadow(0 4px 8px rgba(0,0,0,0.5))" : "drop-shadow(0 8px 16px rgba(0,0,0,0.3))",
                        transform: `translateY(${bounce}px) ${emotion === 'sleep' ? 'scaleY(0.95)' : ''} ${emotion === 'dance' ? `rotate(${bounce}deg)` : ''}`,
                        transition: 'filter 0.5s ease'
                    }}
                    onMouseDown={(e) => {
                        if (e.button === 0) getCurrentWindow().startDragging();
                    }}
                    onDoubleClick={handleInteract}
                >
                    {/* Zzz for sleep state */}
                    {emotion === 'sleep' && (
                        <div style={{ position: 'absolute', top: -20, right: 10, fontSize: 24, fontWeight: 'bold', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)', animation: 'float 2s infinite' }}>
                            Zzz...
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0) scale(1); opacity: 1; }
                    100% { transform: translateY(-20px) scale(1.5); opacity: 0; }
                }
            `}</style>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("app")!).render(<DesktopPet />);
