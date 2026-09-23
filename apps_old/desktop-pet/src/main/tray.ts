import { Tray, Menu, app, nativeImage } from 'electron';
import { openSettingsWindow } from './settingsWindow';

let tray: Tray | null = null;
let isPaused = false;

// Creates a tiny transparent 1x1 base64 icon
const emptyIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAAaADAAQAAAABAAAAAQAAAAD5Ip3+AAAADUlEQVQIHWP4//8/AwAI/AL+XJhO/AAAAABJRU5ErkJggg==';

export function setupTray(mainWindow: Electron.BrowserWindow) {
    const icon = nativeImage.createFromDataURL(emptyIcon);
    tray = new Tray(icon);
    
    const updateMenu = () => {
        const contextMenu = Menu.buildFromTemplate([
            { label: 'Bubu Desktop Pet', enabled: false },
            { type: 'separator' },
            { 
                label: isPaused ? 'Resume Bubu' : 'Pause Bubu', 
                click: () => {
                    isPaused = !isPaused;
                    mainWindow.webContents.send('pause-state-changed', isPaused);
                    updateMenu();
                }
            },
            { label: 'Settings', click: () => openSettingsWindow() },
            { type: 'separator' },
            { label: 'Exit', click: () => app.quit() }
        ]);
        tray?.setContextMenu(contextMenu);
    };
    
    updateMenu();
}
