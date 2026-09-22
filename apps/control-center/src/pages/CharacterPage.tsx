import React, { useState } from 'react';

export default function CharacterPage() {
    const [activeTab, setActiveTab] = useState('upload');

    return (
        <div>
            <h2 className="page-title">🎨 Character</h2>

            <div className="quick-actions" style={{ marginBottom: '20px' }}>
                {['upload', 'customize', 'prompt'].map(tab => (
                    <button key={tab} className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setActiveTab(tab)}>
                        {tab === 'upload' && '📁 Upload'}
                        {tab === 'customize' && '✏️ Customize'}
                        {tab === 'prompt' && '🤖 AI Prompt'}
                    </button>
                ))}
            </div>

            {activeTab === 'upload' && (
                <div className="card">
                    <div className="card-title" style={{ marginBottom: '16px' }}>Upload Reference Image</div>
                    <div style={{
                        border: '2px dashed var(--border)', borderRadius: '12px', padding: '40px',
                        textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s'
                    }}>
                        <div style={{ fontSize: '40px', marginBottom: '8px' }}>📁</div>
                        <p style={{ fontSize: '14px', fontWeight: 600 }}>Drop images here</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>PNG / JPG / WEBP / SVG</p>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px' }}>
                        Your original image is preserved untouched. All modifications are stored separately.
                    </p>
                </div>
            )}

            {activeTab === 'customize' && (
                <div className="grid grid-2">
                    {['Body', 'Face', 'Eyes', 'Mouth', 'Colors', 'Hair', 'Clothes', 'Hat', 'Shoes', 'Accessories', 'Effects', 'Expressions'].map(part => (
                        <div key={part} className="card">
                            <div className="card-title">{part}</div>
                            <select style={{ marginTop: '8px' }}>
                                <option>Default</option>
                                <option>Option A</option>
                                <option>Option B</option>
                                <option>Custom</option>
                            </select>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'prompt' && (
                <div className="card">
                    <div className="card-title" style={{ marginBottom: '12px' }}>AI Style Prompt</div>
                    <textarea style={{
                        width: '100%', minHeight: '120px', padding: '12px', borderRadius: '8px',
                        border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)',
                        fontFamily: 'inherit', fontSize: '13px', resize: 'vertical'
                    }} placeholder="Create a soft pastel Sakura version of this Bubu. Keep the original character identity and proportions. Add subtle pink Sakura elements and a small flower accessory." />
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '8px 0 12px' }}>
                        Requires an AI image generation provider to be configured in Settings.
                    </p>
                    <button className="btn btn-primary">✨ Generate Variation</button>
                </div>
            )}
        </div>
    );
}
