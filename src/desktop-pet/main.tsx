
import ReactDOM from "react-dom/client";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useCharacterStore } from "../shared/store/characterStore";

function DesktopPet() {
    const activeSkinUrl = useCharacterStore(state => state.activeSkinUrl);

    return (
        <div 
            style={{ 
                width: 150, 
                height: 150, 
                cursor: "grab", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                background: `url(${activeSkinUrl}) no-repeat center/contain`, 
                filter: "drop-shadow(0 8px 16px rgba(255,75,75,0.3))" 
            }}
            onMouseDown={(e) => {
                if (e.button === 0) getCurrentWindow().startDragging();
            }}
        >
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("app")!).render(<DesktopPet />);
