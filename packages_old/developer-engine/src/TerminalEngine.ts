import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';

export class TerminalEngine extends EventEmitter {
    private sessions: Map<string, ChildProcess> = new Map();

    public createSession(id: string, cwd: string, shell: string = process.platform === 'win32' ? 'powershell.exe' : '/bin/bash'): string {
        const proc = spawn(shell, ['-i'], {
            cwd,
            env: { ...process.env, TERM: 'xterm-256color' },
            shell: false
        });

        this.sessions.set(id, proc);

        proc.stdout?.on('data', (data) => {
            this.emit('data', { id, data: data.toString() });
        });

        proc.stderr?.on('data', (data) => {
            this.emit('data', { id, data: data.toString() });
        });

        proc.on('close', (code) => {
            this.sessions.delete(id);
            this.emit('exit', { id, code });
        });

        return id;
    }

    public write(id: string, data: string): boolean {
        const proc = this.sessions.get(id);
        if (proc && proc.stdin && proc.stdin.writable) {
            proc.stdin.write(data);
            return true;
        }
        return false;
    }

    public kill(id: string): boolean {
        const proc = this.sessions.get(id);
        if (proc) {
            proc.kill();
            this.sessions.delete(id);
            return true;
        }
        return false;
    }
}
