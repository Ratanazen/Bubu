#!/usr/bin/env bash
# Bubu Waybar Integration
# Usage in waybar config:
# {
#     "custom/bubu": {
#         "exec": "bubu waybar",
#         "return-type": "json",
#         "interval": 1
#     }
# }

# If bubu-cli is available, use it
if command -v bubu &> /dev/null; then
    bubu waybar
    exit 0
fi

# Fallback: try to read status from socket
SOCKET="${XDG_RUNTIME_DIR:-/tmp}/bubu.sock"

if [ -S "$SOCKET" ]; then
    echo '{"command":"waybar"}' | socat - UNIX-CONNECT:"$SOCKET" 2>/dev/null
else
    echo '{"text":"🐾 Bubu","tooltip":"Bubu is not running","class":"bubu-offline"}'
fi
