import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const manifest = JSON.parse(await readFile(path.join(root, 'seo/social-share-images.json'), 'utf8'));
const failures = [];

if (manifest.width !== 1200 || manifest.height !== 630) failures.push('Manifest dimensions must be 1200×630.');
if (manifest.items.length !== 65) failures.push(`Expected 65 social images, found ${manifest.items.length}.`);

for (const item of manifest.items) {
  const imagePath = path.join(root, 'public', item.image.replace(/^\//, ''));
  try {
    const [metadata, file] = await Promise.all([sharp(imagePath).metadata(), stat(imagePath)]);
    if (metadata.width !== 1200 || metadata.height !== 630) failures.push(`${item.image} is ${metadata.width}×${metadata.height}.`);
    if (metadata.format !== 'jpeg') failures.push(`${item.image} is not JPEG.`);
    if (file.size > 700_000) failures.push(`${item.image} exceeds 700 KB.`);
  } catch (error) {
    failures.push(`Missing or unreadable image ${item.image}: ${error.message}`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Social image set valid: ${manifest.items.length} files at 1200×630.`);
