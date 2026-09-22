# Bubu Niri Integration

## Status Bar

If you are using a status bar with Niri (such as Waybar), you can use the Bubu Waybar module.

### Waybar

Add the following to your Waybar config:

```json
{
    "custom/bubu": {
        "exec": "bubu waybar",
        "return-type": "json",
        "interval": 1
    }
}
```

## Niri IPC

Bubu will automatically detect if you are running Niri by checking for the `NIRI_SOCKET` environment variable.

When running under Niri, Bubu will:
- Use Wayland-compatible transparent window rendering
- Respect Niri window rules
- Provide status output via `bubu niri`

### CLI

```bash
bubu niri
```

This outputs a JSON status suitable for integration with Niri-compatible panels or scripts.

## Window Rules (optional)

You may add window rules for Bubu in your Niri config:

```kdl
window-rule {
    match app-id="bubu-desktop-pet"
    open-floating true
}
```

> **Note**: Bubu does NOT modify your Niri configuration automatically. Copy these snippets manually.
