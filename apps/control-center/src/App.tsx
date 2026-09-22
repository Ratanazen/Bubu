import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import CharacterPage from './pages/CharacterPage';
import MusicPage from './pages/MusicPage';
import LyricsPage from './pages/LyricsPage';
import BrowserPage from './pages/BrowserPage';
import SkinsPage from './pages/SkinsPage';
import LinuxPage from './pages/LinuxPage';
import SettingsPage from './pages/SettingsPage';
import PrivacyPage from './pages/PrivacyPage';

const pages: Record<string, React.FC> = {
    home: HomePage,
    character: CharacterPage,
    music: MusicPage,
    lyrics: LyricsPage,
    browser: BrowserPage,
    skins: SkinsPage,
    linux: LinuxPage,
    settings: SettingsPage,
    privacy: PrivacyPage,
};

export default function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const PageComponent = pages[currentPage] || HomePage;

    return (
        <>
            <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
            <main className="main-content">
                <PageComponent />
            </main>
        </>
    );
}
