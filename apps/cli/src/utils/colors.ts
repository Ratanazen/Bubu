/**
 * ANSI Escape Codes for Terminal Colors and Styling.
 * Pure zero-dependency implementation.
 */
export const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',

  // Standard colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',

  // Bright colors
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',

  // Background colors
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
};

/**
 * Format helpers for consistent CLI presentation
 */
export const fmt = {
  success: (msg: string): string => `${colors.brightGreen}[+]${colors.reset} ${msg}`,
  error: (msg: string): string => `${colors.brightRed}[x]${colors.reset} ${msg}`,
  info: (msg: string): string => `${colors.brightCyan}ℹ${colors.reset} ${msg}`,
  warn: (msg: string): string => `${colors.brightYellow}[!]${colors.reset} ${msg}`,
  bold: (msg: string): string => `${colors.bold}${msg}${colors.reset}`,
  dim: (msg: string): string => `${colors.dim}${msg}${colors.reset}`,
  cyan: (msg: string): string => `${colors.brightCyan}${msg}${colors.reset}`,
  green: (msg: string): string => `${colors.brightGreen}${msg}${colors.reset}`,
  yellow: (msg: string): string => `${colors.brightYellow}${msg}${colors.reset}`,
  magenta: (msg: string): string => `${colors.brightMagenta}${msg}${colors.reset}`,
  gray: (msg: string): string => `${colors.gray}${msg}${colors.reset}`,
};

/**
 * Displays user-friendly error messages when the Bubu companion daemon cannot be reached.
 */
export function handleDaemonError(err: any): void {
  if (err && (err.code === 'ENOENT' || err.code === 'ECONNREFUSED')) {
    console.error(`\n${fmt.error('Bubu Desktop Companion is not running.')}`);
    console.error(`  ${fmt.dim('IPC socket is unreachable or inactive.')}`);
    console.error(`  Start Bubu with: ${colors.brightCyan}bubu start${colors.reset}\n`);
  } else if (err && (err.message === 'Timeout' || err.code === 'ETIMEDOUT')) {
    console.error(`\n${fmt.error('Connection timed out waiting for Bubu response.')}`);
    console.error(`  ${fmt.dim('The daemon may be busy or unresponsive.')}\n`);
  } else {
    console.error(`\n${fmt.error(`Failed to communicate with Bubu: ${err?.message || String(err)}`)}\n`);
  }
}
