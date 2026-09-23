import { LyricLine } from './types';

/**
 * Result of parsing an LRC document with lyrics lines and metadata tags.
 */
export interface ParsedLrc {
  lines: LyricLine[];
  metadata: Record<string, string>;
}

/**
 * High-performance, robust parser for standard and extended LRC (Lyric) format strings.
 */
export class LrcParser {
  // Matches timestamps like [mm:ss.xx], [mm:ss.xxx], [mm:ss], [hh:mm:ss.xx]
  private static readonly TIMESTAMP_REGEX =
    /\[(?:(\d+):)?(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g;

  // Matches metadata tags like [ti: Title], [ar: Artist], [al: Album], [offset: +/-ms]
  private static readonly METADATA_TAG_REGEX =
    /^\[([a-zA-Z]+)\s*:\s*([^\]]*)\]$/;

  /**
   * Parses an LRC format string into a sorted array of LyricLine objects.
   */
  public static parse(lrcContent: string): LyricLine[] {
    const result = this.parseWithMetadata(lrcContent);
    return result.lines;
  }

  /**
   * Parses an LRC format string into lines and metadata dictionary.
   */
  public static parseWithMetadata(lrcContent: string): ParsedLrc {
    if (!lrcContent || typeof lrcContent !== 'string') {
      return { lines: [], metadata: {} };
    }

    const lines: LyricLine[] = [];
    const metadata: Record<string, string> = {};
    const rawLines = lrcContent.split(/\r?\n/);

    // First pass: extract metadata tags and raw timestamped lines
    for (const rawLine of rawLines) {
      const trimmed = rawLine.trim();
      if (!trimmed) {
        continue;
      }

      // Check for metadata tag [key: value]
      const metaMatch = trimmed.match(this.METADATA_TAG_REGEX);
      if (metaMatch) {
        const key = metaMatch[1].toLowerCase();
        const value = metaMatch[2].trim();
        metadata[key] = value;
        continue;
      }

      // Find all timestamp tags in the line
      const timestampMatches = [...trimmed.matchAll(this.TIMESTAMP_REGEX)];
      if (timestampMatches.length === 0) {
        continue;
      }

      // Extract remaining text after removing all timestamp tags
      const text = trimmed.replace(this.TIMESTAMP_REGEX, '').trim();

      // LRC allows multiple timestamps for repeating phrases, e.g. [00:12.00][00:34.00]Chorus
      for (const match of timestampMatches) {
        const timeInSeconds = this.parseTimestampMatch(match);
        if (timeInSeconds !== null && !isNaN(timeInSeconds)) {
          lines.push({
            time: timeInSeconds,
            text,
          });
        }
      }
    }

    // Apply global [offset:+/-ms] if present
    const globalOffsetMs = metadata['offset'] ? parseFloat(metadata['offset']) : 0;
    const globalOffsetSec = isNaN(globalOffsetMs) ? 0 : globalOffsetMs / 1000;

    if (globalOffsetSec !== 0) {
      for (const line of lines) {
        line.time = Math.max(0, Number((line.time + globalOffsetSec).toFixed(3)));
      }
    }

    // Sort chronologically by timestamp
    lines.sort((a, b) => a.time - b.time);

    // Compute line durations
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].duration === undefined) {
        if (i < lines.length - 1) {
          const diff = Number((lines[i + 1].time - lines[i].time).toFixed(3));
          lines[i].duration = Math.max(0, diff);
        } else {
          // Default duration for the last line if unknown
          lines[i].duration = 5;
        }
      }
    }

    return { lines, metadata };
  }

  /**
   * Converts seconds into formatted LRC timestamp [mm:ss.xx].
   */
  public static formatTimestamp(seconds: number): string {
    const safeSec = Math.max(0, seconds);
    const mins = Math.floor(safeSec / 60);
    const remainingSec = (safeSec % 60).toFixed(2);
    const paddedMins = String(mins).padStart(2, '0');
    const [secPart, fracPart = '00'] = remainingSec.split('.');
    const paddedSec = String(secPart).padStart(2, '0');
    return `[${paddedMins}:${paddedSec}.${fracPart.padEnd(2, '0').slice(0, 2)}]`;
  }

  /**
   * Serializes an array of LyricLines and optional metadata back into LRC text.
   */
  public static stringify(lines: LyricLine[], metadata?: Record<string, string>): string {
    const parts: string[] = [];

    if (metadata) {
      for (const [key, value] of Object.entries(metadata)) {
        if (value) {
          parts.push(`[${key}:${value}]`);
        }
      }
    }

    const sorted = [...lines].sort((a, b) => a.time - b.time);
    for (const line of sorted) {
      parts.push(`${this.formatTimestamp(line.time)}${line.text ? ' ' + line.text : ''}`);
    }

    return parts.join('\n');
  }

  private static parseTimestampMatch(match: RegExpMatchArray): number | null {
    // match: [full, hours?, minutes, seconds, fractions?]
    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const minutes = parseInt(match[2], 10);
    const seconds = parseInt(match[3], 10);
    const fracStr = match[4] || '';

    let fraction = 0;
    if (fracStr.length === 1) {
      fraction = parseInt(fracStr, 10) / 10;
    } else if (fracStr.length === 2) {
      fraction = parseInt(fracStr, 10) / 100;
    } else if (fracStr.length >= 3) {
      fraction = parseInt(fracStr.slice(0, 3), 10) / 1000;
    }

    const totalSeconds = hours * 3600 + minutes * 60 + seconds + fraction;
    return Number(totalSeconds.toFixed(3));
  }
}
