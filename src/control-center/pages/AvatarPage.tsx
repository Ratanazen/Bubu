import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { readFile } from "@tauri-apps/plugin-fs";
import { useCharacterStore } from "../../shared/store/characterStore";
import { ImagePlus } from "lucide-react";

export function AvatarPage() {
    const activeSkinUrl = useCharacterStore(state => state.activeSkinUrl);
    const setActiveSkinUrl = useCharacterStore(state => state.setActiveSkinUrl);
    const [isLoading, setIsLoading] = useState(false);

    const handleImportSkin = async () => {
        try {
            const file = await open({
                multiple: false,
                filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "webp", "gif"] }]
            });
            if (file && typeof file === 'string') {
                setIsLoading(true);
                // Read local file using plugin-fs
                const bytes = await readFile(file);
                const blob = new Blob([bytes]);
                const url = URL.createObjectURL(blob);
                setActiveSkinUrl(url);
                setIsLoading(false);
            }
        } catch (e) {
            console.error(e);
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Skin Manager (Phase 2)</h2>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginTop: 20 }}>
                <div style={{
                    width: 150, height: 150, 
                    border: '1px solid #ccc', borderRadius: 8,
                    background: `url(${activeSkinUrl}) no-repeat center/contain`
                }}></div>
                <div>
                    <button 
                        onClick={handleImportSkin}
                        disabled={isLoading}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', cursor: 'pointer' }}
                    >
                        <ImagePlus size={16} />
                        {isLoading ? "Loading..." : "Import New Image"}
                    </button>
                    <p style={{ marginTop: 10, fontSize: 12, color: '#666' }}>
                        * Skin changes sync immediately to the Pet window via BroadcastChannel.
                    </p>
                </div>
            </div>
        </div>
    );
}
