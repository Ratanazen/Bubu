let socket = null;

function connect() {
    socket = new WebSocket('ws://127.0.0.1:14233');

    socket.onopen = () => {
        console.log("Connected to Bubu Core");
    };

    socket.onclose = () => {
        console.log("Disconnected. Reconnecting in 5s...");
        setTimeout(connect, 5000);
    };

    socket.onerror = (e) => {
        console.error("Socket error", e);
    };
}

connect();

// Receive messages from content script and forward to Tauri
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    }
});
