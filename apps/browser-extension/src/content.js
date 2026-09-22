// Bubu Browser Extension - Content Script
// Detects media playback on supported music sites

(function() {
    'use strict';

    const POLL_INTERVAL = 1000;
    let lastState = null;

    function getMediaState() {
        // Try to find the HTML5 media element
        const video = document.querySelector('video');
        const audio = document.querySelector('audio');
        const media = video || audio;

        if (!media) return null;

        const state = {
            state: media.paused ? 'paused' : 'playing',
            position: Math.floor(media.currentTime),
            duration: Math.floor(media.duration) || 0,
            title: '',
            artist: '',
            album: '',
            artworkUrl: ''
        };

        // Site-specific metadata extraction
        const host = window.location.hostname;

        if (host.includes('music.youtube.com')) {
            const titleEl = document.querySelector('.title.ytmusic-player-bar');
            const artistEl = document.querySelector('.byline.ytmusic-player-bar .yt-formatted-string');
            const artEl = document.querySelector('.image.ytmusic-player-bar img');
            state.title = titleEl ? titleEl.textContent.trim() : '';
            state.artist = artistEl ? artistEl.textContent.trim() : '';
            state.artworkUrl = artEl ? artEl.src : '';
        } else if (host.includes('open.spotify.com')) {
            const titleEl = document.querySelector('[data-testid="context-item-link"]');
            const artistEl = document.querySelector('[data-testid="context-item-info-subtitles"] a');
            const artEl = document.querySelector('[data-testid="CoverSlotCollapsed__container"] img');
            state.title = titleEl ? titleEl.textContent.trim() : '';
            state.artist = artistEl ? artistEl.textContent.trim() : '';
            state.artworkUrl = artEl ? artEl.src : '';
        } else if (host.includes('soundcloud.com')) {
            const titleEl = document.querySelector('.playbackSoundBadge__titleLink span:last-child');
            const artistEl = document.querySelector('.playbackSoundBadge__lightLink');
            state.title = titleEl ? titleEl.textContent.trim() : '';
            state.artist = artistEl ? artistEl.textContent.trim() : '';
        }

        // Fallback: use MediaSession API if available
        if (!state.title && navigator.mediaSession && navigator.mediaSession.metadata) {
            const meta = navigator.mediaSession.metadata;
            state.title = meta.title || '';
            state.artist = meta.artist || '';
            state.album = meta.album || '';
            if (meta.artwork && meta.artwork.length > 0) {
                state.artworkUrl = meta.artwork[meta.artwork.length - 1].src;
            }
        }

        return state;
    }

    function sendUpdate(mediaState) {
        chrome.runtime.sendMessage({
            type: 'MEDIA_UPDATE',
            payload: mediaState
        });
    }

    // Poll for media state changes
    setInterval(() => {
        const state = getMediaState();
        if (state) {
            const stateStr = JSON.stringify(state);
            if (stateStr !== lastState) {
                lastState = stateStr;
                sendUpdate(state);
            }
        }
    }, POLL_INTERVAL);

    console.log('[Bubu] Content script loaded for media detection');
})();
