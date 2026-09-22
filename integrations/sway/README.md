# Bubu Sway Integration

## Auto-Detection

Bubu detects Sway by checking the `SWAYSOCK` environment variable.

## Active Window Detection

Under Sway, Bubu uses `swaymsg -t get_tree` to detect the currently focused window.

## Status Bar (Waybar/Swaybar)

Add to your Waybar config:

```json
{
    "custom/bubu": {
        "exec": "bubu waybar",
        "return-type": "json",
        "interval": 1
    }
}
```

Or for Swaybar, use `bubu swaybar`.

## CLI

```bash
bubu sway
```

## Window Rules (optional)

Add to your Sway config:

```
for_window [app_id="bubu-desktop-pet"] floating enable
for_window [app_id="bubu-desktop-pet"] border none
for_window [app_id="bubu-desktop-pet"] sticky enable
```

> **Note**: Bubu does NOT modify your Sway config automatically.
