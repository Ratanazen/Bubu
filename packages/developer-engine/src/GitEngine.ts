import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface GitStatusResult {
    branch: string;
    clean: boolean;
    modified: string[];
    untracked: string[];
}

export class GitEngine {
    public async getStatus(cwd: string): Promise<GitStatusResult> {
        try {
            const { stdout: branchOut } = await execAsync('git branch --show-current', { cwd });
            const { stdout: statusOut } = await execAsync('git status --porcelain', { cwd });
            
            const lines = statusOut.split('\n').filter(Boolean);
            const modified: string[] = [];
            const untracked: string[] = [];

            for (const line of lines) {
                const status = line.substring(0, 2);
                const file = line.substring(3).trim();
                if (status.includes('?')) {
                    untracked.push(file);
                } else {
                    modified.push(file);
                }
            }

            return {
                branch: branchOut.trim() || 'HEAD',
                clean: lines.length === 0,
                modified,
                untracked
            };
        } catch (e: any) {
            return {
                branch: 'unknown',
                clean: true,
                modified: [],
                untracked: []
            };
        }
    }

    public async getDiff(cwd: string): Promise<string> {
        try {
            const { stdout } = await execAsync('git diff', { cwd });
            return stdout;
        } catch (e: any) {
            return '';
        }
    }

    public async commit(message: string, cwd: string): Promise<{ success: boolean; output: string }> {
        try {
            await execAsync('git add .', { cwd });
            const { stdout } = await execAsync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { cwd });
            return { success: true, output: stdout };
        } catch (e: any) {
            return { success: false, output: e.message || String(e) };
        }
    }

    public async getLog(cwd: string, count: number = 5): Promise<string[]> {
        try {
            const { stdout } = await execAsync(`git log --oneline -n ${count}`, { cwd });
            return stdout.split('\n').filter(Boolean);
        } catch (e: any) {
            return [];
        }
    }
}
