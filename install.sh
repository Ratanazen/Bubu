#!/bin/bash
# BUBU V5 - Zero to Full Installation Script

set -e

echo "🐾 Starting Bubu V5 Zero-to-Full Installation..."

echo "📦 1. Installing dependencies..."
npm install
npm rebuild electron

echo "🔨 2. Building all packages and applications..."
npm run build

echo "⚙️  3. Packaging the system into an AppImage..."
npm run package:linux

echo "🚀 4. Installing Bubu to your system..."
mkdir -p ~/.local/bin
find release -name "*.AppImage" -exec cp {} ~/.local/bin/bubu-desktop-pet \;
chmod +x ~/.local/bin/bubu-desktop-pet

echo "✅ Bubu V5 has been fully installed!"
echo "You can now run 'bubu-desktop-pet' from your terminal or application launcher."
