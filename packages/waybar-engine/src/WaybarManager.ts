import { WaybarStatus, WaybarModuleOutput, DiagnosticResult } from '@bubu/shared-types';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import os from 'os';

export class WaybarManager {
    private statePath = path.join(os.homedir(), '.config', 'bubu', 'waybar-state.json');

    constructor() {
        const dir = path.dirname(this.statePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    public async start(): Promise<void> {
        this.updateState('bubu-online', 'Bubu', 'Bubu is online');
    }

    public async stop(): Promise<void> {
        this.updateState('bubu-offline', 'Zzz', 'Bubu is offline');
    }

    public updateState(state: WaybarStatus['moduleState'], text: string, tooltip: string): void {
        const output: WaybarModuleOutput = {
            text,
            tooltip,
            class: state
        };
        fs.writeFileSync(this.statePath, JSON.stringify(output) + '\n');
    }

    public async install(): Promise<void> {
        const waybarConfigPath = path.join(os.homedir(), '.config', 'waybar', 'config');
        if (!fs.existsSync(waybarConfigPath)) return;
        
        let configStr = fs.readFileSync(waybarConfigPath, 'utf8');
        try {
            const config = JSON.parse(configStr);
            if (!config['custom/bubu']) {
                fs.copyFileSync(waybarConfigPath, waybarConfigPath + '.bak');
                config['custom/bubu'] = {
                    "exec": `cat ${this.statePath}`,
                    "return-type": "json",
                    "interval": 1,
                    "on-click": "bubu pet show"
                };
                if (config.modules && Array.isArray(config.modules)) {
                    config.modules.push('custom/bubu');
                } else if (config['modules-right'] && Array.isArray(config['modules-right'])) {
                    config['modules-right'].unshift('custom/bubu');
                }
                fs.writeFileSync(waybarConfigPath, JSON.stringify(config, null, 2));
            }
        } catch (e) {
            console.error('Failed to inject Waybar config', e);
        }
    }

    public async doctor(): Promise<DiagnosticResult[]> {
        const results: DiagnosticResult[] = [];
        try {
            const pgrep = await new Promise<string>((resolve) => {
                exec('pgrep waybar', (err, stdout) => {
                    resolve(stdout.trim());
                });
            });
            if (pgrep) {
                results.push({ category: 'Waybar', status: 'ok', message: 'Waybar is running' });
            } else {
                results.push({ category: 'Waybar', status: 'warning', message: 'Waybar is not running' });
            }
        } catch (e) {
            results.push({ category: 'Waybar', status: 'error', message: 'Failed to check Waybar' });
        }
        return results;
    }
}
