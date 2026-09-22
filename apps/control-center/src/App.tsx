import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import CommandPalette from './components/CommandPalette';
import HomePage from './pages/HomePage';
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
import PrivacyPage from './pages/PrivacyPage';
import ScreenMapPage from './pages/ScreenMapPage';

const pages: Record<string, React.FC> = {
  home: HomePage,
  character: CharacterPage,
  animations: AnimationStudioPage,
  music: MusicPage,
  lyrics: LyricsPage,
  browser: BrowserPage,
  skins: SkinsPage,
  'screen-map': ScreenMapPage,
  linux: LinuxPage,
  performance: PerformancePage,
  plugins: PluginsPage,
  settings: SettingsPage,
  privacy: PrivacyPage,
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
    <>
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />
      <main className="main-content">
        <PageComponent />
      </main>
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setCurrentPage}
      />
    </>
  );
}
