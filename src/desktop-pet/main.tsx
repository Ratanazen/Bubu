import ReactDOM from "react-dom/client";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useCharacterStore } from "../shared/store/characterStore";
import { useEffect, useState } from "react";
import { BehaviorEngine } from "./BehaviorEngine";

function DesktopPet() {
    const { activeSkinUrl, emotion, speechText, positionX, setEmotion, setSpeechText } = useCharacterStore();
    const [bounce, setBounce] = useState(0);

    // Simple animation loop based on emotion
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
            } else if (emotion === 'idle' || emotion === 'think' || emotion === 'read' || emotion === 'code' || emotion === 'sit') {
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
                    opacity: speechText ? 1 : 0,
                    transform: speechText ? 'translateY(0)' : 'translateY(10px)',
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
                    {speechText}
                </div>

                {/* Pet Sprite */}
                <div 
                    style={{ 
                        width: 150, 
                        height: 150, 
                        cursor: "grab", 
                        backgroundImage: `url(${activeSkinUrl})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        filter: emotion === 'sleep' ? "brightness(0.7) drop-shadow(0 4px 8px rgba(0,0,0,0.5))" : "drop-shadow(0 8px 16px rgba(0,0,0,0.3))",
                        transform: `translateY(${bounce}px) ${emotion === 'sleep' ? 'scaleY(0.95)' : ''} ${emotion === 'dance' ? `rotate(${bounce}deg)` : ''}`,
                        transition: 'filter 0.5s ease, background-image 0.5s ease'
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
