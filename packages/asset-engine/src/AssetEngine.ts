import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export interface AssetMetadata {
    id: string;
    name: string;
    type: 'character' | 'skin' | 'style' | 'animation' | 'sound' | 'icon' | 'background' | 'effect';
    originalPath: string;
    storedPath: string;
    mimeType: string;
    size: number;
    hash: string;
    createdAt: string;
    modifiedAt: string;
    tags: string[];
}

export interface ImportResult {
    success: boolean;
    asset?: AssetMetadata;
    error?: string;
}

const SUPPORTED_FORMATS = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'];
const SUPPORTED_SOUND = ['.mp3', '.wav', '.ogg', '.flac'];

export class AssetEngine {
    private assetsDir: string;
    private metadataPath: string;
    private assets: Map<string, AssetMetadata> = new Map();

    constructor(assetsDir: string) {
        this.assetsDir = assetsDir;
        this.metadataPath = path.join(assetsDir, 'assets.json');
        this.ensureDirectories();
        this.loadMetadata();
    }

    private ensureDirectories(): void {
        const dirs = ['characters', 'skins', 'styles', 'animations', 'sounds', 'icons', 'backgrounds', 'effects'];
        for (const dir of dirs) {
            const fullPath = path.join(this.assetsDir, dir);
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true });
            }
        }
    }

    private loadMetadata(): void {
        try {
            if (fs.existsSync(this.metadataPath)) {
                const data = JSON.parse(fs.readFileSync(this.metadataPath, 'utf-8'));
                for (const asset of data) {
                    this.assets.set(asset.id, asset);
                }
            }
        } catch (e) {
            console.error('Failed to load asset metadata:', e);
        }
    }

    private saveMetadata(): void {
        try {
            const data = Array.from(this.assets.values());
            fs.writeFileSync(this.metadataPath, JSON.stringify(data, null, 2), 'utf-8');
        } catch (e) {
            console.error('Failed to save asset metadata:', e);
        }
    }

    private generateId(): string {
        return crypto.randomUUID();
    }

    private computeHash(filePath: string): string {
        const content = fs.readFileSync(filePath);
        return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
    }

    private getMimeType(ext: string): string {
        const mimes: Record<string, string> = {
            '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
            '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif',
            '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.flac': 'audio/flac'
        };
        return mimes[ext] || 'application/octet-stream';
    }

    async importAsset(sourcePath: string, type: AssetMetadata['type'], name?: string): Promise<ImportResult> {
        try {
            if (!fs.existsSync(sourcePath)) {
                return { success: false, error: 'File not found' };
            }

            const ext = path.extname(sourcePath).toLowerCase();
            const allSupported = [...SUPPORTED_FORMATS, ...SUPPORTED_SOUND];
            if (!allSupported.includes(ext)) {
                return { success: false, error: `Unsupported format: ${ext}` };
            }

            const id = this.generateId();
            const fileName = `${id}${ext}`;
            const destDir = path.join(this.assetsDir, type + 's');
            const destPath = path.join(destDir, fileName);

            // Copy file (never modify original)
            fs.copyFileSync(sourcePath, destPath);

            const stats = fs.statSync(destPath);
            const hash = this.computeHash(destPath);

            const asset: AssetMetadata = {
                id,
                name: name || path.basename(sourcePath, ext),
                type,
                originalPath: sourcePath,
                storedPath: destPath,
                mimeType: this.getMimeType(ext),
                size: stats.size,
                hash,
                createdAt: new Date().toISOString(),
                modifiedAt: new Date().toISOString(),
                tags: []
            };

            this.assets.set(id, asset);
            this.saveMetadata();

            return { success: true, asset };
        } catch (e) {
            return { success: false, error: (e as Error).message };
        }
    }

    getAsset(id: string): AssetMetadata | undefined {
        return this.assets.get(id);
    }

    listAssets(type?: AssetMetadata['type']): AssetMetadata[] {
        const all = Array.from(this.assets.values());
        return type ? all.filter(a => a.type === type) : all;
    }

    deleteAsset(id: string): boolean {
        const asset = this.assets.get(id);
        if (!asset) return false;
        try {
            if (fs.existsSync(asset.storedPath)) {
                fs.unlinkSync(asset.storedPath);
            }
            this.assets.delete(id);
            this.saveMetadata();
            return true;
        } catch {
            return false;
        }
    }

    renameAsset(id: string, newName: string): boolean {
        const asset = this.assets.get(id);
        if (!asset) return false;
        asset.name = newName;
        asset.modifiedAt = new Date().toISOString();
        this.saveMetadata();
        return true;
    }

    duplicateAsset(id: string): ImportResult {
        const asset = this.assets.get(id);
        if (!asset) return { success: false, error: 'Asset not found' };
        return this.importAsset(asset.storedPath, asset.type, `${asset.name} (copy)`) as any;
    }

    async exportPackage(assetIds: string[]): Promise<Buffer> {
        const pkg: any = { version: 1, assets: [], metadata: [] };
        for (const id of assetIds) {
            const asset = this.assets.get(id);
            if (asset && fs.existsSync(asset.storedPath)) {
                const content = fs.readFileSync(asset.storedPath).toString('base64');
                pkg.assets.push({ id: asset.id, content, ext: path.extname(asset.storedPath) });
                pkg.metadata.push(asset);
            }
        }
        return Buffer.from(JSON.stringify(pkg), 'utf-8');
    }

    async importPackage(data: Buffer): Promise<ImportResult[]> {
        const results: ImportResult[] = [];
        try {
            const pkg = JSON.parse(data.toString('utf-8'));
            for (let i = 0; i < pkg.assets.length; i++) {
                const assetData = pkg.assets[i];
                const meta = pkg.metadata[i];
                const tmpPath = path.join(this.assetsDir, `tmp_${assetData.id}${assetData.ext}`);
                fs.writeFileSync(tmpPath, Buffer.from(assetData.content, 'base64'));
                const result = await this.importAsset(tmpPath, meta.type, meta.name);
                fs.unlinkSync(tmpPath);
                results.push(result);
            }
        } catch (e) {
            results.push({ success: false, error: (e as Error).message });
        }
        return results;
    }
}
