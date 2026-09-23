// Bubu Browser Extension - Popup Script

const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const lyricsStatus = document.getElementById('lyricsStatus');

function updateUI(state) {
    if (state && state.connected) {
        statusDot.className = 'dot connected';
        statusText.textContent = 'Connected';
    } else {
        statusDot.className = 'dot disconnected';
        statusText.textContent = 'Disconnected';
    }

    if (state && state.media) {
        const m = state.media;
        if (m.state === 'playing') {
            songTitle.textContent = m.title || 'Unknown Track';
            songArtist.textContent = m.artist || 'Unknown Artist';
        } else if (m.state === 'paused') {
            songTitle.textContent = `${m.title || 'Paused'}`;
            songArtist.textContent = m.artist || '';
        } else {
            songTitle.textContent = 'Not Playing';
            songArtist.textContent = '';
        }

        if (m.title) {
            lyricsStatus.textContent = 'Available';
        }
    }
}

function sendCmd(command) {
    chrome.runtime.sendMessage({ type: 'BUBU_COMMAND', command }, (response) => {
        // Flash the button briefly
    });
}

// Make sendCmd available to onclick handlers
window.sendCmd = sendCmd;

// Get initial state
chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (response) => {
    updateUI(response);
});

// Poll for updates
setInterval(() => {
    chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (response) => {
        updateUI(response);
    });
}, 2000);
