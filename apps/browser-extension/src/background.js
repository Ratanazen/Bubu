// Bubu Browser Extension - Background Service Worker
// Bridges between content scripts and the native Bubu app

const NATIVE_HOST = 'com.bubu.companion';
let nativePort = null;
let currentMediaState = null;
let isConnected = false;

// Try to connect to native messaging host
function connectToNative() {
    try {
        nativePort = chrome.runtime.connectNative(NATIVE_HOST);
        isConnected = true;

        nativePort.onMessage.addListener((msg) => {
            console.log('[Bubu] Native message:', msg);
            if (msg.type === 'COMMAND') {
                handleNativeCommand(msg);
            }
        });

        nativePort.onDisconnect.addListener(() => {
            console.log('[Bubu] Native host disconnected');
            isConnected = false;
            nativePort = null;
            // Retry after delay
            setTimeout(connectToNative, 5000);
        });

        console.log('[Bubu] Connected to native host');
    } catch (e) {
        console.log('[Bubu] Native messaging not available, using local WebSocket fallback');
        isConnected = false;
        connectWebSocket();
    }
}

// Fallback: WebSocket to local Bubu server
let ws = null;

function connectWebSocket() {
    try {
        ws = new WebSocket('ws://127.0.0.1:19876');
        ws.onopen = () => {
            isConnected = true;
            console.log('[Bubu] WebSocket connected');
        };
        ws.onclose = () => {
            isConnected = false;
            ws = null;
            setTimeout(connectWebSocket, 5000);
        };
        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                handleNativeCommand(msg);
            } catch (e) {}
        };
        ws.onerror = () => {
            isConnected = false;
        };
    } catch (e) {
        isConnected = false;
    }
}

function sendToNative(data) {
    if (nativePort) {
        nativePort.postMessage(data);
    } else if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    }
}

function handleNativeCommand(msg) {
    // Handle commands from the Bubu app
    if (msg.command === 'GET_STATUS') {
        sendToNative({
            type: 'STATUS',
            media: currentMediaState,
            connected: true
        });
    }
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'MEDIA_UPDATE') {
        currentMediaState = message.payload;
        sendToNative({
            type: 'MEDIA_UPDATE',
            payload: message.payload
        });
    }
    sendResponse({ ok: true });
});

// Initialize
connectToNative();

// Periodic status ping
setInterval(() => {
    if (isConnected) {
        sendToNative({
            type: 'HEARTBEAT',
            media: currentMediaState,
            timestamp: Date.now()
        });
    }
}, 5000);
