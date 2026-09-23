import { useBrowserStore } from "../../shared/store/browserStore";
import { Globe, Activity, Clock } from "lucide-react";

export function BrowserPage() {
    const { latestPayload } = useBrowserStore();

    return (
        <div style={{ padding: 20 }}>
            <h2>Browser Bridge</h2>
            <p style={{ color: '#666' }}>The browser extension connects via WebSocket to provide Bubu with deep web integration (e.g., precise YouTube timestamp syncing).</p>
            
            <div style={{ marginTop: 20, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ width: 80, height: 80, background: '#f8f9fa', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #ccc' }}>
                        <Globe size={32} color={latestPayload ? "#10b981" : "#64748b"} />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: 24, color: '#1e293b' }}>
                            {latestPayload ? "Connected" : "Waiting for Extension..."}
                        </h3>
                        {latestPayload ? (
                            <>
                                <p style={{ margin: '8px 0 0 0', display: 'flex', alignItems: 'center', gap: 6, color: '#334155' }}>
                                    <Activity size={14}/> {latestPayload.title || "Unknown Page"}
                                </p>
                                {latestPayload.timestamp !== undefined && (
                                    <p style={{ margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b' }}>
                                        <Clock size={14}/> Timestamp: {Math.floor(latestPayload.timestamp)}s
                                    </p>
                                )}
                            </>
                        ) : (
                            <p style={{ margin: '8px 0 0 0', color: '#64748b' }}>Install the extension from `apps/browser-extension`.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
