import ReactDOM from "react-dom/client";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useMovementStore } from "../shared/store/movementStore";
import { useEffect } from "react";

function TargetSelector() {
    const { setTargetPosition, isSelectingTarget } = useMovementStore();

    useEffect(() => {
        if (!isSelectingTarget) {
            getCurrentWindow().hide();
        } else {
            getCurrentWindow().show();
            getCurrentWindow().setFocus();
        }
    }, [isSelectingTarget]);

    const handleClick = (e: React.MouseEvent) => {
        setTargetPosition({ x: e.screenX, y: e.screenY });
        getCurrentWindow().hide();
    };

    const handleContext = (e: React.MouseEvent) => {
        e.preventDefault();
        setTargetPosition(null); // Cancel
        getCurrentWindow().hide();
    };

    return (
        <div 
            style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={handleClick}
            onContextMenu={handleContext}
        >
            <h1 style={{ color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.8)', background: 'rgba(0,0,0,0.5)', padding: '10px 20px', borderRadius: 20 }}>
                Click anywhere to set destination (Right-click to cancel)
            </h1>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("app")!).render(<TargetSelector />);
