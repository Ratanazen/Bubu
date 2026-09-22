# 🐾 Bubu Desktop Companion

A cute animated desktop companion that lives on your desktop.

## Features

- 🐻 **Desktop Pet** - Animated character on your desktop with transparent window
- 🎨 **Character Customization** - Upload your own character image, customize appearance
- 🎭 **Skins & Styles** - Multiple visual themes (Sakura, Night, Cyber, etc.)
- 🕺 **Animations** - Frame-based animation system with live preview
- 🎵 **Music Detection** - Detect playing music via OS media session & browser
- 🎤 **Lyrics** - Synced lyrics overlay with karaoke mode
- 🌐 **Browser Extension** - Chrome/Firefox/Edge extension for music metadata
- 🔔 **Notifications** - Bubu reacts to system notifications
- 🖥️ **Multi-Monitor** - Choose which display Bubu lives on
- 🐧 **Linux First-Class** - Waybar, Swaybar, Niri, Hyprland, Sway, i3, KDE, GNOME, XFCE
- 💻 **CLI** - `bubu` command for scripting and status bar integration
- ⚙️ **Control Center** - Beautiful dashboard to manage everything

## Supported Platforms

| Platform | Status |
|----------|--------|
| Windows 10/11 | ✅ |
| macOS | ✅ |
| Linux X11 | ✅ |
| Linux Wayland | ✅ |
| Hyprland | ✅ |
| Sway | ✅ |
| Niri | ✅ |
| i3 | ✅ |
| KDE Plasma | ✅ |
| GNOME | ✅ |
| XFCE | ✅ |

## Architecture

```
bubu/
├── apps/
│   ├── control-center/    # Main dashboard
│   ├── desktop-pet/       # Transparent pet overlay
│   ├── cli/               # bubu command
│   └── browser-extension/ # Chrome/Firefox extension
├── packages/
│   ├── core/              # EventBus, StateManager, IPC
│   ├── shared-types/      # TypeScript interfaces
│   ├── platform-engine/   # OS adapters
│   ├── behavior-engine/   # AI-free personality system
│   ├── animation-engine/  # Frame-based player
│   ├── skin-engine/       # Skin management
│   ├── style-engine/      # Visual style system
│   ├── character-engine/  # Character asset pipeline
│   ├── music-engine/      # Media detection
│   ├── lyrics-engine/     # Lyrics fetch & sync
│   ├── browser-engine/    # Browser bridge
│   ├── notification-engine/ # Notification handler
│   ├── asset-engine/      # Import/export assets
│   └── integration-engine/ # DE integration adapters
└── integrations/
    ├── waybar/ swaybar/ niri/ hyprland/ sway/ i3/ kde/ gnome/ xfce/
```

## Quick Start

```bash
npm install && npm run build && npm run dev
```

## CLI Usage

```bash
bubu start | bubu status | bubu pet show | bubu skin use sakura | bubu waybar
```

## Privacy

Bubu is privacy-first. All processing is local. No telemetry by default.

## License

MIT
