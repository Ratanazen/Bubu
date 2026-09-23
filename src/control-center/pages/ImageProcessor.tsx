import { useState, useRef, useEffect } from "react";
import { removeBackground } from "@imgly/background-removal";
import { useAssetStore } from "../../shared/store/assetStore";
import { Image as ImageIcon, Scissors, Save, Wand2 } from "lucide-react";

export function ImageProcessor() {
    const { addAsset } = useAssetStore();
    
    const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
    const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [pixelSize, setPixelSize] = useState(1);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            setOriginalImage(img);
            setProcessedBlob(file);
            setPreviewUrl(url);
            drawToCanvas(img, 1);
        };
        img.src = url;
    };

    const handleRemoveBackground = async () => {
        if (!processedBlob) return;
        setIsProcessing(true);
        try {
            // WebAssembly background removal (100% local)
            const resultBlob = await removeBackground(processedBlob);
            setProcessedBlob(resultBlob);
            const url = URL.createObjectURL(resultBlob);
            setPreviewUrl(url);
            
            const img = new Image();
            img.onload = () => drawToCanvas(img, pixelSize);
            img.src = url;
        } catch (error) {
            console.error("BG Removal Failed", error);
            alert("Background removal failed. Check console.");
        }
        setIsProcessing(false);
    };

    const drawToCanvas = (img: HTMLImageElement, pixelScale: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set standard export canvas size (e.g., 256x256)
        canvas.width = 256;
        canvas.height = 256;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate aspect ratio fit
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (canvas.width - w) / 2;
        const y = canvas.height - h; // Anchor to bottom (baseline)

        if (pixelScale > 1) {
            // Pixelation Effect
            ctx.imageSmoothingEnabled = false;
            
            // Draw small
            const smallCanvas = document.createElement('canvas');
            smallCanvas.width = w / pixelScale;
            smallCanvas.height = h / pixelScale;
            const smallCtx = smallCanvas.getContext('2d')!;
            smallCtx.drawImage(img, 0, 0, smallCanvas.width, smallCanvas.height);
            
            // Scale up
            ctx.drawImage(smallCanvas, x, y, w, h);
        } else {
            ctx.drawImage(img, x, y, w, h);
        }
    };

    useEffect(() => {
        if (previewUrl) {
            const img = new Image();
            img.onload = () => drawToCanvas(img, pixelSize);
            img.src = previewUrl;
        }
    }, [pixelSize, previewUrl]);

    const handleSaveAsset = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const dataUrl = canvas.toDataURL('image/png');
        const id = 'asset_' + Date.now();
        
        addAsset({
            id,
            name: `Sprite ${new Date().toLocaleTimeString()}`,
            dataUrl,
            width: 256,
            height: 256,
            timestamp: Date.now()
        });
        
        alert("Saved to Asset Library!");
    };

    return (
        <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
            <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}><ImageIcon size={18}/> 1. Asset Processor</h3>
            <p style={{ color: '#666', fontSize: 14 }}>Import photos, remove backgrounds, and convert to pixel art locally (Privacy-First).</p>
            
            <input type="file" accept="image/*" onChange={handleFileUpload} style={{ marginBottom: 20 }} />

            <div style={{ 
                width: 256, height: 256, 
                border: '1px solid #ccc', 
                background: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYNgvwMDA/o8xmZGBgYWRAQhWMIzKwKigwYgBDEf9MGoAwyG9gYEBgAAr7wkziE4nJgAAAABJRU5ErkJggg==") repeat', 
                margin: '0 auto 20px auto',
                position: 'relative'
            }}>
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }} />
                {isProcessing && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Processing locally...
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button 
                    onClick={handleRemoveBackground} 
                    disabled={!originalImage || isProcessing}
                    style={{ flex: 1, padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                >
                    <Scissors size={16}/> Remove BG
                </button>
            </div>

            <div style={{ marginTop: 20 }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 'bold' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Wand2 size={16}/> Pixelation Level</span>
                    <span>{pixelSize}x</span>
                </label>
                <input 
                    type="range" min="1" max="10" step="1" 
                    value={pixelSize} 
                    onChange={e => setPixelSize(Number(e.target.value))} 
                    style={{ width: '100%', marginTop: 10 }}
                    disabled={!originalImage}
                />
            </div>

            <button 
                onClick={handleSaveAsset} 
                disabled={!originalImage}
                style={{ width: '100%', marginTop: 20, padding: '15px', background: '#10b981', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
            >
                <Save size={18}/> Save to Asset Library
            </button>
        </div>
    );
}
