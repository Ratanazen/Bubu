import { LyricLine } from './types';

/**
 * Item representing a visible line in a lyrics viewer component.
 */
export interface VisibleLyricLine {
  line: LyricLine;
  isCurrent: boolean;
}

/**
 * Synchronizes playback position with timestamped lyric lines.
 * Computes active line indices, windowed visible lines, and applies temporal offsets.
 */
export class LyricsSynchronizer {
  private lines: LyricLine[] = [];
  private offset: number = 0; // offset in seconds

  constructor(lines: LyricLine[] = [], initialOffsetSec: number = 0) {
    this.setLines(lines);
    this.offset = initialOffsetSec;
  }

  /**
   * Sets the lyric lines to synchronize. Automatically keeps lines sorted.
   */
  public setLines(lines: LyricLine[]): void {
    this.lines = [...lines].sort((a, b) => a.time - b.time);
  }

  /**
   * Gets the current array of lyric lines.
   */
  public getLines(): LyricLine[] {
    return [...this.lines];
  }

  /**
   * Sets global synchronization offset in seconds.
   * Positive value advances lyrics earlier; negative value delays lyrics.
   */
  public setOffset(offsetSec: number): void {
    this.offset = offsetSec;
  }

  /**
   * Gets current global synchronization offset in seconds.
   */
  public getOffset(): number {
    return this.offset;
  }

  /**
   * Finds the 0-based index of the currently active lyric line for the given playback position.
   * Returns -1 if playback has not yet reached the first lyric line or if no lines are loaded.
   *
   * @param position Playback position in seconds.
   * @param offset Optional override offset in seconds.
   */
  public getCurrentLineIndex(position: number, offset?: number): number {
    if (this.lines.length === 0) {
      return -1;
    }

    const effectiveOffset = offset !== undefined ? offset : this.offset;
    const effectivePos = position + effectiveOffset;

    if (effectivePos < this.lines[0].time) {
      return -1;
    }

    // Binary search for highest line.time <= effectivePos
    let low = 0;
    let high = this.lines.length - 1;
    let result = -1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (this.lines[mid].time <= effectivePos) {
        result = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return result;
  }

  /**
   * Gets the currently active LyricLine object, or null if before the first line or empty.
   */
  public getCurrentLine(position: number, offset?: number): LyricLine | null {
    const index = this.getCurrentLineIndex(position, offset);
    return index >= 0 ? this.lines[index] : null;
  }

  /**
   * Returns a window of visible lines centered around the current line for UI display.
   *
   * @param position Current playback position in seconds.
   * @param count Total number of lines to return in the window (defaults to 5).
   */
  public getVisibleLines(
    position: number,
    count: number = 5
  ): VisibleLyricLine[] {
    if (this.lines.length === 0) {
      return [];
    }

    const windowSize = Math.max(1, count);
    const currentIndex = this.getCurrentLineIndex(position);

    let startIndex = 0;
    if (currentIndex >= 0) {
      const halfWindow = Math.floor(windowSize / 2);
      startIndex = Math.max(0, currentIndex - halfWindow);

      // Keep window anchored at the end if near the bottom
      if (startIndex + windowSize > this.lines.length) {
        startIndex = Math.max(0, this.lines.length - windowSize);
      }
    }

    const endIndex = Math.min(this.lines.length, startIndex + windowSize);
    const result: VisibleLyricLine[] = [];

    for (let i = startIndex; i < endIndex; i++) {
      result.push({
        line: this.lines[i],
        isCurrent: i === currentIndex,
      });
    }

    return result;
  }
}
