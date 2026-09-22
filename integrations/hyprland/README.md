# Bubu Hyprland Integration

## Auto-Detection

Bubu detects Hyprland by checking `HYPRLAND_INSTANCE_SIGNATURE` environment variable.

## Status Bar (Waybar)

Most Hyprland users use Waybar. Add:

```json
{
    "custom/bubu": {
        "exec": "bubu waybar",
        "return-type": "json",
        "interval": 1
    }
}
```

## CLI

```bash
bubu hyprland
```

Returns JSON with Bubu state and active Hyprland workspace info.

## Window Rules (optional)

Add to `hyprland.conf`:

```ini
windowrulev2 = float,class:^(bubu-desktop-pet)$
windowrulev2 = noblur,class:^(bubu-desktop-pet)$
windowrulev2 = noshadow,class:^(bubu-desktop-pet)$
windowrulev2 = noborder,class:^(bubu-desktop-pet)$
windowrulev2 = pin,class:^(bubu-desktop-pet)$
```

> **Note**: Bubu does NOT modify your Hyprland config. Copy rules manually.
