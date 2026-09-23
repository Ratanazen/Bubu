import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

/**
 * Supported browser targets for native messaging host registration.
 */
export type SupportedBrowser = 'chrome' | 'chromium' | 'brave' | 'edge' | 'firefox';

/**
 * Manifest format for Chromium-based browsers (Chrome, Chromium, Brave, Edge).
 */
export interface ChromeNativeMessagingManifest {
  name: string;
  description: string;
  path: string;
  type: 'stdio';
  allowed_origins: string[];
}

/**
 * Manifest format for Mozilla Firefox.
 */
export interface FirefoxNativeMessagingManifest {
  name: string;
  description: string;
  path: string;
  type: 'stdio';
  allowed_extensions: string[];
}

export type NativeMessagingManifest =
  | ChromeNativeMessagingManifest
  | FirefoxNativeMessagingManifest;

export interface NativeMessagingOptions {
  hostName?: string;
  description?: string;
  allowedOrigins?: string[];
  allowedExtensions?: string[];
}

/**
 * Utility helper to manage installation, generation, and removal of
 * browser Native Messaging host manifests across multiple operating systems.
 */
export class NativeMessaging {
  public static readonly DEFAULT_HOST_NAME = 'com.bubu.desktop.companion';
  public static readonly DEFAULT_DESCRIPTION =
    'Bubu Desktop Companion Native Messaging Host';

  /**
   * Generates the native messaging host manifest object for the given executable path and browser.
   */
  public static generateManifest(
    executablePath: string,
    browser: SupportedBrowser = 'chrome',
    allowedIdentifiers?: string[]
  ): NativeMessagingManifest {
    const hostName = this.DEFAULT_HOST_NAME;
    const description = this.DEFAULT_DESCRIPTION;
    const resolvedPath = path.resolve(executablePath);

    if (browser === 'firefox') {
      const allowed_extensions = allowedIdentifiers && allowedIdentifiers.length > 0
        ? allowedIdentifiers
        : ['bubu-companion@bubu.desktop'];

      return {
        name: hostName,
        description,
        path: resolvedPath,
        type: 'stdio',
        allowed_extensions,
      };
    }

    const allowed_origins = allowedIdentifiers && allowedIdentifiers.length > 0
      ? allowedIdentifiers
      : [
          'chrome-extension://knldjmfmopnpolahpmmgbagdohdnhkik/', // Example extension ID
          'chrome-extension://*/*',
        ];

    return {
      name: hostName,
      description,
      path: resolvedPath,
      type: 'stdio',
      allowed_origins,
    };
  }

  /**
   * Computes the target filesystem destination path for the native messaging manifest
   * based on the browser and current operating system.
   */
  public static getInstallPath(browser: SupportedBrowser): string {
    const platform = process.platform;
    const home = os.homedir();
    const manifestFile = `${this.DEFAULT_HOST_NAME}.json`;

    if (platform === 'linux') {
      switch (browser) {
        case 'chrome':
          return path.join(home, '.config', 'google-chrome', 'NativeMessagingHosts', manifestFile);
        case 'chromium':
          return path.join(home, '.config', 'chromium', 'NativeMessagingHosts', manifestFile);
        case 'brave':
          return path.join(
            home,
            '.config',
            'BraveSoftware',
            'Brave-Browser',
            'NativeMessagingHosts',
            manifestFile
          );
        case 'edge':
          return path.join(home, '.config', 'microsoft-edge', 'NativeMessagingHosts', manifestFile);
        case 'firefox':
          return path.join(home, '.mozilla', 'native-messaging-hosts', manifestFile);
      }
    } else if (platform === 'darwin') {
      const appSupport = path.join(home, 'Library', 'Application Support');
      switch (browser) {
        case 'chrome':
          return path.join(appSupport, 'Google', 'Chrome', 'NativeMessagingHosts', manifestFile);
        case 'chromium':
          return path.join(appSupport, 'Chromium', 'NativeMessagingHosts', manifestFile);
        case 'brave':
          return path.join(
            appSupport,
            'BraveSoftware',
            'Brave-Browser',
            'NativeMessagingHosts',
            manifestFile
          );
        case 'edge':
          return path.join(appSupport, 'Microsoft Edge', 'NativeMessagingHosts', manifestFile);
        case 'firefox':
          return path.join(appSupport, 'Mozilla', 'NativeMessagingHosts', manifestFile);
      }
    } else if (platform === 'win32') {
      const localAppData =
        process.env.LOCALAPPDATA || path.join(home, 'AppData', 'Local');
      switch (browser) {
        case 'chrome':
          return path.join(
            localAppData,
            'Google',
            'Chrome',
            'User Data',
            'NativeMessagingHosts',
            manifestFile
          );
        case 'chromium':
          return path.join(
            localAppData,
            'Chromium',
            'User Data',
            'NativeMessagingHosts',
            manifestFile
          );
        case 'brave':
          return path.join(
            localAppData,
            'BraveSoftware',
            'Brave-Browser',
            'User Data',
            'NativeMessagingHosts',
            manifestFile
          );
        case 'edge':
          return path.join(
            localAppData,
            'Microsoft',
            'Edge',
            'User Data',
            'NativeMessagingHosts',
            manifestFile
          );
        case 'firefox':
          return path.join(localAppData, 'Mozilla', 'NativeMessagingHosts', manifestFile);
      }
    }

    // Fallback path
    return path.join(home, '.config', 'bubu', 'NativeMessagingHosts', manifestFile);
  }

  /**
   * Installs the native messaging host manifest for the specified browser.
   * Creates parent directories if necessary and writes the JSON configuration.
   *
   * @param browser Target browser type.
   * @param executablePath Absolute path to the host binary / launcher script.
   * @param allowedIdentifiers Optional list of extension IDs or origins.
   * @returns Promise resolving to the absolute path of the installed manifest.
   */
  public static async install(
    browser: SupportedBrowser,
    executablePath: string,
    allowedIdentifiers?: string[]
  ): Promise<string> {
    const installPath = this.getInstallPath(browser);
    const manifest = this.generateManifest(executablePath, browser, allowedIdentifiers);

    await fs.promises.mkdir(path.dirname(installPath), { recursive: true });
    await fs.promises.writeFile(
      installPath,
      JSON.stringify(manifest, null, 2),
      'utf8'
    );

    return installPath;
  }

  /**
   * Uninstalls the native messaging host manifest for the specified browser.
   *
   * @param browser Target browser type.
   * @returns Promise resolving to true if file was uninstalled, or false if not found.
   */
  public static async uninstall(browser: SupportedBrowser): Promise<boolean> {
    const installPath = this.getInstallPath(browser);

    try {
      await fs.promises.unlink(installPath);
      return true;
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === 'ENOENT') {
        return false;
      }
      throw err;
    }
  }
}
