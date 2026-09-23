# Changelog

## [5.1.0] - 2026-09-23

### Added
- **Space Invader Avatar**: Integrated user-requested Space Invader skin as the default style in `SkinManager`.
- **Speech Bubble UI**: Rewrote `NotificationUI` to support heavily rounded, stylized pill-shaped speech bubbles.
- **bubu say CLI Command**: Added `bubu say "<message>"` for instant programmatic desktop companion notifications.
- **Diagnostics CLI**: Added `bubu diagnostics` and `bubu config check` for environment verification.
- **Unix Domain Sockets**: Bubu Desktop Daemon now hosts a secure UNIX socket at `/run/user/1000/bubu.sock` to handle native IPC correctly across Wayland compositors.

### Fixed
- **AppImage Runtime Crashes**: Fixed `esbuild` configurations in `desktop-pet` preventing `@bubu/platform-engine` from resolving.
- **Settings Connectivity**: Fixed timeout issues when the CLI attempts to open the GUI Control Center by ensuring zombie processes are cleaned up.
- **NPM Audit Vulnerabilities**: Hardened all dependencies and cleared critical/high vulnerabilities securely, while bypassing `allowScripts` blocks for Vite/ESBuild properly.
- **Hardcoded Paths**: Eliminated local development `~` / `/home/reny` pathing references for universal production Linux deployments.
