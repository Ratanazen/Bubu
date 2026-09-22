# Bubu V2 Architecture & Subsystem Guide

This document describes the upgraded **BUBU V2** production architecture.

---

## 1. Monorepo Map

```
bubu/
├── apps/
│   ├── control-center/      # React 18 + Vite Control Center UI (Command Palette, Studios)
│   ├── desktop-pet/         # Electron transparent pet window with physics & petting system
│   ├── lyrics-window/       # Independent floating blur-enabled karaoke lyrics overlay
│   ├── cli/                 # Unified 'bubu' CLI tool & 'bubu doctor'
│   └── browser-extension/   # Manifest V3 extension for Chrome/Firefox/Brave/Edge
│
├── packages/
│   ├── core/                # EventBus, StateManager, SettingsStore, IpcBridge
│   ├── shared-types/        # Unified type definitions across all systems
│   ├── character-engine/    # Reference asset pipeline & non-destructive customization
│   ├── animation-engine/    # Timeline frame player with loop & ping-pong
│   ├── behavior-engine/     # State machine with 8 personality profiles
│   ├── asset-engine/        # Non-destructive file importer, hash check & .bubu package exporter
│   ├── skin-engine/         # Skin manifest parser & local library manager
│   ├── style-engine/        # 23 visual styles with color palettes & shader effects
│   ├── music-engine/        # Media session listener & cross-source aggregator
│   ├── lyrics-engine/       # LRC Parser, LRCLIB API client, and sync matcher
│   ├── browser-engine/      # Zero-dependency RFC 6455 local WebSocket bridge
│   ├── notification-engine/ # In-memory privacy-guarded alert queue
│   ├── privacy-engine/      # Strict capability checks, permission logs, and sensitive redaction
│   ├── performance-engine/  # Power profiles (Normal, Low Power, Battery Saver, Game Mode)
│   ├── plugin-engine/       # Declarative sandboxed extension manager
│   ├── platform-engine/     # 12 OS/Compositor adapters (Windows, macOS, Wayland, X11, Hyprland, etc.)
│   └── integration-engine/  # Desktop environment bar configuration generators
│
└── integrations/
    ├── waybar/              # Exec scripts and config for Waybar
    ├── swaybar/             # Swaybar / i3bar JSON status formatters
    ├── niri/                # Niri IPC rules and documentation
    ├── hyprland/            # Window rules (windowrulev2 = float, pin...)
    ├── sway/                # Sway floating window guides
    └── i3/                  # i3 window manager setup
```

---

## 2. Key V2 Upgrades

1. **Independent Lyrics Window (`apps/lyrics-window`)**:
   - Runs as a standalone floating, click-through, glass-blurred karaoke overlay.
2. **Command Palette (`Ctrl/Cmd + K`)**:
   - Fast dynamic search bar in the Control Center for instant actions.
3. **Character Studio & Animation Studio V2**:
   - Side-by-side comparison preserving the base reference image, with instant reset.
   - Interactive frame-by-frame animation timeline editor.
4. **Bubu Doctor Diagnostic CLI**:
   - `bubu doctor` command providing automated checks of the OS, compositor, transparency, socket, and assets.
5. **Petting Interaction System**:
   - Click, drag, and streak-based petting affection logic with cooldown prevention.
