import * as fs from 'fs';
import { ImageGenerationProvider } from './ImageGenerationProvider';

/**
 * Customization options defining character visual identity and equipment.
 */
export interface CharacterCustomization {
  body?: string;
  face?: string;
  eyes?: string;
  mouth?: string;
  colors?: Record<string, string>;
  accessories?: string[];
  clothes?: string;
  hat?: string;
  shoes?: string;
  effects?: string[];
}

/**
 * CharacterManager preserves the original uploaded reference image,
 * tracks customization layers, and generates detailed AI synthesis prompts.
 */
export class CharacterManager {
  private referenceImagePath: string | null = null;
  private customization: CharacterCustomization = {};
  private imageProvider: ImageGenerationProvider | null = null;

  constructor(initialReference?: string, initialCustomization?: CharacterCustomization) {
    if (initialReference) {
      this.setReferenceImage(initialReference);
    }
    if (initialCustomization) {
      this.setCustomization(initialCustomization);
    }
  }

  /**
   * Sets the reference image path. The source file is never modified.
   */
  public setReferenceImage(path: string): void {
    if (!path || typeof path !== 'string') {
      throw new Error('Reference image path must be a valid non-empty string');
    }

    if (!fs.existsSync(path)) {
      console.warn(`Reference image file does not currently exist on disk: ${path}`);
    }

    // Retain path reference only; never mutate or overwrite original source file
    this.referenceImagePath = path;
  }

  /**
   * Returns the path to the original reference image, or null if unset.
   */
  public getReferenceImage(): string | null {
    return this.referenceImagePath;
  }

  /**
   * Updates character visual customization options.
   */
  public setCustomization(options: Partial<CharacterCustomization>): void {
    this.customization = {
      ...this.customization,
      ...options,
      colors: {
        ...(this.customization.colors ?? {}),
        ...(options.colors ?? {}),
      },
      accessories: options.accessories
        ? [...options.accessories]
        : this.customization.accessories
        ? [...this.customization.accessories]
        : undefined,
      effects: options.effects
        ? [...options.effects]
        : this.customization.effects
        ? [...this.customization.effects]
        : undefined,
    };
  }

  /**
   * Returns a copy of current customization settings.
   */
  public getCustomization(): CharacterCustomization {
    return {
      ...this.customization,
      colors: this.customization.colors ? { ...this.customization.colors } : undefined,
      accessories: this.customization.accessories ? [...this.customization.accessories] : undefined,
      effects: this.customization.effects ? [...this.customization.effects] : undefined,
    };
  }

  /**
   * Generates a descriptive prompt for AI image generators (e.g., Stable Diffusion,
   * ComfyUI, DALL-E) based on current customizations and specified visual style.
   */
  public generatePrompt(style: string): string {
    const promptSegments: string[] = [];

    // Base Subject and Style Anchor
    promptSegments.push(
      `masterpiece, 2D desktop companion character sprite of Bubu in ${style} visual style`
    );
    promptSegments.push('full body view, centered, isolated on clean transparent background');

    // Body & Anatomy
    if (this.customization.body) {
      promptSegments.push(`body: ${this.customization.body}`);
    } else {
      promptSegments.push('chibi proportion, cute rounded silhouette');
    }

    // Facial Features
    if (this.customization.face) {
      promptSegments.push(`face: ${this.customization.face}`);
    }
    if (this.customization.eyes) {
      promptSegments.push(`eyes: ${this.customization.eyes}`);
    }
    if (this.customization.mouth) {
      promptSegments.push(`mouth: ${this.customization.mouth}`);
    }

    // Color Palette Details
    if (this.customization.colors && Object.keys(this.customization.colors).length > 0) {
      const colorDesc = Object.entries(this.customization.colors)
        .map(([part, color]) => `${part} is ${color}`)
        .join(', ');
      promptSegments.push(`color scheme: ${colorDesc}`);
    }

    // Wearables & Attire
    if (this.customization.clothes) {
      promptSegments.push(`wearing: ${this.customization.clothes}`);
    }
    if (this.customization.hat) {
      promptSegments.push(`headwear: ${this.customization.hat}`);
    }
    if (this.customization.shoes) {
      promptSegments.push(`footwear: ${this.customization.shoes}`);
    }

    // Accessories
    if (this.customization.accessories && this.customization.accessories.length > 0) {
      promptSegments.push(`accessories: ${this.customization.accessories.join(', ')}`);
    }

    // Shaders & Atmosphere Effects
    if (this.customization.effects && this.customization.effects.length > 0) {
      promptSegments.push(`effects: ${this.customization.effects.join(', ')}`);
    }

    // Sprite Quality & Format Constraints
    promptSegments.push(
      'game asset sprite sheet friendly, crisp outline, vibrant digital illustration, no watermark, no text'
    );

    return promptSegments.join(', ');
  }

  /**
   * Attaches an image generation provider backend.
   */
  public setImageProvider(provider: ImageGenerationProvider): void {
    this.imageProvider = provider;
  }

  /**
   * Returns the current image generation provider, if any.
   */
  public getImageProvider(): ImageGenerationProvider | null {
    return this.imageProvider;
  }

  /**
   * Generates a new character sprite using the attached provider.
   */
  public async generateCharacter(style: string = 'cute'): Promise<{ imagePath: string }> {
    if (!this.imageProvider) {
      throw new Error('No ImageGenerationProvider has been configured');
    }

    const available = await this.imageProvider.isAvailable();
    if (!available) {
      throw new Error(`Image provider "${this.imageProvider.name}" is not available`);
    }

    const prompt = this.generatePrompt(style);
    return this.imageProvider.generateCharacter(prompt, this.referenceImagePath ?? undefined);
  }

  /**
   * Generates a character variation using the attached provider and reference image.
   */
  public async generateVariation(style: string = 'cute'): Promise<{ imagePath: string }> {
    if (!this.imageProvider) {
      throw new Error('No ImageGenerationProvider has been configured');
    }

    const available = await this.imageProvider.isAvailable();
    if (!available) {
      throw new Error(`Image provider "${this.imageProvider.name}" is not available`);
    }

    const prompt = this.generatePrompt(style);
    return this.imageProvider.generateVariation(prompt, this.referenceImagePath ?? undefined);
  }
}
