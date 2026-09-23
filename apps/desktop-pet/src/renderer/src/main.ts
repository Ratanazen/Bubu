import { Bubu } from './pet/Bubu';
import { BehaviorEngine } from './behavior/BehaviorEngine';
import { IntegrationManager } from './integrations/IntegrationManager';
import { AppMonitor } from './integrations/AppMonitor';
import { MusicIntegration } from './integrations/MusicIntegration';
import { LyricsManager } from './lyrics/LyricsManager';
import { LyricsWindow } from './lyrics/LyricsWindow';
import { MusicWidget } from './music/MusicWidget';
import { SkinManager } from './skins/SkinManager';
import { NotificationUI } from './notifications/NotificationUI';
import { ContextMenu } from './ui/ContextMenu';
import { globalEventBus } from './events/EventBus';
import { ProfileEngine } from '@bubu/profile-engine';

const app = document.getElementById('app')!;
const petContainer = document.createElement('div');
petContainer.className = 'pet-container';
app.appendChild(petContainer);

// Core Systems
const bubu = new Bubu(petContainer);
const behavior = new BehaviorEngine(bubu);
const skinManager = new SkinManager();
const lyricsManager = new LyricsManager();

// UI Elements
const notificationUI = new NotificationUI(app);
const musicWidget = new MusicWidget(app);
const lyricsWindow = new LyricsWindow(app);
const contextMenu = new ContextMenu(app);

// Integrations
const integrationManager = new IntegrationManager();
integrationManager.register(new AppMonitor());
integrationManager.register(new MusicIntegration());
integrationManager.initializeAll();

// Interaction
petContainer.addEventListener('mouseenter', () => {
    window.electronAPI.setIgnoreMouseEvents(false);
});
petContainer.addEventListener('mouseleave', () => {
    window.electronAPI.setIgnoreMouseEvents(true, true);
});

petContainer.addEventListener('mousedown', (e) => bubu.onMouseDown(e));
window.addEventListener('mousemove', (e) => bubu.onMouseMove(e));
window.addEventListener('mouseup', (e) => bubu.onMouseUp(e));
petContainer.addEventListener('dblclick', () => bubu.onDoubleClick());

// Admin / Command execution from UI
window.addEventListener('cmd', (e: any) => {
    if (e.detail === 'sleep') bubu.setState('SLEEP');
    if (e.detail === 'dance') bubu.setState('DANCE');
    if (e.detail === 'play') bubu.setState('PLAY');
    if (e.detail === 'run') bubu.setState(Math.random() > 0.5 ? 'RUN_LEFT' : 'RUN_RIGHT');
    if (e.detail === 'speak') {
        bubu.setState('HAPPY');
        globalEventBus.emit('NOTIFICATION_RECEIVED', { title: 'Bubu says:', message: 'Hello there! I am ready to play!'});
    }
});

// Update settings live (Size and Skin)
window.addEventListener('settings-updated', (e: any) => {
    const settings = e.detail;
    if (settings.skin) {
        skinManager.loadSkin(settings.skin);
    }
    if (settings.petSize) {
        petContainer.style.transform = `scale(${settings.petSize})`;
    }
});

window.electronAPI.onPauseStateChanged((paused) => {
    bubu.isPaused = paused;
    if (paused) bubu.setState('IDLE');
});

let lastTime = performance.now();
function loop(time: number) {
    const dt = time - lastTime;
    lastTime = time;
    bubu.update(dt);
    behavior.update(dt);
    requestAnimationFrame(loop);
}

// Initial bounds check and load settings
window.electronAPI.getScreenBounds().then(bounds => {
    bubu.setBounds(bounds);
    requestAnimationFrame(loop);
});

// Initialize skin and size from backend
skinManager.initialize();
window.electronAPI.getSettings().then(settings => {
    if (settings.petSize) petContainer.style.transform = `scale(${settings.petSize})`;
});

// M10 Context Profile Engine setup
const profileEngine = new ProfileEngine();

globalEventBus.subscribe('APP_FOCUSED', (event) => {
    profileEngine.updateContext('app_focused', event.payload);
});
globalEventBus.subscribe('MUSIC_PLAYING', (event) => {
    profileEngine.updateContext('music_playing', event.payload?.isPlaying || false);
});

profileEngine.subscribe((profile) => {
    console.log('[ProfileEngine] Activated Profile:', profile.name);
    if (profile.styleId) {
        skinManager.loadSkin(profile.styleId);
    }
    if (profile.settings?.scale) {
        petContainer.style.transform = `scale(${profile.settings.scale})`;
    }
    if (profile.settings?.opacity) {
        petContainer.style.opacity = `${profile.settings.opacity}`;
    }
    if (profile.settings?.behaviorPreset) {
        if (profile.settings.behaviorPreset === 'sleepy') {
            bubu.setState('SLEEP');
        } else if (profile.settings.behaviorPreset === 'energetic') {
            behavior.reactToMusic(true);
        } else if (profile.settings.behaviorPreset === 'quiet') {
            bubu.setState('SIT');
        }
    }
    globalEventBus.emit('NOTIFICATION_RECEIVED', { title: 'Context Switched', message: `Profile changed to ${profile.name}`});
});
