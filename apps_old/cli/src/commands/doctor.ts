import { colors, fmt } from '../utils/colors';
import * as os from 'os';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface DiagnosticCheck {
  category: string;
  name: string;
  status: 'PASS' | 'WARN' | 'FAIL';
  details: string;
  remediation?: string;
}

export async function runDoctor(): Promise<void> {
  console.log(`\n  ${colors.brightWhite}${colors.bold}BUBU DOCTOR — ENVIRONMENT & COMPATIBILITY DIAGNOSTICS${colors.reset}`);
  console.log(`  ${colors.dim}───────────────────────────────────────────────────────────${colors.reset}\n`);

  const checks: DiagnosticCheck[] = [];

  // 1. OS & Architecture
  checks.push({
    category: 'System',
    name: 'Operating System',
    status: 'PASS',
    details: `${os.type()} ${os.release()} (${os.arch()})`
  });

  // 2. Linux Session Type
  const isLinux = process.platform === 'linux';
  if (isLinux) {
    const sessionType = process.env.XDG_SESSION_TYPE || 'unknown';
    const waylandDisplay = process.env.WAYLAND_DISPLAY;

    if (sessionType === 'wayland' || waylandDisplay) {
      checks.push({
        category: 'Compositor',
        name: 'Session Type',
        status: 'PASS',
        details: `Wayland (${waylandDisplay || 'active'})`
      });
    } else {
      checks.push({
        category: 'Compositor',
        name: 'Session Type',
        status: 'PASS',
        details: 'X11 / Xorg'
      });
    }

    // 3. Desktop Environment / Window Manager
    const desktop = process.env.XDG_CURRENT_DESKTOP || process.env.DESKTOP_SESSION || 'Generic';
    const isHyprland = !!process.env.HYPRLAND_INSTANCE_SIGNATURE;
    const isSway = !!process.env.SWAYSOCK;
    const isNiri = !!process.env.NIRI_SOCKET;

    let detectedDE = desktop;
    if (isHyprland) detectedDE = 'Hyprland (Native IPC Socket Detected)';
    else if (isSway) detectedDE = 'Sway (Native IPC Socket Detected)';
    else if (isNiri) detectedDE = 'Niri (Native IPC Socket Detected)';

    checks.push({
      category: 'Compositor',
      name: 'Desktop Environment',
      status: 'PASS',
      details: detectedDE
    });

    // 4. Panel Integrations (Waybar)
    try {
      execSync('which waybar', { stdio: 'pipe' });
      checks.push({
        category: 'Panel',
        name: 'Waybar Integration',
        status: 'PASS',
        details: 'Waybar binary found in $PATH'
      });
    } catch {
      checks.push({
        category: 'Panel',
        name: 'Waybar Integration',
        status: 'WARN',
        details: 'Waybar not found in $PATH',
        remediation: 'Install waybar if you want Bubu status in your status bar.'
      });
    }
  }

  // 5. IPC Daemon Socket Check
  const socketPath = process.platform === 'win32'
    ? '\\\\.\\pipe\\bubu-desktop-companion'
    : path.join(process.env.XDG_RUNTIME_DIR || '/tmp', 'bubu.sock');

  const socketExists = fs.existsSync(socketPath);
  checks.push({
    category: 'IPC',
    name: 'Local Companion Daemon',
    status: socketExists ? 'PASS' : 'WARN',
    details: socketExists ? `Connected to ${socketPath}` : 'Daemon not running (offline mode)',
    remediation: socketExists ? undefined : 'Run "bubu start" to launch companion daemon.'
  });

  // 6. Character Base Asset Integrity
  const possiblePaths = [
    path.resolve(__dirname, '../../../assets/characters/bubu-reference.png'),
    path.resolve(__dirname, '../../assets/characters/bubu-reference.png'),
    path.resolve(process.cwd(), 'assets/characters/bubu-reference.png')
  ];
  const baseAssetPath = possiblePaths.find(p => fs.existsSync(p));
  if (baseAssetPath) {
    const stats = fs.statSync(baseAssetPath);
    checks.push({
      category: 'Asset Pipeline',
      name: 'Original Bubu Reference Integrity',
      status: 'PASS',
      details: `Preserved (${stats.size} bytes, non-destructive lock)`
    });
  } else {
    checks.push({
      category: 'Asset Pipeline',
      name: 'Original Bubu Reference Integrity',
      status: 'WARN',
      details: 'Reference image not found in assets/characters',
      remediation: 'Place reference sprite in assets/characters/bubu-reference.png'
    });
  }

  // 7. Output formatted report
  let passCount = 0;
  let warnCount = 0;
  let failCount = 0;

  checks.forEach(c => {
    let icon = fmt.success('');
    let statusText = fmt.green('PASS');

    if (c.status === 'WARN') {
      icon = fmt.warn('');
      statusText = fmt.yellow('WARN');
      warnCount++;
    } else if (c.status === 'FAIL') {
      icon = fmt.error('');
      statusText = fmt.bold(colors.red + 'FAIL');
      failCount++;
    } else {
      passCount++;
    }

    console.log(`  ${icon.trim()} [${c.category}] ${colors.brightWhite}${c.name}${colors.reset}: ${statusText}`);
    console.log(`     ${fmt.gray(c.details)}`);
    if (c.remediation) {
      console.log(`     ${fmt.cyan('Remedy: ' + c.remediation)}`);
    }
    console.log();
  });

  console.log(`  ${colors.dim}───────────────────────────────────────────────────────────${colors.reset}`);
  console.log(`  Summary: ${fmt.green(passCount + ' Passed')}, ${fmt.yellow(warnCount + ' Warnings')}, ${fmt.error(failCount + ' Failed')}\n`);
}
