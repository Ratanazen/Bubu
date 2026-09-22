# BUBU V2 Upgrade Audit & Architecture Analysis

**Audit Date:** 2026-09-22  
**Target:** BUBU Desktop Companion → BUBU V2  
**Repository:** `/home/reny/Documents/Bubu`

---

## 1. Current Architecture Overview

The repository is structured as an NPM Workspaces monorepo:
- **`apps/control-center`**: React 18 + Vite dashboard with 9 pages.
- **`apps/desktop-pet`**: Electron transparent window with physics, SVG/Retro skin renderer, and basic IPC.
- **`apps/cli`**: Node CLI (`bubu-cli` / `bubu`) with handlers for pet, music, lyrics, skins, waybar, and hyprland.
- **`apps/browser-extension`**: Chrome Manifest V3 extension with content script for media sites and WebSocket bridge.
- **`packages/*`**: 13 engine packages (`core`, `shared-types`, `character-engine`, `animation-engine`, `behavior-engine`, `asset-engine`, `skin-engine`, `style-engine`, `music-engine`, `lyrics-engine`, `browser-engine`, `notification-engine`, `platform-engine`, `integration-engine`).

---

## 2. Feature Implementation Status

### Working / Verified Features
- ✅ **Full Monorepo Compilation**: All workspaces build cleanly with TypeScript strict mode.
- ✅ **Platform Detection & Adapters**: 12 adapters (Windows, macOS, X11, Wayland, Niri, Sway, Hyprland, KDE, GNOME, XFCE).
- ✅ **CLI & Waybar/Hyprland JSON Output**: Standalone executable CLI providing real output with offline fallbacks.
- ✅ **Core State & IPC Socket Bridge**: Unix domain socket & Windows named pipe implementation with framed JSON RPC.
- ✅ **LRC Parser & Synchronizer**: Complete LRC timestamp parser and binary-search timeline tracker.
- ✅ **Base Character Asset Integrity**: Original uploaded reference image strictly preserved in `assets/characters/bubu-reference.png`.

### Missing or Incomplete V2 Systems
1. **`privacy-engine`**: Currently basic boolean flags in `settings.ts`; needs a dedicated engine enforcing zero-leakage, log redaction, and granular permission explanation.
2. **`performance-engine`**: Needs battery saver, low-power mode, FPS limiter, dynamic asset unloading, and non-polling CPU/RAM monitors.
3. **`plugin-engine`**: Missing a sandboxed plugin registry and manifest validator for custom skins/lyrics/music extensions.
4. **Independent Floating Lyrics Window (`apps/lyrics-window`)**: Control center displays lyrics, but an independent floating, click-through karaoke overlay window app is missing.
5. **Command Palette (`Ctrl/Cmd + K`)**: Control Center lacks a global keyboard-driven dynamic command palette.
6. **Bubu Doctor Diagnostic CLI**: `bubu doctor` needs full diagnostic probes for GPU, Wayland/X11, transparency, D-Bus, and dependencies.
7. **Petting Interaction System**: Desktop pet lacks click, double-click, hover, and petting gesture detection with interaction cooldowns.
8. **V1 → V2 Migration & Packaging**: Need `.bubu` package export/import with version migration schema.

---

## 3. Technical Debt & Issues

- **Coupling in Desktop Pet Main Process**: Electron main process in `apps/desktop-pet/src/main/main.ts` still has legacy hardcoded settings logic that should read directly from `@bubu/core`'s `SettingsStore`.
- **Mock Media Player in Renderer**: Legacy `ipc.ts` still had a 5-second mock timer for testing songs. It must be decoupled into `@bubu/music-engine` events.
- **No Consolidated Automated Test Suite**: Individual engine tests exist, but a unified root `npm run test` runner is missing.

---

## 4. Recommended Incremental Migration Plan

1. **Phase 1: New Engines (`privacy-engine`, `performance-engine`, `plugin-engine`)**
   - Implement strict permission boundaries and audit loggers.
   - Implement power modes (Normal, Low Power, Battery Saver, Game Mode).
   - Implement plugin sandboxing with declarative permissions.

2. **Phase 2: Independent Floating Lyrics Window (`apps/lyrics-window`)**
   - Lightweight, click-through, transparent karaoke overlay.

3. **Phase 3: Control Center V2 Upgrades**
   - Command Palette (`Ctrl/Cmd + K`).
   - Character Studio (Before/After & Reset).
   - Animation Studio V2 (timeline editor).
   - Live Performance Monitor & Privacy Center.

4. **Phase 4: Desktop Pet V2 Upgrades**
   - Petting, clicking, and interaction cooldown engine.
   - Live state machine connection to `@bubu/behavior-engine`.

5. **Phase 5: CLI V2 & Bubu Doctor**
   - Implement `bubu doctor`, `bubu logs`, `bubu diagnostics`.

6. **Phase 6: Automated Test Suite & Documentation**
   - Full suite in `tests/` and docs in `docs/`.
