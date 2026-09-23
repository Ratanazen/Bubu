import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import CommandPalette from './components/CommandPalette';
import HomePage from './pages/HomeDashboard';
import CharacterPage from './pages/CharacterPage';
import AnimationStudioPage from './pages/AnimationStudioPage';
import MusicPage from './pages/MusicPage';
import LyricsPage from './pages/LyricsPage';
import BrowserPage from './pages/BrowserPage';
import SkinsPage from './pages/SkinsPage';
import LinuxPage from './pages/LinuxPage';
import PerformancePage from './pages/PerformancePage';
import PluginsPage from './pages/PluginsPage';
import SettingsPage from './pages/SettingsPage';
import UpdatesPage from './pages/UpdatesPage';
import PrivacyPage from './pages/PrivacyPage';
import ScreenMapPage from './pages/ScreenMapPage';
import ContextPage from './pages/ContextPage';
import CompositorPage from './pages/CompositorPage';
import WaybarPage from './pages/WaybarPage';
import AvatarPage from './pages/AvatarPage';
import { DeveloperPage } from './pages/DeveloperPage';
import PanelExamplePage from './pages/PanelExamplePage';

const pages: Record<string, React.FC> = {
  home: HomePage,
  context: ContextPage,
  avatar: AvatarPage,
  pet: AvatarPage,
  screen: ScreenMapPage,
  monitors: ScreenMapPage,
  workspaces: ScreenMapPage,
  windows: ScreenMapPage,
  compositor: CompositorPage,
  waybar: WaybarPage,
  character: CharacterPage,
  animations: AnimationStudioPage,
  styles: SkinsPage,
  music: MusicPage,
  lyrics: LyricsPage,
  plugins: PluginsPage,
  notifications: PrivacyPage,
  browser: BrowserPage,
  integrations: LinuxPage,
  cli: LinuxPage,
  diagnostics: PerformancePage,
  settings: SettingsPage,
  updates: UpdatesPage,
  developer: DeveloperPage,
  'panel-ex': PanelExamplePage,
  grid: PanelExamplePage,
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const PageComponent = pages[currentPage] || HomePage;

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', overflow: 'hidden' }}>
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} 
      />
      <main style={{ flex: 1, height: '100%', overflowY: 'auto', backgroundColor: '#0b1120' }}>
        <PageComponent />
      </main>
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)} 
        onNavigate={setCurrentPage} 
      />
    </div>
  );
}
