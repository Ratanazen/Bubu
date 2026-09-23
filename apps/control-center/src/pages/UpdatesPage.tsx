import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

export default function UpdatesPage() {
    const [updateState, setUpdateState] = useState('IDLE');
    
    useEffect(() => {
        // Polling state or IPC event listener setup here
        const fetchState = async () => {
            if ((window as any).electronAPI?.getUpdateState) {
                const state = await (window as any).electronAPI.getUpdateState();
                setUpdateState(state);
            }
        };
        fetchState();
        
        if ((window as any).electronAPI?.onUpdateStateChanged) {
            (window as any).electronAPI.onUpdateStateChanged((data: any) => {
                setUpdateState(data.state);
            });
        }
    }, []);

    const checkForUpdates = async () => {
        if ((window as any).electronAPI?.checkForUpdates) {
            setUpdateState('CHECKING');
            await (window as any).electronAPI.checkForUpdates();
        }
    };

    const installUpdate = async () => {
        if ((window as any).electronAPI?.installUpdate) {
            await (window as any).electronAPI.installUpdate();
        }
    };

    return (
        <div>
            <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Download size={20} aria-hidden="true" /> Software Updates
            </h2>

            <div className="card">
                <div className="card-title" style={{ marginBottom: '12px' }}>Update Status</div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                    {updateState === 'IDLE' && <CheckCircle size={16} color="var(--primary-color)" />}
                    {updateState === 'CHECKING' && <RefreshCw size={16} color="var(--text-secondary)" className="spin" />}
                    {updateState === 'AVAILABLE' && <AlertTriangle size={16} color="#eab308" />}
                    {updateState === 'FAILED' && <AlertTriangle size={16} color="#ef4444" />}
                    
                    <span style={{ fontWeight: '500' }}>Current State: {updateState}</span>
                </div>

                <div className="quick-actions" style={{ marginTop: '15px' }}>
                    <button className="btn" onClick={checkForUpdates} disabled={updateState === 'CHECKING' || updateState === 'DOWNLOADING'}>
                        Check for Updates
                    </button>
                    {updateState === 'READY' && (
                        <button className="btn" onClick={installUpdate} style={{ background: 'var(--primary-color)' }}>
                            Install Update
                        </button>
                    )}
                </div>
            </div>

            <div className="card">
                <div className="card-title" style={{ marginBottom: '12px' }}>Configuration</div>
                <div className="status-row">
                    <span className="status-label">Update Channel</span>
                    <select style={{ width: '150px' }} defaultValue="stable">
                        <option value="stable">Stable</option>
                        <option value="beta">Beta</option>
                        <option value="nightly">Nightly</option>
                    </select>
                </div>
                <div className="status-row">
                    <span className="status-label">Check Automatically</span>
                    <div className="toggle active" />
                </div>
                <div className="status-row">
                    <span className="status-label">Allow Downgrade</span>
                    <div className="toggle" />
                </div>
            </div>
            
            <div className="card" style={{ opacity: 0.7 }}>
                <div className="card-title" style={{ marginBottom: '12px' }}>Update History</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    No recent updates found in history.
                </div>
                <div className="quick-actions" style={{ marginTop: '10px' }}>
                    <button className="btn btn-ghost" disabled>Roll Back (Unavailable)</button>
                </div>
            </div>
        </div>
    );
}
