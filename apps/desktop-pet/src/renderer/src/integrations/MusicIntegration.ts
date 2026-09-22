import { BubuIntegration } from './IntegrationManager';
import { globalEventBus } from '../events/EventBus';

export class MusicIntegration implements BubuIntegration {
    id = 'music';
    name = 'Music Monitor';
    
    // In a full native app, this reads SMTC (Windows Media Session) via IPC.
    // For now, we listen to IPC events sent from main process (which we will mock).
    isAvailable() { return true; }

    async initialize() {
        window.electronAPI.onMediaChanged((mediaInfo) => {
            if (mediaInfo.state === 'PLAYING') {
                globalEventBus.emit('MUSIC_STARTED', mediaInfo);
                globalEventBus.emit('MUSIC_CHANGED', mediaInfo);
            } else if (mediaInfo.state === 'PAUSED') {
                globalEventBus.emit('MUSIC_PAUSED', mediaInfo);
            } else if (mediaInfo.state === 'STOPPED') {
                globalEventBus.emit('MUSIC_STOPPED', mediaInfo);
            }
        });
    }

    async start() {
        window.electronAPI.startMediaMonitor();
    }

    async stop() {
        window.electronAPI.stopMediaMonitor();
    }
}
