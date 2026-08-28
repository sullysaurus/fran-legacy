import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const dist = path.join(root, 'dist');
const failures = [];

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(target));
    else if (entry.name === 'index.html') files.push(target);
  }
  return files;
};

const pages = await walk(dist);
for (const file of pages) {
  const html = await readFile(file, 'utf8');
  const route = `/${path.relative(dist, path.dirname(file)).replaceAll(path.sep, '/')}`.replace('/.', '/');
  if (/<meta http-equiv="refresh"/i.test(html)) continue;
  const og = html.match(/<meta property="og:image" content="([^"]+)"/i)?.[1];
  const twitter = html.match(/<meta name="twitter:image" content="([^"]+)"/i)?.[1];
  const width = html.match(/<meta property="og:image:width" content="([^"]+)"/i)?.[1];
  const height = html.match(/<meta property="og:image:height" content="([^"]+)"/i)?.[1];
  const alt = html.match(/<meta property="og:image:alt" content="([^"]+)"/i)?.[1];
  if (!og || !twitter || !width || !height || !alt) {
    failures.push(`${route} is missing complete social image metadata.`);
    continue;
  }
  if (og !== twitter) failures.push(`${route} has mismatched Open Graph and Twitter images.`);
  if (width !== '1200' || height !== '630') failures.push(`${route} declares ${width}×${height}.`);
  try {
    const url = new URL(og);
    const imagePath = path.join(root, 'public', url.pathname.replace(/^\//, ''));
    const [metadata, fileInfo] = await Promise.all([sharp(imagePath).metadata(), stat(imagePath)]);
    if (metadata.width !== 1200 || metadata.height !== 630) failures.push(`${route} points to a non-1200×630 image.`);
    if (fileInfo.size === 0) failures.push(`${route} points to an empty image.`);
  } catch (error) {
    failures.push(`${route} points to a missing or invalid image: ${error.message}`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Built social metadata valid across ${pages.length} routes.`);
