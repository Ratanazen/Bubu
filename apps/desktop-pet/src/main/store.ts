import fs from 'fs';
import path from 'path';
import { app } from 'electron';

const settingsPath = path.join(app.getPath('userData'), 'bubu-settings.json');

const defaultSettings = {
    alwaysOnTop: true,
    startWithWindows: false,
    petSize: 1,
    movementSpeed: 1,
    animationSpeed: 1,
    behaviorMode: 'normal',
    skin: 'default',
    version: 6,
    position: {
        x: 100,
        y: 100,
        monitorId: '',
        workspaceId: '',
        anchor: 'center',
        scale: 1.0,
        rotation: 0,
        opacity: 1.0,
        locked: false
    }
};

function migrateConfig(config: any) {
    if (!config) return config;
    let version = config.version || 1;
    if (version < 2) config.version = 2;
    if (version < 3) config.version = 3;
    if (version < 4) { config.version = 4; config.theme = config.theme || 'system'; }
    if (version < 5) { config.version = 5; config.trayEnabled = true; }
    if (version < 6) {
        config.version = 6;
        if (!config.position) config.position = defaultSettings.position;
    }
    return config;
}

export function loadSettings() {
    try {
        if (fs.existsSync(settingsPath)) {
            const parsed = migrateConfig(JSON.parse(fs.readFileSync(settingsPath, 'utf-8')));
            return { ...defaultSettings, ...parsed, position: { ...defaultSettings.position, ...parsed.position } };
        }
    } catch (e) {
        console.error('Failed to load settings', e);
    }
    return defaultSettings;
}

export function saveSettings(settings: any) {
    try {
        const newSettings = { ...loadSettings(), ...settings };
        fs.writeFileSync(settingsPath, JSON.stringify(newSettings, null, 2));
    } catch(e) {
        console.error('Failed to save settings', e);
    }
}
