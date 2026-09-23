import { useEffect } from "react";
import { useContextStore } from "../../shared/store/contextStore";
import { Monitor, Code, Terminal, Globe, MessageSquare } from "lucide-react";

export function ContextPage() {
    const { activeWindow, currentMode, pollContext } = useContextStore();

    useEffect(() => {
        pollContext();
        const interval = setInterval(pollContext, 2000);
        return () => clearInterval(interval);
    }, [pollContext]);

    const renderModeIcon = () => {
        switch(currentMode) {
            case "Coding Mode": return <Code size={32} color="#8b5cf6" />;
            case "Terminal Mode": return <Terminal size={32} color="#10b981" />;
            case "Browser Mode": return <Globe size={32} color="#3b82f6" />;
            case "Communication Mode": return <MessageSquare size={32} color="#ec4899" />;
            default: return <Monitor size={32} color="#64748b" />;
        }
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>Smart Context Engine</h2>
            
            <div style={{ marginTop: 20, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ width: 80, height: 80, background: '#f8f9fa', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #ccc' }}>
                        {renderModeIcon()}
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: 24, color: '#1e293b' }}>{currentMode}</h3>
                        {activeWindow ? (
                            <>
                                <p style={{ margin: '8px 0 0 0', fontWeight: 'bold', color: '#334155' }}>Focused App: {activeWindow.app_name}</p>
                                <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#64748b' }}>{activeWindow.title}</p>
                            </>
                        ) : (
                            <p style={{ margin: '8px 0 0 0', color: '#64748b' }}>No window detected.</p>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: 20, background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
                <h3>App Profiles</h3>
                <p style={{ color: '#64748b', fontSize: 14 }}>Bubu will automatically change his animation state (e.g., "Thinking", "Working", "Idle") based on these inferred modes.</p>
            </div>
        </div>
    );
}
