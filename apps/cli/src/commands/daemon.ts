import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import { sendCommand, getSocketPath } from '../ipc-client';
import { fmt, handleDaemonError, colors } from '../utils/colors';

/**
 * Checks if Bubu daemon is currently reachable via IPC socket.
 */
async function isRunning(): Promise<boolean> {
  try {
    await sendCommand('status');
    return true;
  } catch {
    return false;
  }
}

/**
 * Locates the Bubu executable on the system.
 */
function findExecutable(): string | null {
  const candidates = [
    // Unpacked build in monorepo
    '/home/reny/Documents/Bubu/release/linux-unpacked/bubu-desktop-pet',
    path.join(__dirname, '../../../release/linux-unpacked/bubu-desktop-pet'),
    // System installations
    '/usr/local/bin/bubu-desktop-pet',
    '/usr/bin/bubu-desktop-pet',
    '/opt/Bubu/bubu-desktop-pet',
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

/**
 * Handles 'bubu start': Starts the Bubu Desktop Companion if not running.
 */
export async function startCommand(): Promise<void> {
  if (await isRunning()) {
    console.log(fmt.info('Bubu Desktop Companion is already running.'));
    return;
  }

  console.log(fmt.info('Starting Bubu Desktop Companion...'));

  const exePath = findExecutable();
  if (exePath) {
    try {
      const child = spawn(exePath, [], {
        detached: true,
        stdio: 'ignore',
      });
      child.unref();

      // Wait up to 3 seconds for the socket to appear
      let started = false;
      for (let i = 0; i < 6; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (await isRunning()) {
          started = true;
          break;
        }
      }

      if (started) {
        console.log(fmt.success('Bubu Desktop Companion started successfully!'));
      } else {
        console.log(fmt.success('Bubu launch process initiated.'));
        console.log(`  Check status anytime with: ${colors.brightCyan}bubu status${colors.reset}`);
      }
      return;
    } catch (err: any) {
      console.error(fmt.error(`Failed to launch Bubu executable: ${err?.message || err}`));
      process.exitCode = 1;
      return;
    }
  }

  // If binary not found, look for npm project root
  const rootDir = '/home/reny/Documents/Bubu';
  if (fs.existsSync(path.join(rootDir, 'package.json'))) {
    try {
      const child = spawn('npm', ['run', 'dev', '--workspace=@bubu/desktop-pet'], {
        cwd: rootDir,
        detached: true,
        stdio: 'ignore',
      });
      child.unref();
      console.log(fmt.success('Launched Bubu via development workspace.'));
      console.log(`  Check status anytime with: ${colors.brightCyan}bubu status${colors.reset}`);
      return;
    } catch (err: any) {
      console.error(fmt.error(`Failed to launch Bubu: ${err?.message || err}`));
      process.exitCode = 1;
      return;
    }
  }

  console.error(fmt.error('Bubu executable not found.'));
  console.error(`  Please ensure Bubu Desktop Companion is installed or built.`);
  process.exitCode = 1;
}

/**
 * Handles 'bubu stop': Stops the running Bubu companion.
 */
export async function stopCommand(): Promise<void> {
  try {
    await sendCommand('stop');
    console.log(fmt.success('Bubu Desktop Companion has been stopped.'));
  } catch (err: any) {
    if (err && (err.code === 'ENOENT' || err.code === 'ECONNREFUSED')) {
      console.log(fmt.info('Bubu Desktop Companion is not currently running.'));
    } else {
      handleDaemonError(err);
      process.exitCode = 1;
    }
  }
}

/**
 * Handles 'bubu restart': Restarts the Bubu companion.
 */
export async function restartCommand(): Promise<void> {
  console.log(fmt.info('Restarting Bubu Desktop Companion...'));
  try {
    await sendCommand('stop');
  } catch {
    // Ignore error if was not running
  }

  // Brief pause to allow process cleanup
  await new Promise(resolve => setTimeout(resolve, 1000));
  await startCommand();
}

/**
 * Handles 'bubu status': Displays comprehensive companion status.
 */
export async function statusCommand(): Promise<void> {
  try {
    const status = await sendCommand('status');
    const socketPath = getSocketPath();

    console.log(`\n${fmt.bold(fmt.cyan('🐾 Bubu Desktop Companion Status'))}`);
    console.log(`──────────────────────────────────────────────────`);
    console.log(`  ${fmt.bold('Daemon:')}         ${colors.brightGreen}● Running${colors.reset} ${fmt.dim(`(${socketPath})`)}`);

    if (status && typeof status === 'object') {
      const pet = status.pet || {};
      const music = status.music || {};
      const lyrics = status.lyrics || {};
      const browser = status.browser || {};
      const skin = status.settings?.skin || status.skin || 'default';

      const petVisibility = pet.visible !== false ? fmt.green('Visible') : fmt.dim('Hidden');
      const petState = pet.paused ? fmt.yellow('Paused') : fmt.cyan(pet.state || 'Idle');
      const petPos = pet.x !== undefined && pet.y !== undefined ? `(${pet.x}, ${pet.y})` : 'Desktop';
      console.log(`  ${fmt.bold('Pet:')}            ${petVisibility} | State: ${petState} | Position: ${petPos}`);

      console.log(`  ${fmt.bold('Skin:')}           ${fmt.yellow(skin)}`);

      if (music.title) {
        const musicState = music.state === 'playing' ? fmt.green('▶ Playing') : fmt.yellow('⏸ Paused');
        const artist = music.artist ? ` by ${music.artist}` : '';
        console.log(`  ${fmt.bold('Music:')}          ${musicState} - ${fmt.bold(music.title)}${artist}`);
      } else {
        console.log(`  ${fmt.bold('Music:')}          ${fmt.dim('Not Playing')}`);
      }

      console.log(`  ${fmt.bold('Lyrics:')}         ${lyrics.available ? fmt.green('Available') : fmt.dim('Unavailable')}`);

      const browserStatus = browser.connected
        ? fmt.green(`Connected (${browser.browserName || 'Active'})`)
        : fmt.dim('Disconnected');
      console.log(`  ${fmt.bold('Browser:')}        ${browserStatus}`);
    }

    console.log('');
  } catch (err: any) {
    console.log(`\n${fmt.bold(fmt.cyan('🐾 Bubu Desktop Companion Status'))}`);
    console.log(`──────────────────────────────────────────────────`);
    console.log(`  ${fmt.bold('Daemon:')}         ${colors.brightRed}○ Offline${colors.reset}\n`);
    handleDaemonError(err);
    process.exitCode = 1;
  }
}
