# 🐾 BUBU DESKTOP COMPANION V5

Bubu is a fully editable, cross-platform desktop companion and smart context-aware platform. 
Rather than just a static animation, Bubu is a **fully modular engine** where users can create their own characters, animations, styles, and skins—all connected natively to your operating system's compositors and applications.

---

## 🚀 Zero to Full: Installation Guide

Follow these steps to build and install Bubu from scratch (Zero to Full).

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- Git

### 1. Automated Installation (Linux)
We provide a one-click automated installation script that will install dependencies, compile the system build, package the AppImage, and install it to your system binaries:
```bash
git clone https://github.com/Ratanazen/Bubu.git
cd Bubu
./install.sh
```

### 2. Manual Build & Installation
If you prefer to build the app manually step-by-step:

```bash
# 1. Install all monorepo dependencies
npm install

# 2. Compile TypeScript and build Vite assets for all workspaces
npm run build

# 3. Package the final application (Outputs to release/)
npm run package:linux   # For Linux (.AppImage)
npm run package:mac     # For macOS (.dmg)
npm run package:win     # For Windows (.exe)
```

---

## 🏗️ System Build Architecture

The Bubu repository is structured as an NPM Workspace Monorepo. The build system compiles individual packages into a unified desktop application.

### Apps (`apps/`)
- **`desktop-pet`**: The core Electron main process and transparent renderer overlay.
- **`control-center`**: The React/Vite unified dashboard for configuration, profiles, and animation studio.
- **`lyrics-window`**: A floating transparent window for synchronized music lyrics.
- **`browser-extension`**: Chrome/Firefox extension bridging web media to the local Bubu WebSocket.
- **`cli`**: The `bubu` terminal command-line interface.

### Engines & Functions (`packages/`)
Bubu's functionality is powered by independent, modular engines:
- **Platform Engine**: Deep integrations with Wayland (Hyprland, Sway, Niri), X11, macOS, and Windows.
- **Waybar Engine**: Auto-generates custom Waybar JSON configurations for Linux ricers.
- **Context Engine**: Reads active windows to switch Bubu into "Coding Mode", "Gaming Mode", etc.
- **Animation & Character Engines**: State machines governing frame timings, gravity, and sprite states.
- **Integration Engine**: Secure, sandboxed connections to Telegram, Notion, and Discord.

---

## 🎮 Features & Functions

- **Smart App Awareness:** Bubu detects what you are doing (e.g., coding in VS Code) and automatically switches skins, animations, and opacity.
- **Zero Emoji UI:** The control center uses a strict, professional `lucide-react` vector icon system. Emojis are reserved exclusively for user-generated pet decorations.
- **Animation Studio:** Drag-and-drop your own `.png` or `.gif` files to build custom state machines without writing code.
- **Wayland First-Class Citizen:** Native IPC bindings for Hyprland workspaces and windows.
- **Sandboxed Plugins:** Extend Bubu using secure `.zip` plugins with strictly validated permission scopes.

---

## 🛠️ Development

To start the local development environment with Hot Module Replacement (HMR):
```bash
npm install
npm run dev
```
