
import ReactDOM from "react-dom/client";
import { Link, Route, Switch } from "wouter";
import { Settings, Users, UserCircle, Home } from "lucide-react";
import { AvatarPage } from "./pages/AvatarPage";
import { AnimationPage } from "./pages/AnimationPage";
import { MusicPage } from "./pages/MusicPage";
import { ContextPage } from "./pages/ContextPage";
import { BrowserPage } from "./pages/BrowserPage";
import { AIPage } from "./pages/AIPage";
import { BehaviorPage } from "./pages/BehaviorPage";
import { AssetManagerPage } from "./pages/AssetManagerPage";
import { MovementPage } from "./pages/MovementPage";
import { CharacterManagerPage } from "./pages/CharacterManagerPage";

function Layout() {
    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
            <div style={{ width: 250, background: "#1e1e2e", color: "#fff", padding: 20 }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Settings size={20} /> Bubu Core</h2>
                <nav style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 30 }}>
                    <Link href="/" style={{ color: "#cdd6f4", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}><Home size={16} /> Dashboard</Link>
                    <Link href="/avatar" style={{ color: "#cdd6f4", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}><UserCircle size={16} /> Skin Manager</Link>
                    <Link href="/animation" style={{ color: "#cdd6f4", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}><Settings size={16} /> Animation Studio</Link>
                    <Link href="/music" style={{ color: "#cdd6f4", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}><Settings size={16} /> Music Engine</Link>
                    <Link href="/context" style={{ color: "#cdd6f4", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}><Settings size={16} /> Smart Context</Link>
                    <Link href="/browser" style={{ color: "#cdd6f4", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}><Settings size={16} /> Browser Bridge</Link>
                    <Link href="/ai" style={{ color: "#cdd6f4", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}><Settings size={16} /> Personality Engine</Link>
                    <Link href="/behavior" style={{ color: "#cdd6f4", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}><Settings size={16} /> Autonomous Life</Link>
                    <Link href="/assets" style={{ color: "#cdd6f4", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}><Settings size={16} /> Action Library</Link>
                    <Link href="/movement" style={{ color: "#cdd6f4", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}><Settings size={16} /> Movement</Link>
                    <Link href="/characters" style={{ color: "#cdd6f4", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}><Users size={16} /> Characters</Link>
                </nav>
            </div>
            <div style={{ flex: 1, padding: 20, background: "#f8f9fa", overflowY: "auto" }}>
                <Switch>
                    <Route path="/"><h2 style={{ color: "#333" }}>Welcome to Bubu Phase 2</h2><p style={{ color: "#666" }}>Select Skin Manager to import characters.</p></Route>
                    <Route path="/avatar"><AvatarPage /></Route>
                    <Route path="/animation"><AnimationPage /></Route>
                    <Route path="/music"><MusicPage /></Route>
                    <Route path="/context"><ContextPage /></Route>
                    <Route path="/browser"><BrowserPage /></Route>
                    <Route path="/ai"><AIPage /></Route>
                    <Route path="/behavior"><BehaviorPage /></Route>
                    <Route path="/assets"><AssetManagerPage /></Route>
                    <Route path="/movement"><MovementPage /></Route>
                    <Route path="/characters"><CharacterManagerPage /></Route>
                </Switch>
            </div>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Layout />);
