interface LyricLine {
  time: number;
  text: string;
}

class LyricsOverlayClient {
  private trackTitle = document.getElementById('trackTitle')!;
  private linePrev = document.getElementById('linePrev')!;
  private lineCurrent = document.getElementById('lineCurrent')!;
  private lineNext = document.getElementById('lineNext')!;
  private karaokeProgress = document.getElementById('karaokeProgress')!;
  private btnClose = document.getElementById('btnClose')!;
  private btnPin = document.getElementById('btnPin')!;

  private lyrics: LyricLine[] = [];
  private currentIndex: number = -1;
  private isPinned: boolean = true;

  constructor() {
    this.setupListeners();
    this.listenToIPC();
  }

  private setupListeners(): void {
    this.btnClose.addEventListener('click', () => {
      window.close();
    });

    this.btnPin.addEventListener('click', () => {
      this.isPinned = !this.isPinned;
      this.btnPin.style.opacity = this.isPinned ? '1' : '0.4';
    });
  }

  private listenToIPC(): void {
    // Listen to window messages or BroadcastChannel from Bubu core
    const channel = new BroadcastChannel('bubu-lyrics-sync');
    channel.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'TRACK_UPDATE') {
        this.trackTitle.textContent = `${payload.title} - ${payload.artist}`;
      } else if (type === 'LYRICS_LOADED') {
        this.lyrics = payload.lines || [];
      } else if (type === 'POSITION_UPDATE') {
        this.updatePosition(payload.position);
      }
    };
  }

  public updatePosition(position: number): void {
    if (!this.lyrics.length) return;

    let index = -1;
    for (let i = 0; i < this.lyrics.length; i++) {
      if (this.lyrics[i].time <= position) {
        index = i;
      } else {
        break;
      }
    }

    if (index !== this.currentIndex && index >= 0) {
      this.currentIndex = index;
      this.linePrev.textContent = index > 0 ? this.lyrics[index - 1].text : '';
      this.lineCurrent.textContent = this.lyrics[index].text;
      this.lineNext.textContent = index < this.lyrics.length - 1 ? this.lyrics[index + 1].text : '';
    }

    // Update karaoke bar progress relative to line duration
    if (index >= 0 && index < this.lyrics.length - 1) {
      const lineStart = this.lyrics[index].time;
      const lineEnd = this.lyrics[index + 1].time;
      const progress = Math.min(100, Math.max(0, ((position - lineStart) / (lineEnd - lineStart)) * 100));
      this.karaokeProgress.style.width = `${progress}%`;
    }
  }
}

new LyricsOverlayClient();
