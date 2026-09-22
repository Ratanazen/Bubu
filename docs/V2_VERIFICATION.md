# Bubu V2 Verification Matrix

| Subsystem | Status | Platforms Verified | Test Details |
|---|---|---|---|
| **Core Architecture & Monorepo** | ✅ Production Ready | Linux / Windows / macOS | 17 workspaces build cleanly without TypeScript errors |
| **Control Center V2** | ✅ Production Ready | Linux / Windows / macOS | React 18 + Vite compiled; 9 pages + Command Palette (Ctrl+K) |
| **Desktop Pet** | ✅ Production Ready | Linux (Wayland/X11), Win, Mac | Transparent overlay, physics loop, drag & drop, Petting system |
| **Floating Lyrics Window** | ✅ Production Ready | Linux / Windows / macOS | Standalone blurred glass overlay; synced LRC matcher |
| **CLI Tool (`bubu`)** | ✅ Production Ready | Linux / Windows / macOS | Tested `bubu --help`, `bubu waybar`, `bubu hyprland`, `bubu doctor` |
| **Bubu Doctor (`bubu doctor`)** | ✅ Production Ready | Linux / Windows / macOS | Passed OS, Compositor, Waybar, Reference Asset tests |
| **Privacy Engine** | ✅ Production Ready | Universal | Strict zero-persistence policy, regex sensitive data redactor |
| **Performance Engine** | ✅ Production Ready | Universal | Non-blocking CPU metrics, Game Mode & Battery Saver profiles |
| **Plugin Engine** | ✅ Production Ready | Universal | Declarative manifest parser, permission sandboxing |
| **Waybar Integration** | ✅ Production Ready | Linux (Wayland) | Valid Waybar JSON returned with offline fallbacks |
| **Base Character Integrity** | ✅ Verified Preserved | All | Reference sprite preserved untouched in assets/characters/ |

---

## Known Environment Limitations

1. **Wayland Global Shortcuts**: Wayland compositors restrict global hotkeys by design without compositor-level bindings. Users can bind hotkeys in their compositor config (`hyprland.conf`, `sway/config`) calling `bubu pet show/hide`.
2. **Offline Mode**: If the local companion daemon is stopped, CLI commands like `bubu waybar` automatically degrade to offline indicators rather than hanging.
