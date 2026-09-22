# Bubu i3 Integration

## Auto-Detection

Bubu detects i3 by checking the `I3SOCK` environment variable.

## Active Window Detection

Under i3, Bubu uses `i3-msg -t get_tree` or `xdotool getactivewindow getwindowfocus getwindowname` to detect the focused window.

## Status Bar

For i3bar, use `bubu i3` which outputs i3bar-compatible JSON.

If using Polybar or another bar, use `bubu waybar` for JSON output.

## CLI

```bash
bubu i3
```

## Window Rules (optional)

Add to your i3 config:

```
for_window [class="bubu-desktop-pet"] floating enable
for_window [class="bubu-desktop-pet"] border none
for_window [class="bubu-desktop-pet"] sticky enable
```

> **Note**: Bubu does NOT modify your i3 config automatically.
