import React, { useState } from 'react';
import {
  Code, Terminal, GitBranch, Cpu, Play, Square,
  Folder, Settings, RefreshCw, FileCode, CheckCircle2
} from 'lucide-react';

interface GridTile {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badge?: string;
  action: () => void;
}

export default function PanelExamplePage() {
  const [selectedTile, setSelectedTile] = useState<string>('c-cpp');
  const [logOutput, setLogOutput] = useState<string>('Toolchain & environment ready.\nSelect a card to launch action.');

  const tiles: GridTile[] = [
    {
      id: 'c-cpp',
      title: 'C / C++',
      subtitle: 'gcc, clang, cmake, make',
      icon: FileCode,
      badge: 'DETECTED',
      action: () => setLogOutput('Selected C / C++ Engine\nDetected: gcc 14.x, g++ 14.x, cmake 4.x\nReady to compile projects with CMakeLists.txt or Makefile.')
    },
    {
      id: 'python',
      title: 'Python',
      subtitle: 'python3, pip, venv',
      icon: Code,
      badge: 'DETECTED',
      action: () => setLogOutput('Selected Python Engine\nDetected: Python 3.12.x\nVirtual environment and package runner active.')
    },
    {
      id: 'rust',
      title: 'Rust',
      subtitle: 'rustc, cargo toolchain',
      icon: Cpu,
      badge: 'AVAILABLE',
      action: () => setLogOutput('Selected Rust Engine\nReady for Cargo.toml builds and release compilation.')
    },
    {
      id: 'node',
      title: 'Node.js',
      subtitle: 'npm, pnpm, yarn, vite',
      icon: Terminal,
      badge: 'ACTIVE',
      action: () => setLogOutput('Selected Node.js Engine\nActive Node: v26.9.0\nWorkspace scripts and bundlers verified.')
    },
    {
      id: 'terminal',
      title: 'Terminal (PTY)',
      subtitle: 'Interactive Bash / Zsh session',
      icon: Terminal,
      action: () => setLogOutput('Terminal session initialized.\nPseudo-terminal (PTY) attached to /bin/bash.')
    },
    {
      id: 'git',
      title: 'Git Manager',
      subtitle: 'Status, Diff, Commit, Log',
      icon: GitBranch,
      action: () => setLogOutput('Git repository: /home/reny/Documents/Bubu\nBranch: main\nWorking tree clean.')
    },
    {
      id: 'projects',
      title: 'Projects Scanner',
      subtitle: 'Multi-language detection',
      icon: Folder,
      action: () => setLogOutput('Scanning workspace directories...\nIdentified projects: C/C++, Rust, Python, Node.js.')
    },
    {
      id: 'settings',
      title: 'Dev Preferences',
      subtitle: 'Low-End Mode, CPU & RAM limits',
      icon: Settings,
      action: () => setLogOutput('Low-End Mode: AUTO\nWorker concurrency: 2\nAnimation throttling: ENABLED.')
    }
  ];

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      height: '100%',
      backgroundColor: '#cfd2d6',
      color: '#2b2628',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxSizing: 'border-box'
    }}>
      {/* Dark Slate Blue Left Bar (exactly matching user reference image) */}
      <div style={{
        width: '110px',
        backgroundColor: '#59659b',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '28px',
        gap: '24px'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff'
        }}>
          <Cpu size={28} />
        </div>
      </div>

      {/* Main Light Grey Content Body */}
      <div style={{
        flex: 1,
        padding: '36px 44px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflowY: 'auto'
      }}>
        {/* 2 Rows x 4 Columns Rounded Tiles Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(130px, 1fr))',
          gridTemplateRows: 'repeat(2, 140px)',
          gap: '28px',
          maxWidth: '820px'
        }}>
          {tiles.map((tile) => {
            const isSelected = selectedTile === tile.id;
            const IconComp = tile.icon;
            return (
              <button
                key={tile.id}
                onClick={() => {
                  setSelectedTile(tile.id);
                  tile.action();
                }}
                style={{
                  backgroundColor: '#3b3336',
                  borderRadius: '26px',
                  border: isSelected ? '3px solid #59659b' : 'none',
                  boxShadow: isSelected ? '0 8px 24px rgba(89, 101, 155, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.15)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                  color: '#ffffff',
                  position: 'relative',
                  transition: 'transform 0.12s ease, box-shadow 0.12s ease',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <IconComp size={34} color="#f0eff2" />
                <span style={{ marginTop: '10px', fontSize: '13px', fontWeight: 600, color: '#f5f4f7' }}>
                  {tile.title}
                </span>
                <span style={{ fontSize: '10px', color: '#b6b0b3', marginTop: '2px', textAlign: 'center' }}>
                  {tile.subtitle.split(',')[0]}
                </span>
                {tile.badge && (
                  <span style={{
                    position: 'absolute',
                    top: '10px',
                    right: '12px',
                    fontSize: '9px',
                    fontWeight: 700,
                    backgroundColor: '#59659b',
                    color: '#fff',
                    padding: '2px 6px',
                    borderRadius: '8px'
                  }}>
                    {tile.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Live Detail & Terminal Output Dock */}
        <div style={{
          marginTop: '28px',
          maxWidth: '820px',
          backgroundColor: '#272224',
          borderRadius: '16px',
          padding: '18px 22px',
          color: '#e2dfdf',
          fontFamily: 'monospace',
          fontSize: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #3c3437', paddingBottom: '8px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a79fa2', fontWeight: 'bold' }}>
              <CheckCircle2 size={14} color="#60a5fa" />
              <span>ACTIVE ENGINE DOCK: {selectedTile.toUpperCase()}</span>
            </div>
            <span style={{ color: '#7a7074', fontSize: '11px' }}>BUBU V6.0 LIGHTWEIGHT ENVIRONMENT</span>
          </div>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5, color: '#4ade80' }}>
            {logOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}
