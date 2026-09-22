/**
 * Provider interface for pluggable local or cloud AI image generation backends
 * (e.g., Stable Diffusion, DALL-E, ComfyUI, Ollama/Flux).
 */
export interface ImageGenerationProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  generateCharacter(prompt: string, reference?: string): Promise<{ imagePath: string }>;
  generateVariation(prompt: string, reference?: string): Promise<{ imagePath: string }>;
}
