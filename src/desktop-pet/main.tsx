import ReactDOM from "react-dom/client";
import { getCurrentWindow, PhysicalPosition } from "@tauri-apps/api/window";
import { useCharacterStore } from "../shared/store/characterStore";
import { useSkinStore, ActionFrame } from "../shared/store/skinStore";
import { useMusicStore } from "../shared/store/musicStore";
import { useMovementStore } from "../shared/store/movementStore";
import { useEffect, useState, useRef } from "react";
import { BehaviorEngine } from "./BehaviorEngine";

function DesktopPet() {
    const { emotion, speechText, setEmotion, setSpeechText } = useCharacterStore();
    const { actions } = useSkinStore();
    const { currentLyrics } = useMusicStore();
    const { targetPosition, walkSpeed, setTargetPosition } = useMovementStore();
    
    const [bounce, setBounce] = useState(0);
    const [frameIndex, setFrameIndex] = useState(0);
    const [currentFrame, setCurrentFrame] = useState<ActionFrame | null>(null);
    const [scaleMultiplier, setScaleMultiplier] = useState(1);
    const [flipX, setFlipX] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const currentPos = useRef({ x: 100, y: 100 });
    
    useEffect(() => {
        getCurrentWindow().outerPosition().then(pos => currentPos.current = { x: pos.x, y: pos.y });
    }, []);

    useEffect(() => {
        if (!targetPosition) return;
        setEmotion('walk');
        let speedPx = 5;
        if (walkSpeed === 'Slow') speedPx = 2;
        if (walkSpeed === 'Fast') speedPx = 10;

        const loop = setInterval(() => {
            const dx = targetPosition.x - currentPos.current.x - 150;
            const dy = targetPosition.y - currentPos.current.y - 150;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < speedPx) {
                setTargetPosition(null);
                setEmotion('idle');
                return;
            }

            const moveX = (dx / dist) * speedPx;
            const moveY = (dy / dist) * speedPx;
            if (moveX > 0) setFlipX(true);
            else if (moveX < 0) setFlipX(false);

            currentPos.current.x += moveX;
            currentPos.current.y += moveY;
            getCurrentWindow().setPosition(new PhysicalPosition(currentPos.current.x, currentPos.current.y));
        }, 16);

        return () => clearInterval(loop);
    }, [targetPosition, walkSpeed]);

    const getMapping = (requested: string) => {
        if (actions[requested] && actions[requested].frames.length > 0) return actions[requested];
        const fallbacks: Record<string, string> = { 'code': 'think', 'study': 'think', 'read': 'think', 'drink': 'sit', 'eat': 'sit', 'dance': 'happy', 'sing': 'happy', 'run': 'walk', 'stretch': 'idle', 'celebrate': 'happy', 'gaming': 'play', 'type': 'code' };
        let fallback = fallbacks[requested];
        while (fallback) {
            if (actions[fallback] && actions[fallback].frames.length > 0) return actions[fallback];
            fallback = fallbacks[fallback];
        }
        return actions['idle'];
    };

    useEffect(() => {
        const mapping = getMapping(emotion);
        if (!mapping || mapping.frames.length === 0) return;
        setScaleMultiplier(mapping.scale || 1);
        const interval = setInterval(() => {
            setFrameIndex(prev => (prev + 1) % mapping.frames.length);
        }, 1000 / (mapping.fps || 1));
        return () => clearInterval(interval);
    }, [emotion, actions]);

    useEffect(() => {
        const mapping = getMapping(emotion);
        if (mapping && mapping.frames.length > 0) {
            setCurrentFrame(mapping.frames[frameIndex % mapping.frames.length]);
        }
    }, [frameIndex, emotion, actions]);

    useEffect(() => {
        let frame = 0;
        const interval = setInterval(() => {
            frame++;
            if (emotion === 'happy' || emotion === 'dance' || emotion === 'run') setBounce(Math.sin(frame) * 15);
            else if (emotion === 'sad') setBounce(Math.sin(frame * 2) * 3);
            else if (emotion === 'walk') setBounce(Math.sin(frame) * 5);
            else if (['idle', 'think', 'read', 'code', 'sit'].includes(emotion)) setBounce(Math.sin(frame * 0.5) * 5);
            else if (emotion === 'sleep') setBounce(0);
        }, 100);
        return () => clearInterval(interval);
    }, [emotion]);

    const isSpriteSheet = currentFrame && currentFrame.w !== undefined && currentFrame.h !== undefined;

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
            <BehaviorEngine />
            
            <div style={{ 
                position: 'absolute', 
                bottom: 20, 
                left: '50%', 
                transform: 'translateX(-50%)',
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
            }}>
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
                    {currentLyrics ? `🎵 ${currentLyrics}` : speechText}
                </div>

                <div 
                    style={{ 
                        width: 150 * scaleMultiplier, 
                        height: 150 * scaleMultiplier, 
                        cursor: "grab", 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        filter: emotion === 'sleep' ? "brightness(0.7) drop-shadow(0 4px 8px rgba(0,0,0,0.5))" : "drop-shadow(0 8px 16px rgba(0,0,0,0.3))",
                        transform: `translateY(${bounce + (currentFrame?.offsetY || 0)}px) translateX(${currentFrame?.offsetX || 0}px) scaleX(${flipX ? -1 : 1}) ${emotion === 'sleep' ? 'scaleY(0.95)' : ''} ${emotion === 'dance' ? `rotate(${bounce}deg)` : ''}`,
                        transition: 'filter 0.5s ease',
                    }}
                    onMouseDown={(e) => {
                        if (e.button === 0) {
                            getCurrentWindow().startDragging();
                            setTimeout(() => {
                                getCurrentWindow().outerPosition().then(pos => currentPos.current = { x: pos.x, y: pos.y });
                            }, 500);
                        }
                    }}
                    onDoubleClick={() => {
                        setEmotion('happy');
                        setSpeechText("Hi there! 💕");
                        setTimeout(() => { setEmotion('idle'); setSpeechText(null); }, 3000);
                    }}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        setShowMenu(!showMenu);
                    }}
                >
                    {currentFrame && (
                        isSpriteSheet ? (
                            <div style={{
                                width: currentFrame.w,
                                height: currentFrame.h,
                                backgroundImage: `url(${currentFrame.url})`,
                                backgroundPosition: `-${currentFrame.x}px -${currentFrame.y}px`,
                                imageRendering: 'pixelated', // CRISP PIXELS!
                                transform: `scale(${150 / (currentFrame.w || 150)})`,
                                transformOrigin: 'center center'
                            }} />
                        ) : (
                            <div style={{
                                width: '100%',
                                height: '100%',
                                backgroundImage: `url(${currentFrame.url})`,
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                                imageRendering: 'pixelated' // CRISP PIXELS!
                            }} />
                        )
                    )}

                    {emotion === 'sleep' && (
                        <div style={{ position: 'absolute', top: -20, right: 10, fontSize: 24, fontWeight: 'bold', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Zzz...</div>
                    )}
                </div>

                {showMenu && (
                    <div style={{ position: 'absolute', top: 50, right: -100, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 5, boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 100 }}>
                        <button style={{ display: 'block', width: '100%', padding: '8px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }} onClick={() => { useMovementStore.getState().setIsSelectingTarget(true); setShowMenu(false); }}>📍 Walk Here</button>
                        <button style={{ display: 'block', width: '100%', padding: '8px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }} onClick={() => { setTargetPosition(null); setEmotion('idle'); setShowMenu(false); }}>🛑 Stop</button>
                    </div>
                )}
            </div>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("app")!).render(<DesktopPet />);
