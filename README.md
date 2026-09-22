# Bubu Desktop Companion V5

A fully cross-platform desktop companion platform.

## Features
- **Cross-Platform:** Runs on Linux, macOS, and Windows.
- **Desktop Pet:** Custom character rendering and animations.
- **Control Center:** All-in-one UI for managing integrations.
- **Deep Integrations:** 
  - Linux: Hyprland, Sway, Niri, X11, KDE, GNOME, Waybar
  - macOS: Menu Bar, Spaces (Best Effort)
  - Windows: System Tray, Virtual Desktops (Best Effort)
- **Engines:** Screen, Workspace, Window, Compositor, Animation, Style, Music, Notification, Browser.

## Installation

### Linux
Download the `AppImage` from the release page.
Install globally using the `bubu` CLI tool.

### macOS
Download the `.dmg`. Drag `Bubu.app` to your Applications folder.

### Windows
Download the `.exe` setup or `.msi` package.

## CLI Usage
`bubu start` - Start daemon
`bubu status` - Health check
`bubu doctor` - Diagnostic checks
`bubu platform detect` - See platform integration capabilities
`bubu pet show` - Show the pet

## Development
```
npm install
npm run dev
npm run build
```
