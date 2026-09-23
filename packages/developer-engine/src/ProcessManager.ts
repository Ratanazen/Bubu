import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';

export interface ProcessState {
    pid: number;
    command: string;
    status: 'RUNNING' | 'EXITED' | 'ERROR';
    exitCode?: number | null;
}

export class ProcessManager extends EventEmitter {
    private processes: Map<number, ChildProcess> = new Map();

    public runCommand(command: string, args: string[], cwd: string): number {
        const proc = spawn(command, args, { cwd, shell: true });
        
        if (proc.pid === undefined) {
            throw new Error('Failed to start process');
        }

        const pid = proc.pid;
        this.processes.set(pid, proc);

        proc.stdout?.on('data', (data) => {
            this.emit('output', { pid, stream: 'stdout', data: data.toString() });
        });

        proc.stderr?.on('data', (data) => {
            this.emit('output', { pid, stream: 'stderr', data: data.toString() });
        });

        proc.on('close', (code) => {
            this.processes.delete(pid);
            this.emit('exit', { pid, code });
        });

        return pid;
    }

    public killProcess(pid: number) {
        const proc = this.processes.get(pid);
        if (proc) {
            proc.kill();
            this.processes.delete(pid);
        }
    }
}
