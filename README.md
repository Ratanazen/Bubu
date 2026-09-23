# 🐾 BUBU DESKTOP COMPANION V6

Bubu is an advanced, fully autonomous, multi-character desktop pet platform built with **Tauri V2 (Rust + React)**. 

Far beyond a simple animation, Bubu is a **fully modular, privacy-first ecosystem** where digital characters live independently on your desktop. They possess unique personalities, moods, energy levels, and relationships. They interact with each other, react to your music, monitor your active computer applications, and navigate your screens—all while you configure their world from a powerful Control Center.

---

## ✨ V6 Features

### 🧠 Autonomous Swarm & Relationship Engine
- **Multi-Character System:** Spawn Bubu, Bibi, and an unlimited number of custom friends into independent, frameless, transparent OS windows.
- **Hive-Mind AI:** Characters are aware of each other's physical coordinates on your screen.
- **Dynamic Relationships:** Configure bonds (e.g., *Close Friends*, *Lovers*). Characters will autonomously approach each other to play, laugh, wave, or even get into arguments (and apologize later!).
- **Personality & Mood:** Give each character a personality (Playful, Lazy, Energetic). Their energy depletes as they run and recovers as they sleep. 

### 🎨 Advanced Image Processing Studio
- **Local Background Removal:** Upload raw photos and strip backgrounds instantly. Powered by `@imgly/background-removal` WebAssembly, this happens **100% locally and offline**. Your photos never leave your machine (Privacy First).
- **Pixel Art Generator:** A custom HTML5 Canvas engine that converts your photos into authentic, crisp 8-bit game sprites.
- **Asset Library:** Non-destructive editing. Save processed images as transparent assets in your local library.

### 🎬 Animation Frame Mapper
- **Visual Frame Slots:** Drag and drop assets from your library directly into animation slots (Walk, Run, Sleep, Code, etc.).
- **Live Preview:** Test your sprite sheets instantly in a live-render preview box equipped with customizable FPS and scale multipliers.

### 💻 Smart Context & OS Integration
- **Live Lyrics Engine:** Automatically detects playing music and fetches timestamped LRC lyrics, displaying a karaoke-style speech bubble above your pet.
- **Application Awareness:** Uses native Rust `sysinfo` to monitor your active windows. If you open an IDE (like VS Code), Bubu autonomously switches to a `coding` or `thinking` animation.

### 🛡️ Unbreakable Desktop Architecture
- **Detached Rendering:** The characters live in independent `pet.html` Tauri windows. You can navigate through the React Control Center without ever interrupting, reloading, or resetting your pets.
- **Safe Sandboxing:** Built on Tauri, the app is incredibly lightweight on RAM and CPU compared to Electron alternatives.

---

## 🚀 Installation Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- Rust & Cargo (for Tauri V2 backend)

### 1. Build & Run (Development)
To start the local development environment with Hot Module Replacement (HMR):

```bash
# 1. Clone the repository
git clone https://github.com/Ratanazen/Bubu.git
cd Bubu

# 2. Install Node dependencies
npm install

# 3. Launch Tauri Development Server
npm run tauri dev
```

### 2. Compile Release Binary
To compile the final, highly-optimized executable for your operating system:

```bash
npm run tauri build
```
*(The output binary will be located in `src-tauri/target/release/`)*

---

## 🏗️ System Architecture

- **`src-tauri/`**: The Rust backend powering OS window management, transparent overlays, system monitors, and IPC commands.
- **`src/desktop-pet/`**: The decoupled React renderer that physically moves the frameless Tauri windows across your screen and interpolates animation frames.
- **`src/control-center/`**: The beautiful, unified dashboard for the Image Studio, Character Management, and Relationship configurations.
- **`src/shared/store/`**: A robust `zustand` + `BroadcastChannel` state network that synchronizes data instantly between the Control Center and the swarm of Desktop Pets.

---

## 🔒 Privacy & Safety Guarantee

Bubu is designed to be **Privacy-First**.
- **No Cloud Image Processing:** All background removal and pixelation happens locally via WASM.
- **No Telemetry:** Your application activity and music metadata are processed locally by Rust and discarded. 

---

*Transform your desktop into a living ecosystem. Build your perfect companion today.*
