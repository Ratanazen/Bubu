const app = document.getElementById('settings-app')!;
app.innerHTML = `
    <h2>Control Center</h2>
    
    <div class="section">
        <h3>Administration & Quick Actions</h3>
        <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button onclick="window.dispatchEvent(new CustomEvent('cmd', {detail: 'run'}))">🏃 Run</button>
            <button onclick="window.dispatchEvent(new CustomEvent('cmd', {detail: 'speak'}))">💬 Speak</button>
            <button onclick="window.dispatchEvent(new CustomEvent('cmd', {detail: 'sleep'}))">😴 Sleep</button>
            <button onclick="window.dispatchEvent(new CustomEvent('cmd', {detail: 'play'}))">🎮 Play</button>
        </div>
    </div>

    <div class="section">
        <h3>Appearance (Style & Size)</h3>
        <label>Skin Style</label>
        <select id="skinSelect" style="width: 100%; padding: 8px; border-radius: 5px; margin-bottom: 10px;">
            <option value="default">Default Bubu</option>
            <option value="retro">Retro (Custom Image)</option>
            <option value="night">Night Bubu</option>
            <option value="sakura">Sakura Bubu</option>
        </select>
        
        <label>Pet Size: <span id="sizeValue">1</span>x</label>
        <input type="range" id="petSize" min="0.5" max="2" step="0.1" value="1" style="width: 100%;">
    </div>

    <div class="section">
        <h3>General</h3>
        <label><input type="checkbox" id="alwaysOnTop"> Always on top</label>
        <label><input type="checkbox" id="startWithWindows"> Launch at startup</label>
    </div>
    
    <div class="section">
        <h3>Privacy & Integrations</h3>
        <label><input type="checkbox" id="enableAppMonitor" checked> Enable App Monitoring</label>
        <label><input type="checkbox" id="enableMediaMonitor" checked> Enable Music Detection</label>
        <label><input type="checkbox" id="enableLyrics" checked> Enable Lyrics Engine</label>
    </div>

    <button id="saveBtn">Save Settings</button>
`;

// Size slider label update
const petSize = document.getElementById('petSize') as HTMLInputElement;
const sizeValue = document.getElementById('sizeValue')!;
petSize.addEventListener('input', () => {
    sizeValue.innerText = petSize.value;
});

async function load() {
    const settings = await window.electronAPI.getSettings();
    (document.getElementById('alwaysOnTop') as HTMLInputElement).checked = settings.alwaysOnTop;
    (document.getElementById('startWithWindows') as HTMLInputElement).checked = settings.startWithWindows;
    petSize.value = settings.petSize || 1;
    sizeValue.innerText = petSize.value;
    
    if (settings.skin) {
        (document.getElementById('skinSelect') as HTMLSelectElement).value = settings.skin;
    }
}

document.getElementById('saveBtn')?.addEventListener('click', () => {
    const settings = {
        alwaysOnTop: (document.getElementById('alwaysOnTop') as HTMLInputElement).checked,
        startWithWindows: (document.getElementById('startWithWindows') as HTMLInputElement).checked,
        skin: (document.getElementById('skinSelect') as HTMLSelectElement).value,
        petSize: parseFloat(petSize.value)
    };
    
    window.electronAPI.saveSettings(settings);
    // Tell renderer to update immediately
    window.dispatchEvent(new CustomEvent('settings-updated', { detail: settings }));
    
    const btn = document.getElementById('saveBtn')!;
    btn.innerText = 'Saved!';
    setTimeout(() => { btn.innerText = 'Save Settings'; }, 2000);
});

load();
