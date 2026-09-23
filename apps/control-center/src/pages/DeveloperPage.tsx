import React, { useEffect, useState } from 'react';
import { Terminal, Box, Play, Square, Settings2, ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';

export function DeveloperPage() {
    const [toolchains, setToolchains] = useState<any[]>([]);
    const [project, setProject] = useState<any>(null);
    const [output, setOutput] = useState<string>('');
    const [runningPid, setRunningPid] = useState<number | null>(null);

    useEffect(() => {
        const load = async () => {
            if ((window as any).developerAPI) {
                const tools = await (window as any).developerAPI.detectToolchains();
                setToolchains(tools);
                const proj = await (window as any).developerAPI.scanProject('/home/reny/Documents/Bubu');
                setProject(proj);
            }
        };
        load();

        if ((window as any).developerAPI) {
            (window as any).developerAPI.onProcessOutput((payload: any) => {
                setOutput(prev => prev + payload.data);
            });
            (window as any).developerAPI.onProcessExit((payload: any) => {
                setOutput(prev => prev + `\n[Process Exited with code ${payload.code}]\n`);
                setRunningPid(null);
            });
        }
    }, []);

    const runBuild = async () => {
        if (!project || !(window as any).developerAPI) return;
        setOutput('--- BUILD STARTED ---\n');
        let cmd = 'npm';
        let args = ['run', 'build'];
        if (project.buildSystem === 'cmake') { cmd = 'make'; args = []; }
        else if (project.buildSystem === 'cargo') { cmd = 'cargo'; args = ['build']; }
        
        const pid = await (window as any).developerAPI.runProcess(cmd, args, project.path);
        setRunningPid(pid);
    };

    const stopBuild = async () => {
        if (runningPid && (window as any).developerAPI) {
            await (window as any).developerAPI.killProcess(runningPid);
            setRunningPid(null);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', color: '#333' }}>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Cpu size={28}/> Developer App Panel</h1>
            <p>Lightweight Development Environment</p>

            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <div style={{ flex: 1, background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
                    <h3><Box size={18}/> Detected Project</h3>
                    {project ? (
                        <div>
                            <strong>Name:</strong> {project.name} <br/>
                            <strong>Type:</strong> {project.type} <br/>
                            <strong>Build System:</strong> {project.buildSystem} <br/>
                            <strong>Path:</strong> <small>{project.path}</small>
                        </div>
                    ) : <p>Scanning...</p>}
                </div>

                <div style={{ flex: 1, background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
                    <h3><Settings2 size={18}/> Toolchains</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {toolchains.map(t => (
                            <div key={t.tool} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {t.installed ? <ShieldCheck size={16} color="green"/> : <ShieldAlert size={16} color="red"/>}
                                {t.tool} {t.version && <small style={{ color: 'gray' }}>v{t.version.split(' ')[2] || t.version.split('.')[0]}</small>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <button onClick={runBuild} disabled={runningPid !== null} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: runningPid ? 'not-allowed' : 'pointer' }}>
                        <Play size={16} /> Build & Run
                    </button>
                    <button onClick={stopBuild} disabled={runningPid === null} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', background: '#F44336', color: 'white', border: 'none', borderRadius: '4px', cursor: runningPid ? 'pointer' : 'not-allowed' }}>
                        <Square size={16} /> Stop
                    </button>
                </div>
                
                <div style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '15px', borderRadius: '8px', minHeight: '300px', maxHeight: '400px', overflowY: 'auto', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '10px', color: '#888' }}>
                        <Terminal size={16}/> Build Output
                    </div>
                    {output || 'Waiting for build...'}
                </div>
            </div>
        </div>
    );
}
