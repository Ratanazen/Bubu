import React, { useEffect, useState } from 'react';
import { Terminal, Box, Play, Square, Settings2, ShieldCheck, ShieldAlert, Cpu, GitBranch, GitCommit, RefreshCw } from 'lucide-react';

export function DeveloperPage() {
    const [activeTab, setActiveTab] = useState<'build' | 'terminal' | 'git'>('build');
    const [toolchains, setToolchains] = useState<any[]>([]);
    const [project, setProject] = useState<any>(null);
    const [output, setOutput] = useState<string>('');
    const [runningPid, setRunningPid] = useState<number | null>(null);

    // Terminal State
    const [terminalOutput, setTerminalOutput] = useState<string>('Terminal ready.\n');
    const [terminalInput, setTerminalInput] = useState<string>('');
    const [terminalId] = useState<string>('session-1');

    // Git State
    const [gitStatus, setGitStatus] = useState<any>(null);
    const [commitMsg, setCommitMsg] = useState<string>('');
    const [gitLogs, setGitLogs] = useState<string[]>([]);

    useEffect(() => {
        const load = async () => {
            if ((window as any).developerAPI) {
                const tools = await (window as any).developerAPI.detectToolchains();
                setToolchains(tools);
                const proj = await (window as any).developerAPI.scanProject('/home/reny/Documents/Bubu');
                setProject(proj);

                // Create terminal
                await (window as any).developerAPI.createTerminal(terminalId, '/home/reny/Documents/Bubu');
                
                // Fetch git
                refreshGit();
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
            (window as any).developerAPI.onTerminalData((payload: any) => {
                setTerminalOutput(prev => prev + payload.data);
            });
        }
    }, []);

    const refreshGit = async () => {
        if ((window as any).developerAPI) {
            const status = await (window as any).developerAPI.getGitStatus('/home/reny/Documents/Bubu');
            setGitStatus(status);
            const logs = await (window as any).developerAPI.getGitLog('/home/reny/Documents/Bubu', 5);
            setGitLogs(logs);
        }
    };

    const handleCommit = async () => {
        if (!commitMsg.trim() || !(window as any).developerAPI) return;
        await (window as any).developerAPI.gitCommit(commitMsg, '/home/reny/Documents/Bubu');
        setCommitMsg('');
        refreshGit();
    };

    const sendTerminalInput = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && (window as any).developerAPI) {
            await (window as any).developerAPI.writeTerminal(terminalId, terminalInput + '\n');
            setTerminalInput('');
        }
    };

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
            <p>BUBU V6.0 Complete Lightweight Development Environment</p>

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

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                <button onClick={() => setActiveTab('build')} style={{ padding: '8px 16px', background: activeTab === 'build' ? '#333' : '#eee', color: activeTab === 'build' ? '#fff' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Build & Run
                </button>
                <button onClick={() => setActiveTab('terminal')} style={{ padding: '8px 16px', background: activeTab === 'terminal' ? '#333' : '#fff', color: activeTab === 'terminal' ? '#fff' : '#333', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>
                    Terminal
                </button>
                <button onClick={() => setActiveTab('git')} style={{ padding: '8px 16px', background: activeTab === 'git' ? '#333' : '#fff', color: activeTab === 'git' ? '#fff' : '#333', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>
                    Git Panel
                </button>
            </div>

            {activeTab === 'build' && (
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
            )}

            {activeTab === 'terminal' && (
                <div style={{ marginTop: '20px' }}>
                    <div style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '15px', borderRadius: '8px 8px 0 0', minHeight: '300px', maxHeight: '400px', overflowY: 'auto', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                        {terminalOutput}
                    </div>
                    <div style={{ display: 'flex', background: '#111', padding: '5px 10px', borderRadius: '0 0 8px 8px' }}>
                        <span style={{ color: '#4CAF50', fontFamily: 'monospace', marginRight: '5px' }}>$</span>
                        <input
                            type="text"
                            value={terminalInput}
                            onChange={(e) => setTerminalInput(e.target.value)}
                            onKeyDown={sendTerminalInput}
                            style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontFamily: 'monospace', outline: 'none' }}
                            placeholder="Type shell command..."
                        />
                    </div>
                </div>
            )}

            {activeTab === 'git' && (
                <div style={{ marginTop: '20px', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3><GitBranch size={18}/> Git Management ({gitStatus?.branch || 'HEAD'})</h3>
                        <button onClick={refreshGit} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            <RefreshCw size={14}/> Refresh
                        </button>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <h4>Status: {gitStatus?.clean ? <span style={{ color: 'green' }}>Working Tree Clean</span> : <span style={{ color: 'orange' }}>Changes Present</span>}</h4>
                        {gitStatus?.modified?.length > 0 && (
                            <div>
                                <strong>Modified:</strong>
                                <ul>{gitStatus.modified.map((f: string) => <li key={f}>{f}</li>)}</ul>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                        <input
                            type="text"
                            value={commitMsg}
                            onChange={(e) => setCommitMsg(e.target.value)}
                            placeholder="Commit message..."
                            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                        <button onClick={handleCommit} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            <GitCommit size={16}/> Commit
                        </button>
                    </div>

                    <div>
                        <h4>Recent Commits</h4>
                        <ul style={{ fontFamily: 'monospace', background: '#fff', padding: '10px', borderRadius: '4px', border: '1px solid #eee' }}>
                            {gitLogs.map((log: string, idx: number) => <li key={idx}>{log}</li>)}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

