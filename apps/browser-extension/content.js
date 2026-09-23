function pollVideo() {
    const video = document.querySelector('video');
    if (video) {
        chrome.runtime.sendMessage({
            url: window.location.href,
            title: document.title,
            timestamp: video.currentTime
        });
    }
}

setInterval(pollVideo, 1000);
