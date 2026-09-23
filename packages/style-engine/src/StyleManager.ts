/**
 * Color palette definition for a visual style.
 */
export interface StyleColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

/**
 * Animation modifier properties applied when a style is active.
 */
export interface StyleAnimationModifiers {
  speedMultiplier: number;
  bounceAmount: number;
}

/**
 * Full visual style specification including color palette, shaders/effects,
 * and animation modifiers.
 */
export interface StyleDefinition {
  avatar?: {
    file: string;
    type: "image" | "gif" | "webp" | "png" | "jpg";
  };
  id: string;
  name: string;
  description: string;
  colors: StyleColors;
  effects: string[];
  animationModifiers: StyleAnimationModifiers;
}

/**
 * Comprehensive built-in style presets for Bubu Desktop Companion.
 */
export const BUILTIN_STYLES: Record<string, StyleDefinition> = {
  cute: {
    id: 'cute',
    name: 'Cute',
    description: 'Soft rosy tones with playful sparkling accents and bouncy movements',
    colors: {
      primary: '#FFB6C1',
      secondary: '#FFE4E1',
      accent: '#FF69B4',
      background: 'rgba(255, 240, 245, 0.85)',
    },
    effects: ['sparkles', 'blush', 'heart_float'],
    animationModifiers: { speedMultiplier: 1.05, bounceAmount: 1.2 },
  },

  kawaii: {
    id: 'kawaii',
    name: 'Kawaii',
    description: 'Anime-inspired pastel vibrancy with floating star glitter',
    colors: {
      primary: '#FF9EE2',
      secondary: '#B5EAD7',
      accent: '#FFF5BA',
      background: 'rgba(255, 240, 250, 0.9)',
    },
    effects: ['star_glitter', 'rainbow_sparkles', 'soft_bloom'],
    animationModifiers: { speedMultiplier: 1.1, bounceAmount: 1.3 },
  },

  pastel: {
    id: 'pastel',
    name: 'Pastel Dream',
    description: 'Gentle lavender, mint, and peach tones with airy floating physics',
    colors: {
      primary: '#C7CEEA',
      secondary: '#E2F0CB',
      accent: '#FFDAC1',
      background: 'rgba(247, 245, 255, 0.85)',
    },
    effects: ['soft_glow', 'feather_edges'],
    animationModifiers: { speedMultiplier: 0.95, bounceAmount: 0.9 },
  },

  soft: {
    id: 'soft',
    name: 'Soft & Warm',
    description: 'Comforting warm beige, cream, and ivory aesthetic with gentle motions',
    colors: {
      primary: '#EAD7C5',
      secondary: '#F7EBE1',
      accent: '#D4A373',
      background: 'rgba(250, 247, 242, 0.9)',
    },
    effects: ['warm_diffuse', 'vignette_soft'],
    animationModifiers: { speedMultiplier: 0.9, bounceAmount: 0.8 },
  },

  minimal: {
    id: 'minimal',
    name: 'Minimalist',
    description: 'Clean monochrome grays and subtle drop shadows with crisp precision',
    colors: {
      primary: '#4A4A4A',
      secondary: '#D1D5DB',
      accent: '#1F2937',
      background: 'rgba(255, 255, 255, 0.95)',
    },
    effects: ['subtle_shadow', 'clean_lines'],
    animationModifiers: { speedMultiplier: 1.0, bounceAmount: 0.5 },
  },

  chibi: {
    id: 'chibi',
    name: 'Chibi Pop',
    description: 'High saturation anime character style with exaggerated bouncy dynamics',
    colors: {
      primary: '#FF4081',
      secondary: '#00E5FF',
      accent: '#FFD600',
      background: 'rgba(255, 255, 255, 0.88)',
    },
    effects: ['exaggerated_blush', 'action_lines', 'pop_shadow'],
    animationModifiers: { speedMultiplier: 1.15, bounceAmount: 1.4 },
  },

  cartoon: {
    id: 'cartoon',
    name: 'Toon Pop',
    description: 'Bold primary colors with thick ink outlines and energetic squash/stretch',
    colors: {
      primary: '#FF3366',
      secondary: '#33CCFF',
      accent: '#FFCC00',
      background: 'rgba(255, 255, 245, 0.9)',
    },
    effects: ['ink_outline', 'squash_stretch', 'comic_dots'],
    animationModifiers: { speedMultiplier: 1.1, bounceAmount: 1.35 },
  },

  pixel: {
    id: 'pixel',
    name: 'Pixel Retro',
    description: '8-bit nostalgic arcade aesthetic with integer snap motions',
    colors: {
      primary: '#5C94FC',
      secondary: '#00A800',
      accent: '#FC9838',
      background: 'rgba(0, 0, 0, 0.85)',
    },
    effects: ['pixelate', 'scanlines_light', 'point_filter'],
    animationModifiers: { speedMultiplier: 1.0, bounceAmount: 0.7 },
  },

  retro: {
    id: 'retro',
    name: 'Vintage 80s',
    description: 'Warm nostalgic sepia and orange tones with film grain wobble',
    colors: {
      primary: '#E07A5F',
      secondary: '#F2CC8F',
      accent: '#81B29A',
      background: 'rgba(61, 64, 91, 0.9)',
    },
    effects: ['film_grain', 'vhs_wobble', 'warm_tint'],
    animationModifiers: { speedMultiplier: 0.95, bounceAmount: 0.95 },
  },

  y2k: {
    id: 'y2k',
    name: 'Y2K Cyber Millennium',
    description: 'Chrome silver, translucent cyan, and futuristic lens flares',
    colors: {
      primary: '#E0E7FF',
      secondary: '#38BDF8',
      accent: '#F43F5E',
      background: 'rgba(224, 231, 255, 0.85)',
    },
    effects: ['chrome_glaze', 'lens_flare', 'translucent_glass'],
    animationModifiers: { speedMultiplier: 1.08, bounceAmount: 1.1 },
  },

  cyber: {
    id: 'cyber',
    name: 'Cyberpunk',
    description: 'Matrix digital cyber grid with cyan holograms and glitch flashes',
    colors: {
      primary: '#00FFCC',
      secondary: '#FF007F',
      accent: '#7928CA',
      background: 'rgba(10, 10, 20, 0.92)',
    },
    effects: ['hologram_scan', 'glitch_pulse', 'digital_noise'],
    animationModifiers: { speedMultiplier: 1.15, bounceAmount: 0.85 },
  },

  neon: {
    id: 'neon',
    name: 'Neon Glow',
    description: 'High-voltage electric purples and vivid glowing tube lights',
    colors: {
      primary: '#F000FF',
      secondary: '#00FFFF',
      accent: '#FFE600',
      background: 'rgba(15, 5, 25, 0.95)',
    },
    effects: ['intense_bloom', 'neon_flicker', 'light_aura'],
    animationModifiers: { speedMultiplier: 1.05, bounceAmount: 1.15 },
  },

  dark: {
    id: 'dark',
    name: 'Obsidian Dark',
    description: 'Deep midnight obsidian tones with smooth smoky shadows',
    colors: {
      primary: '#8B5CF6',
      secondary: '#475569',
      accent: '#A78BFA',
      background: 'rgba(15, 23, 42, 0.92)',
    },
    effects: ['dark_vignette', 'shadow_smoke', 'ambient_dark'],
    animationModifiers: { speedMultiplier: 0.95, bounceAmount: 0.75 },
  },

  sakura: {
    id: 'sakura',
    name: 'Sakura Blossom',
    description: 'Cherry blossom petal pinks with gentle drifting breeze particles',
    colors: {
      primary: '#FFB7C5',
      secondary: '#FFFFFF',
      accent: '#E75480',
      background: 'rgba(255, 245, 247, 0.88)',
    },
    effects: ['falling_petals', 'breeze_sway', 'soft_pink_glow'],
    animationModifiers: { speedMultiplier: 0.92, bounceAmount: 1.05 },
  },

  winter: {
    id: 'winter',
    name: 'Frost & Snow',
    description: 'Crisp glacial blues and snowflake frost dust with brisk dynamics',
    colors: {
      primary: '#A5F3FC',
      secondary: '#F0FDF4',
      accent: '#0284C7',
      background: 'rgba(240, 249, 255, 0.9)',
    },
    effects: ['snow_drift', 'frost_crystal', 'cold_sparkle'],
    animationModifiers: { speedMultiplier: 0.96, bounceAmount: 0.9 },
  },

  halloween: {
    id: 'halloween',
    name: 'Spooky Pumpkin',
    description: 'Pumpkin orange and eerie purple with ghostly candle flickering',
    colors: {
      primary: '#F97316',
      secondary: '#9333EA',
      accent: '#22C55E',
      background: 'rgba(24, 24, 27, 0.92)',
    },
    effects: ['candle_flicker', 'ghost_trail', 'spooky_glow'],
    animationModifiers: { speedMultiplier: 1.05, bounceAmount: 1.25 },
  },

  christmas: {
    id: 'christmas',
    name: 'Holiday Cheer',
    description: 'Evergreen foliage and cranberry red adorned with twinkling fairy lights',
    colors: {
      primary: '#DC2626',
      secondary: '#16A34A',
      accent: '#FACC15',
      background: 'rgba(254, 242, 242, 0.9)',
    },
    effects: ['fairy_lights', 'golden_sparkles', 'festive_glow'],
    animationModifiers: { speedMultiplier: 1.05, bounceAmount: 1.2 },
  },

  space: {
    id: 'space',
    name: 'Cosmic Nebula',
    description: 'Starlight violet and deep void navy with zero-gravity floating',
    colors: {
      primary: '#818CF8',
      secondary: '#C084FC',
      accent: '#38BDF8',
      background: 'rgba(10, 10, 35, 0.94)',
    },
    effects: ['starfield', 'nebula_pulse', 'zero_g_float'],
    animationModifiers: { speedMultiplier: 0.85, bounceAmount: 0.7 },
  },

  ocean: {
    id: 'ocean',
    name: 'Ocean Depths',
    description: 'Marine turquoise and aqua foam with gentle rhythmic water swells',
    colors: {
      primary: '#06B6D4',
      secondary: '#67E8F9',
      accent: '#0284C7',
      background: 'rgba(236, 254, 255, 0.88)',
    },
    effects: ['water_bubbles', 'caustics_light', 'gentle_wave'],
    animationModifiers: { speedMultiplier: 0.9, bounceAmount: 1.1 },
  },

  forest: {
    id: 'forest',
    name: 'Enchanted Forest',
    description: 'Earthy moss greens and sunbeam amber with floating fireflies',
    colors: {
      primary: '#4ADE80',
      secondary: '#A16207',
      accent: '#FDE047',
      background: 'rgba(240, 253, 244, 0.9)',
    },
    effects: ['fireflies', 'leaf_flutter', 'sunbeam_glow'],
    animationModifiers: { speedMultiplier: 0.95, bounceAmount: 1.0 },
  },

  night: {
    id: 'night',
    name: 'Midnight Serenity',
    description: 'Moonlit indigo and velvet night haze with shooting stars',
    colors: {
      primary: '#6366F1',
      secondary: '#CBD5E1',
      accent: '#E0E7FF',
      background: 'rgba(15, 23, 42, 0.95)',
    },
    effects: ['moonlight_haze', 'shooting_stars', 'calm_dusk'],
    animationModifiers: { speedMultiplier: 0.88, bounceAmount: 0.8 },
  },

  sunset: {
    id: 'sunset',
    name: 'Golden Sunset',
    description: 'Warm sunset amber, radiant coral, and evening dusk purple gradients',
    colors: {
      primary: '#F97316',
      secondary: '#EC4899',
      accent: '#FDE047',
      background: 'rgba(255, 247, 237, 0.9)',
    },
    effects: ['god_rays', 'sunset_gradient', 'warm_radiance'],
    animationModifiers: { speedMultiplier: 0.94, bounceAmount: 0.95 },
  },

  monochrome: {
    id: 'monochrome',
    name: 'Noir Monochrome',
    description: 'Dramatic black and white film aesthetic with crisp contrast',
    colors: {
      primary: '#111827',
      secondary: '#9CA3AF',
      accent: '#FFFFFF',
      background: 'rgba(249, 250, 251, 0.95)',
    },
    effects: ['film_grain', 'high_contrast', 'vignette_noir'],
    animationModifiers: { speedMultiplier: 1.0, bounceAmount: 0.6 },
  },
};

/**
 * StyleManager oversees visual themes, custom style definitions, active themes,
 * and serialization/exporting.
 */
export class StyleManager {
  private styles: Map<string, StyleDefinition> = new Map();
  private activeStyleId: string = 'cute';
  private listeners: Set<(style: StyleDefinition) => void> = new Set();

  constructor(initialStyleId: string = 'cute') {
    // Load all built-in styles
    for (const [id, def] of Object.entries(BUILTIN_STYLES)) {
      this.styles.set(id, { ...def });
    }

    if (this.styles.has(initialStyleId)) {
      this.activeStyleId = initialStyleId;
    }
  }

  /**
   * Retrieves a style definition by ID.
   */
  public getStyle(id: string): StyleDefinition | undefined {
    return this.styles.get(id);
  }

  /**
   * Returns the currently active style definition.
   */
  public getActiveStyle(): StyleDefinition {
    return this.styles.get(this.activeStyleId) ?? BUILTIN_STYLES.cute;
  }

  /**
   * Switches the active visual style.
   * Returns true if successful, false if the style ID does not exist.
   */
  public setActiveStyle(id: string): boolean {
    const style = this.styles.get(id);
    if (!style) {
      return false;
    }

    if (this.activeStyleId !== id) {
      this.activeStyleId = id;
      this.notifyStyleChange(style);
    }

    return true;
  }

  /**
   * Lists all available styles (both built-in and user-created).
   */
  public listStyles(): StyleDefinition[] {
    return Array.from(this.styles.values());
  }

  /**
   * Registers a new custom style or updates an existing custom style.
   */
  public createCustomStyle(style: StyleDefinition): StyleDefinition {
    if (!style.id || !style.name || !style.colors) {
      throw new Error('Custom style must have an id, name, and colors');
    }

    const validatedStyle: StyleDefinition = {
      id: style.id,
      name: style.name,
      description: style.description ?? '',
      colors: {
        primary: style.colors.primary,
        secondary: style.colors.secondary,
        accent: style.colors.accent,
        background: style.colors.background,
      },
      effects: Array.isArray(style.effects) ? [...style.effects] : [],
      animationModifiers: {
        speedMultiplier: style.animationModifiers?.speedMultiplier ?? 1.0,
        bounceAmount: style.animationModifiers?.bounceAmount ?? 1.0,
      },
    };

    this.styles.set(style.id, validatedStyle);

    if (this.activeStyleId === style.id) {
      this.notifyStyleChange(validatedStyle);
    }

    return validatedStyle;
  }

  /**
   * Exports a style definition as a JSON string.
   */
  public exportStyle(id: string): string {
    const style = this.styles.get(id);
    if (!style) {
      throw new Error(`Style with id "${id}" not found`);
    }

    return JSON.stringify(style, null, 2);
  }

  /**
   * Imports a style definition from JSON string or Buffer.
   */
  public importStyle(data: string | Buffer): StyleDefinition {
    const jsonStr = Buffer.isBuffer(data) ? data.toString('utf-8') : data;
    const parsed = JSON.parse(jsonStr) as StyleDefinition;

    if (!parsed || !parsed.id || !parsed.name || !parsed.colors) {
      throw new Error('Invalid style definition: missing id, name, or colors');
    }

    return this.createCustomStyle(parsed);
  }

  /**
   * Subscribes to active style changes.
   */
  public onStyleChange(callback: (style: StyleDefinition) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyStyleChange(style: StyleDefinition): void {
    for (const listener of this.listeners) {
      try {
        listener(style);
      } catch (err) {
        console.error('Error in StyleManager onStyleChange listener:', err);
      }
    }
  }
}
