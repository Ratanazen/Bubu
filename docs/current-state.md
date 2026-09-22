# Current State of Bubu Monorepo (Pre-V5 Audit)

## Architecture Overview
The project is a TypeScript monorepo using npm workspaces (`apps/*`, `packages/*`).
Currently targets primarily Linux (V4 added Wayland/X11 adapters).

### Packages
- `@bubu/core`: EventBus and StateManager primitives
- `@bubu/shared-types`: Common interfaces and enums across the app
- `@bubu/platform-engine`: Basic compositor and platform adapters (`HyprlandAdapter`, `SwayAdapter`, `WindowsAdapter`, `MacOSAdapter`, etc.). Windows and MacOS are currently stubs.
- `@bubu/screen-engine`: Utilities for screen geometries and edge placement
- `@bubu/waybar-engine`: Linux-specific Waybar module manager

## Cross-Platform Readiness
- **Linux:** Fully supported with AppImage, `.desktop` files, and native IPC.
- **macOS:** Code structured, but `MacOSAdapter` is a stub. `.dmg` packaging exists in `electron-builder.yml` but is untested/failing on Linux without cross-compilation setup. Native menu bar integration is missing.
- **Windows:** Code structured, but `WindowsAdapter` is a stub. `.exe` packaging (`nsis`) exists in `electron-builder.yml` but lacks deep shell integration.

## Build Status
- `npm run build` succeeds on Linux.
- Windows/macOS cross-compilation may face limitations on the current Linux host environment.
