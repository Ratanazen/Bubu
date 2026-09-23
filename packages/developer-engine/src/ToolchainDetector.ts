import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface ToolchainStatus {
    tool: string;
    installed: boolean;
    version?: string;
}

export class ToolchainDetector {
    private async checkTool(command: string, versionArg: string = '--version'): Promise<ToolchainStatus> {
        try {
            const { stdout } = await execAsync(`${command} ${versionArg}`);
            return {
                tool: command,
                installed: true,
                version: stdout.split('\n')[0].trim()
            };
        } catch {
            return {
                tool: command,
                installed: false
            };
        }
    }

    public async detectAll(): Promise<ToolchainStatus[]> {
        const tools = ['gcc', 'g++', 'clang', 'cmake', 'make', 'python3', 'node', 'npm', 'git', 'rustc', 'cargo', 'go', 'java'];
        const results = await Promise.all(tools.map(t => this.checkTool(t)));
        return results;
    }
}
