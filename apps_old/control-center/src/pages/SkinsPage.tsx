import React from 'react';
import { Shirt, Plus, Upload, Download } from 'lucide-react';
import { PetIcon } from '../components/Icons';

const styles = [
    { id: 'cute', name: 'Cute', color: '#ffb7b2' },
    { id: 'kawaii', name: 'Kawaii', color: '#ffc8dd' },
    { id: 'pastel', name: 'Pastel', color: '#bde0fe' },
    { id: 'sakura', name: 'Sakura', color: '#ffafcc' },
    { id: 'night', name: 'Night', color: '#4a4e69' },
    { id: 'cyber', name: 'Cyber', color: '#7209b7' },
    { id: 'neon', name: 'Neon', color: '#06d6a0' },
    { id: 'pixel', name: 'Pixel', color: '#fb8500' },
    { id: 'retro', name: 'Retro', color: '#e76f51' },
    { id: 'winter', name: 'Winter', color: '#90e0ef' },
    { id: 'halloween', name: 'Halloween', color: '#ff6d00' },
    { id: 'christmas', name: 'Christmas', color: '#d62828' },
];

const skins = [
    { id: 'default', name: 'Default Bubu', active: true },
    { id: 'sakura', name: 'Sakura Bubu', active: false },
    { id: 'night', name: 'Night Bubu', active: false },
    { id: 'winter', name: 'Winter Bubu', active: false },
];

export default function SkinsPage() {
    return (
        <div>
            <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shirt size={20} aria-hidden="true" /> Skins &amp; Styles
            </h2>

            <div className="card">
                <div className="card-header">
                    <span className="card-title">Active Skin</span>
                    <button className="btn btn-secondary" title="Create new skin" aria-label="Create skin">
                        <Plus size={13} aria-hidden="true" /> Create Skin
                    </button>
                </div>
                <div className="grid grid-4">
                    {skins.map(s => (
                        <div key={s.id} className="card" style={{
                            textAlign: 'center', cursor: 'pointer',
                            border: s.active ? '2px solid var(--accent)' : undefined
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                                <PetIcon size={30} aria-hidden="true" />
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: 600 }}>{s.name}</div>
                            {s.active && <span className="badge badge-success" style={{ marginTop: '6px' }}>Active</span>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <span className="card-title">Visual Styles</span>
                    <button className="btn btn-ghost" title="Create custom style" aria-label="Create custom style">+ Custom Style</button>
                </div>
                <div className="grid grid-4">
                    {styles.map(s => (
                        <div key={s.id} className="card" style={{ textAlign: 'center', cursor: 'pointer', padding: '12px' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                background: s.color, margin: '0 auto 8px'
                            }} />
                            <div style={{ fontSize: '12px', fontWeight: 500 }}>{s.name}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <span className="card-title">Import / Export</span>
                </div>
                <div className="quick-actions">
                    <button className="btn btn-ghost" title="Import skin" aria-label="Import skin">
                        <Upload size={13} aria-hidden="true" /> Import Skin
                    </button>
                    <button className="btn btn-ghost" title="Export skin" aria-label="Export skin">
                        <Download size={13} aria-hidden="true" /> Export Skin
                    </button>
                    <button className="btn btn-ghost" title="Import style" aria-label="Import style">
                        <Upload size={13} aria-hidden="true" /> Import Style
                    </button>
                    <button className="btn btn-ghost" title="Export style" aria-label="Export style">
                        <Download size={13} aria-hidden="true" /> Export Style
                    </button>
                </div>
            </div>
        </div>
    );
}
