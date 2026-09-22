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
    skin: 'default'
};


function migrateConfig(config: any) {
    if (!config) return config;
    let version = config.version || 1;
    if (version < 2) {
        config.version = 2;
    }
    if (version < 3) {
        config.version = 3;
    }
    if (version < 4) {
        config.version = 4;
        config.theme = config.theme || 'system';
    }
    if (version < 5) {
        config.version = 5;
        // V5 migration: OS agnostic paths and tray settings
        config.trayEnabled = true;
    }
    return config;
}

export function loadSettings() {
    try {
        if (fs.existsSync(settingsPath)) {
            return { ...defaultSettings, ...JSON.parse(fs.readFileSync(settingsPath, 'utf-8')) };
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
