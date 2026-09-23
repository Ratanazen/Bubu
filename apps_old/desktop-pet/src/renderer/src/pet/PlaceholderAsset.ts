import { Skin } from '../skins/SkinManager';

export function getPlaceholderSVG(state: string, skin: Skin): string {
    // If skin has an image, render an img tag instead of SVG
    if (skin.imageUrl) {
        let bounce = 0;
        if (state.includes('WALK')) bounce = 3;
        else if (state.includes('RUN')) bounce = 6;
        else if (state === 'DANCE') bounce = 8;
        
        const bobbing = (state === 'DANCE' || state.includes('WALK') || state.includes('RUN'))
            ? Math.abs(Math.sin(Date.now() / 150)) * bounce
            : 0;

        let extra = '';
        if (state === 'SLEEP') extra = `<div style="position:absolute; top:-10px; right: 20px; font-weight:bold; font-family:sans-serif;">Z</div>`;
        if (state === 'DANCE') extra = `<div style="position:absolute; top:-10px; left: 10px; font-weight:bold; color:pink;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div>`;

        return `
            <div style="position:relative; transform: translateY(${bobbing}px); width:100%; height:100%; display:flex; justify-content:center; align-items:center;">
                <img src="${skin.imageUrl}" style="width: 80%; height: auto; object-fit: contain;" />
                ${extra}
            </div>
        `;
    }

    let eye = `<circle cx="40" cy="50" r="5" fill="#333"/><circle cx="80" cy="50" r="5" fill="#333"/>`;
    let mouth = `<path d="M 50 70 Q 60 80 70 70" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    
    if (state === 'SLEEP') {
        eye = `<path d="M 35 50 Q 40 45 45 50" stroke="#333" stroke-width="3" fill="none"/><path d="M 75 50 Q 80 45 85 50" stroke="#333" stroke-width="3" fill="none"/>`;
        mouth = `<circle cx="60" cy="70" r="3" fill="#333"/>`;
    } else if (state === 'HAPPY' || state === 'DANCE' || state === 'PLAY') {
        eye = `<path d="M 35 50 Q 40 45 45 50" stroke="#333" stroke-width="3" fill="none"/><path d="M 75 50 Q 80 45 85 50" stroke="#333" stroke-width="3" fill="none"/>`;
        mouth = `<path d="M 45 65 Q 60 85 75 65" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    } else if (state === 'SURPRISED') {
        eye = `<circle cx="40" cy="50" r="7" fill="#333"/><circle cx="80" cy="50" r="7" fill="#333"/>`;
        mouth = `<circle cx="60" cy="75" r="5" fill="#333"/>`;
    } else if (state === 'DRAGGED') {
        eye = `<path d="M 35 45 L 45 55 M 45 45 L 35 55" stroke="#333" stroke-width="3"/><path d="M 75 45 L 85 55 M 85 45 L 75 55" stroke="#333" stroke-width="3"/>`;
        mouth = `<path d="M 50 75 Q 60 65 70 75" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    } else if (state === 'LOOK_AROUND') {
        const offset = Math.sin(Date.now() / 500) > 0 ? 5 : -5;
        eye = `<circle cx="${40 + offset}" cy="50" r="5" fill="#333"/><circle cx="${80 + offset}" cy="50" r="5" fill="#333"/>`;
    }

    let bounce = 0;
    if (state.includes('WALK')) bounce = 3;
    else if (state.includes('RUN')) bounce = 6;
    else if (state === 'DANCE' || state === 'PLAY') bounce = 8;
    
    const bobbing = (state === 'DANCE' || state === 'PLAY') 
        ? Math.abs(Math.sin(Date.now() / 100)) * bounce
        : Math.abs(Math.sin(Date.now() / 150)) * bounce;
        
    const bodyHeight = state === 'SIT' || state === 'SLEEP' ? 60 : 70;
    const bodyY = state === 'SIT' || state === 'SLEEP' ? 40 : 30;

    return `
    <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(0, ${bobbing})">
            <!-- Body -->
            <rect x="20" y="${bodyY}" width="80" height="${bodyHeight}" rx="35" fill="${skin.color}" />
            <!-- Ears -->
            <circle cx="30" cy="${bodyY}" r="15" fill="${skin.color}" />
            <circle cx="90" cy="${bodyY}" r="15" fill="${skin.color}" />
            <!-- Face -->
            ${eye}
            ${mouth}
        </g>
        ${state === 'SLEEP' ? `<text x="80" y="${30 - Math.abs(Math.sin(Date.now() / 500) * 10)}" font-family="Arial" font-size="15" fill="#333">Z</text>` : ''}
        ${state === 'DANCE' ? `<g transform="translate(10, ${25 - Math.abs(Math.sin(Date.now() / 300) * 10)})"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff9a94" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></g>` : ''}
        ${state === 'PLAY' ? `<g transform="translate(90, ${25 - Math.abs(Math.sin(Date.now() / 300) * 10)})"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffb7b2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></g>` : ''}
    </svg>`;
}
