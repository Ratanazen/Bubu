import React, { useState } from 'react';

export default function CharacterPage() {
  const [activeTab, setActiveTab] = useState<'studio' | 'customize' | 'prompt'>('studio');
  const [tintColor, setTintColor] = useState('#ffffff');
  const [accessory, setAccessory] = useState('none');
  const [blush, setBlush] = useState(false);

  const resetToOriginal = () => {
    setTintColor('#ffffff');
    setAccessory('none');
    setBlush(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="page-title" style={{ margin: 0 }}>🎨 Character Studio V2</h2>
        <button className="btn btn-ghost" onClick={resetToOriginal}>↺ Reset to Original</button>
      </div>

      <div className="quick-actions" style={{ marginBottom: '20px' }}>
        <button
          className={`btn ${activeTab === 'studio' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('studio')}
        >
          🖼️ Side-by-Side Comparison
        </button>
        <button
          className={`btn ${activeTab === 'customize' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('customize')}
        >
          ✨ Customization Studio
        </button>
        <button
          className={`btn ${activeTab === 'prompt' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('prompt')}
        >
          🤖 AI Sprite Generator
        </button>
      </div>

      {activeTab === 'studio' && (
        <div className="grid grid-2">
          <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
            <div className="card-title" style={{ marginBottom: '16px' }}>Original Reference (Untouched)</div>
            <div style={{
              width: '140px',
              height: '140px',
              margin: '0 auto',
              backgroundColor: '#000',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px'
            }}>
              <img
                src="/assets/characters/bubu-reference.png"
                alt="Original Reference"
                style={{ maxWidth: '100%', maxHeight: '100%', imageRendering: 'pixelated' }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <span className="badge badge-success" style={{ marginTop: '12px' }}>Locked & Preserved</span>
            <p style={{ fontSize: '11px', color: '#888', marginTop: '8px' }}>
              Base character identity is permanently guarded.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
            <div className="card-title" style={{ marginBottom: '16px' }}>Active Customized Variant</div>
            <div style={{
              width: '140px',
              height: '140px',
              margin: '0 auto',
              backgroundColor: '#111',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
              position: 'relative'
            }}>
              <img
                src="/assets/characters/bubu-reference.png"
                alt="Customized Variant"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  imageRendering: 'pixelated',
                  filter: tintColor !== '#ffffff' ? `drop-shadow(0 0 8px ${tintColor})` : 'none'
                }}
              />
              {blush && (
                <div style={{
                  position: 'absolute',
                  bottom: '36px',
                  width: '60px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ width: '12px', height: '6px', backgroundColor: '#ff6b81', borderRadius: '50%', opacity: 0.8 }} />
                  <div style={{ width: '12px', height: '6px', backgroundColor: '#ff6b81', borderRadius: '50%', opacity: 0.8 }} />
                </div>
              )}
              {accessory === 'sakura-pin' && (
                <div style={{ position: 'absolute', top: '24px', right: '32px', fontSize: '18px' }}>🌸</div>
              )}
              {accessory === 'crown' && (
                <div style={{ position: 'absolute', top: '14px', fontSize: '18px' }}>👑</div>
              )}
            </div>
            <span className="badge badge-info" style={{ marginTop: '12px' }}>Live Runtime Preview</span>
            <div style={{ marginTop: '12px' }}>
              <button className="btn btn-primary" onClick={() => alert('Custom variant saved to library!')}>
                💾 Save as New Variant
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'customize' && (
        <div className="grid grid-2">
          <div className="card">
            <div className="card-title" style={{ marginBottom: '12px' }}>Aura / Tint Color</div>
            <input
              type="color"
              value={tintColor}
              onChange={e => setTintColor(e.target.value)}
              style={{ width: '100%', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            />
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: '12px' }}>Accessories</div>
            <select
              value={accessory}
              onChange={e => setAccessory(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
            >
              <option value="none">None</option>
              <option value="sakura-pin">🌸 Sakura Hairpin</option>
              <option value="crown">👑 Golden Crown</option>
            </select>
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: '12px' }}>Facial Expression</div>
            <div className="status-row">
              <span className="status-label">Cheek Blush</span>
              <div
                className={`toggle ${blush ? 'active' : ''}`}
                onClick={() => setBlush(!blush)}
              />
            </div>
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: '12px' }}>Proportions</div>
            <div className="status-row">
              <span className="status-label">Silhouette Scale</span>
              <input type="range" min="80" max="140" defaultValue="100" style={{ width: '140px' }} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'prompt' && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: '12px' }}>AI Character Variation Studio</div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Reference image is strictly locked as seed geometry. Enter a styling prompt to generate variants:
          </p>
          <textarea
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              fontSize: '13px'
            }}
            defaultValue="Create a soft pastel Sakura version of this Bubu. Keep the original character identity, rectangular head, and leg proportions. Add subtle pink accents and a small flower accessory."
          />
          <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary" onClick={() => alert('AI provider requires configured credentials in Settings.')}>
              ✨ Generate Variation
            </button>
            <button className="btn btn-ghost" onClick={() => alert('Prompt saved to character metadata.')}>
              Save Prompt Preset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
