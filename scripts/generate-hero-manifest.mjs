import { readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const heroImagesDirectory = join(process.cwd(), 'assets', 'images', 'hero');
const manifestPath = join(heroImagesDirectory, 'manifest.json');
const supportedImageExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.webp']);

const files = await readdir(heroImagesDirectory, { withFileTypes: true });
const images = files
    .filter((file) => file.isFile() && supportedImageExtensions.has(file.name.slice(file.name.lastIndexOf('.')).toLowerCase()))
    .map((file) => file.name)
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' }))
    .map((fileName) => `./assets/images/hero/${encodeURIComponent(fileName)}`);

if (images.length === 0) {
    throw new Error(`No supported hero images found in ${heroImagesDirectory}.`);
}

await writeFile(manifestPath, `${JSON.stringify({ images }, null, 2)}\n`);
console.log(`Generated hero image manifest with ${images.length} image(s).`);
