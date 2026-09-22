import { sendCommand } from '../ipc-client';
import { fmt, handleDaemonError, colors } from '../utils/colors';

/**
 * Format seconds into mm:ss format.
 */
function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Handles 'bubu music' subcommands: status, play, pause, next, previous.
 */
export async function musicCommand(args: string[]): Promise<void> {
  const action = args[0]?.toLowerCase();

  switch (action) {
    case 'status': {
      try {
        const res = await sendCommand('music:status', { action: 'status' });
        console.log(`\n${fmt.bold(fmt.cyan('🎵 Bubu Music Integration'))}`);
        console.log(`───────────────────────────────────────`);

        if (res && typeof res === 'object' && res.title) {
          const stateStr =
            res.state === 'playing'
              ? `${colors.brightGreen}▶ Playing${colors.reset}`
              : res.state === 'paused'
              ? `${colors.brightYellow}⏸ Paused${colors.reset}`
              : `${colors.gray}⏹ Stopped${colors.reset}`;

          console.log(`  ${fmt.bold('Status:')}    ${stateStr}`);
          console.log(`  ${fmt.bold('Title:')}     ${fmt.bold(res.title)}`);
          console.log(`  ${fmt.bold('Artist:')}    ${res.artist || 'Unknown'}`);
          if (res.album) {
            console.log(`  ${fmt.bold('Album:')}     ${res.album}`);
          }

          if (res.duration && res.duration > 0) {
            const pos = res.position || 0;
            const dur = res.duration;
            const percentage = Math.min(100, Math.max(0, Math.round((pos / dur) * 100)));
            const barLength = 22;
            const filled = Math.round((barLength * percentage) / 100);
            const progressBar = `${colors.brightCyan}${'━'.repeat(filled)}${colors.reset}${colors.gray}${'─'.repeat(Math.max(0, barLength - filled))}${colors.reset}`;
            console.log(`  ${fmt.bold('Progress:')} [${progressBar}] ${formatTime(pos)} / ${formatTime(dur)} (${percentage}%)`);
          }
        } else {
          console.log(`  ${fmt.dim('No active music playback detected.')}`);
        }
        console.log('');
      } catch (err) {
        handleDaemonError(err);
        process.exitCode = 1;
      }
      break;
    }

    case 'play': {
      try {
        await sendCommand('music:play', { action: 'play' });
        console.log(fmt.success('Resumed music playback.'));
      } catch (err) {
        handleDaemonError(err);
        process.exitCode = 1;
      }
      break;
    }

    case 'pause': {
      try {
        await sendCommand('music:pause', { action: 'pause' });
        console.log(fmt.success('Paused music playback.'));
      } catch (err) {
        handleDaemonError(err);
        process.exitCode = 1;
      }
      break;
    }

    case 'next': {
      try {
        await sendCommand('music:next', { action: 'next' });
        console.log(fmt.success('Skipped to next track.'));
      } catch (err) {
        handleDaemonError(err);
        process.exitCode = 1;
      }
      break;
    }

    case 'previous':
    case 'prev': {
      try {
        await sendCommand('music:previous', { action: 'previous' });
        console.log(fmt.success('Returned to previous track.'));
      } catch (err) {
        handleDaemonError(err);
        process.exitCode = 1;
      }
      break;
    }

    default: {
      if (action) {
        console.error(fmt.error(`Unknown music action: '${action}'`));
      } else {
        console.error(fmt.error('Music action required.'));
      }
      console.error(`\n${fmt.bold('Usage:')}`);
      console.error(`  ${colors.brightCyan}bubu music status${colors.reset}    - Display current playback information`);
      console.error(`  ${colors.brightCyan}bubu music play${colors.reset}      - Resume playback`);
      console.error(`  ${colors.brightCyan}bubu music pause${colors.reset}     - Pause playback`);
      console.error(`  ${colors.brightCyan}bubu music next${colors.reset}      - Skip to next track`);
      console.error(`  ${colors.brightCyan}bubu music previous${colors.reset}  - Jump to previous track\n`);
      process.exitCode = 1;
      break;
    }
  }
}
