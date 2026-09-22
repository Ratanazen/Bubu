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
