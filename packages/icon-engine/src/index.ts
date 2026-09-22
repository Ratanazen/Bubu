export interface IconDefinition {
  name: string;
  svg: string;
  category: 'navigation' | 'action' | 'media' | 'system' | 'status';
  ariaLabel: string;
}

export const ICONS: Record<string, IconDefinition> = {
  home: { name: 'home', category: 'navigation', ariaLabel: 'Home Dashboard', svg: '<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>' },
  pet: { name: 'pet', category: 'navigation', ariaLabel: 'Desktop Pet Control', svg: '<svg viewBox="0 0 24 24"><circle cx="4.5" cy="9.5" r="2.5"/><circle cx="9" cy="5.5" r="2.5"/><circle cx="15" cy="5.5" r="2.5"/><circle cx="19.5" cy="9.5" r="2.5"/><path d="M17.34 14.86c-.87-1.02-1.6-1.89-2.48-2.49-1.92-1.32-3.8-1.32-5.72 0-.88.6-1.61 1.47-2.48 2.49-1.34 1.57-1.8 3.01-1.03 4.29.67 1.12 1.96 1.85 3.51 1.85.92 0 1.93-.32 2.86-.96.93.64 1.94.96 2.86.96 1.55 0 2.84-.73 3.51-1.85.77-1.28.31-2.72-1.03-4.29z"/></svg>' },
  screenMap: { name: 'screen-map', category: 'navigation', ariaLabel: 'Screen Control Map', svg: '<svg viewBox="0 0 24 24"><path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>' },
  location: { name: 'location', category: 'navigation', ariaLabel: 'Custom Location', svg: '<svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>' },
  text: { name: 'text', category: 'navigation', ariaLabel: 'Custom Text and Widgets', svg: '<svg viewBox="0 0 24 24"><path d="M5 4v3h5.5v12h3V7H19V4z"/></svg>' },
  style: { name: 'style', category: 'navigation', ariaLabel: 'Style Engine', svg: '<svg viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.28 19.68 10.6 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/></svg>' },
  settings: { name: 'settings', category: 'system', ariaLabel: 'Settings', svg: '<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>' }
};

export function getIcon(name: string): IconDefinition | undefined {
  return ICONS[name];
}
