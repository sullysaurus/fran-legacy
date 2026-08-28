import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const publicDirectory = path.join(root, 'public');
const outputDirectory = path.join(publicDirectory, 'social');
const articleOutputDirectory = path.join(outputDirectory, 'blog');
const queue = JSON.parse(await readFile(path.join(root, 'seo/keyword-seeds.json'), 'utf8'));

const staticCards = [
  { route: '/admin/', file: 'admin.jpg', eyebrow: 'Admin workspace', title: 'Everything in one place.', detail: 'SEO · Content · Blog · Website', theme: 'admin' },
  { route: '/', file: 'home.jpg', eyebrow: 'Creative finance · Raleigh, NC', title: 'Build the kind of wealth that outlives you.', detail: 'Fran Legacy', theme: 'home', image: 'images/hero-neighborhood.jpg' },
  { route: '/about/', file: 'about.jpg', eyebrow: 'About Fran Legacy', title: 'Real estate strategy built for the long view.', detail: 'Clarity · Alignment · Legacy', theme: 'about', image: 'images/about-home.jpg' },
  { route: '/investments/', file: 'investments.jpg', eyebrow: 'Investment opportunities', title: 'Put capital to work with the whole deal in view.', detail: 'Real estate · Raleigh, NC', theme: 'investment', image: 'images/triangle-house.jpg' },
  { route: '/current-investments/', file: 'current-investments.jpg', eyebrow: 'Current investments', title: 'See the properties and strategies already in motion.', detail: 'Fran Legacy portfolio', theme: 'investment', image: 'images/watkinsdale.avif' },
  { route: '/private-money-lenders/', file: 'private-money-lenders.jpg', eyebrow: 'Private money lending', title: 'Evaluate the deal, the downside, and the path to repayment.', detail: 'Capital with disciplined underwriting', theme: 'private', image: 'images/triangle-house.jpg' },
  { route: '/emd-lending/', file: 'emd-lending.jpg', eyebrow: 'EMD & transactional lending', title: 'Bridge the gap between contract and close.', detail: 'Short-duration real estate funding', theme: 'emd', image: 'images/hero-neighborhood.jpg' },
  { route: '/emd-lending-form/', file: 'emd-lending-form.jpg', eyebrow: 'Funding request', title: 'Bring the complete transaction into focus.', detail: 'EMD · Double close · Transactional', theme: 'emd', image: 'images/hero-neighborhood.jpg' },
  { route: '/contact/', file: 'contact.jpg', eyebrow: 'Start a conversation', title: 'Tell us what you are working on.', detail: 'Fran Legacy · Raleigh, NC', theme: 'contact', image: 'images/about-home.jpg' },
  { route: '/brand/', file: 'brand.jpg', eyebrow: 'Fran Legacy brand kit', title: 'A visual system built beyond today.', detail: 'Logos · Social assets · Guidelines', theme: 'brand' },
  { route: '/blog/', file: 'blog.jpg', eyebrow: 'Fran Legacy field notes', title: 'Clear thinking for real deals.', detail: '50 articles · Tuesday and Thursday', theme: 'blog', image: 'images/hero-neighborhood.jpg' },
  { route: '/privacy/', file: 'privacy.jpg', eyebrow: 'Fran Legacy', title: 'Privacy policy', detail: 'How information is handled', theme: 'legal' },
  { route: '/terms/', file: 'terms.jpg', eyebrow: 'Fran Legacy', title: 'Terms of use', detail: 'Website information and conditions', theme: 'legal' },
  { route: '/seo-dashboard/', file: 'seo-dashboard.jpg', eyebrow: 'SEO intelligence', title: 'Competitor visibility and search opportunity map.', detail: 'Fran Legacy · Duckfund · Levine Capital', theme: 'dashboard' },
  { route: '/admin/content/', file: 'content-admin.jpg', eyebrow: 'Content operations', title: '50 posts already scheduled.', detail: 'Automatic Tuesday / Thursday publishing', theme: 'admin' },
];

const themeConfig = {
  home: { accent: '#58cce0', wash: '#061827' },
  about: { accent: '#78d4df', wash: '#0a2534' },
  investment: { accent: '#9bb64a', wash: '#10231f' },
  private: { accent: '#e2a35c', wash: '#241b16' },
  emd: { accent: '#58cce0', wash: '#082332' },
  contact: { accent: '#7ad8e3', wash: '#102734' },
  brand: { accent: '#58cce0', wash: '#071a2a' },
  blog: { accent: '#58cce0', wash: '#071c2b' },
  legal: { accent: '#a6b5bb', wash: '#0c1c27' },
  dashboard: { accent: '#58cce0', wash: '#071a2a' },
  admin: { accent: '#62d99a', wash: '#071a2a' },
  'Earnest money': { accent: '#58cce0', wash: '#082332' },
  'Transactional funding': { accent: '#a7ba55', wash: '#15251e' },
  'Private lending': { accent: '#e2a35c', wash: '#251b15' },
  'Deal analysis': { accent: '#a899e8', wash: '#1a1830' },
  'Creative acquisition': { accent: '#df7c75', wash: '#2b1718' },
};

const articleImages = {
  'Earnest money': 'images/hero-neighborhood.jpg',
  'Transactional funding': 'images/triangle-house.jpg',
  'Private lending': 'images/watkinsdale.avif',
  'Deal analysis': 'images/about-home.jpg',
  'Creative acquisition': 'images/hero-neighborhood.jpg',
};

const escapeXml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

const wordUnits = (word) => [...word].reduce((sum, character) => {
  if ('ilI1.,:;!|'.includes(character)) return sum + 0.4;
  if ('mwMWQO'.includes(character)) return sum + 1.25;
  if (character === ' ') return sum + 0.5;
  return sum + 0.82;
}, 0);

const wrapTitle = (title, maxUnits) => {
  const words = title.split(/\s+/);
  const lines = [];
  let line = '';
  let units = 0;
  for (const word of words) {
    const nextUnits = wordUnits(word) + (line ? 0.5 : 0);
    if (line && units + nextUnits > maxUnits) {
      lines.push(line);
      line = word;
      units = wordUnits(word);
    } else {
      line += `${line ? ' ' : ''}${word}`;
      units += nextUnits;
    }
  }
  if (line) lines.push(line);
  return lines;
};

const titleSettings = (title) => {
  if (title.length > 78) return { size: 47, lineHeight: 50, maxUnits: 19.5 };
  if (title.length > 58) return { size: 53, lineHeight: 56, maxUnits: 20.5 };
  if (title.length > 40) return { size: 61, lineHeight: 63, maxUnits: 21 };
  return { size: 70, lineHeight: 70, maxUnits: 21 };
};

const makeOverlay = ({ eyebrow, title, detail, theme, sequence }) => {
  const colors = themeConfig[theme] ?? themeConfig.brand;
  const settings = titleSettings(title);
  const lines = wrapTitle(title, settings.maxUnits).slice(0, 4);
  const titleStart = lines.length >= 4 ? 246 : lines.length === 3 ? 262 : 292;
  const titleSpans = lines.map((line, index) => `<tspan x="78" y="${titleStart + index * settings.lineHeight}">${escapeXml(line)}</tspan>`).join('');
  const number = sequence ? String(sequence).padStart(2, '0') : 'FL';
  return Buffer.from(`
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="${colors.wash}" stop-opacity="0.98"/>
          <stop offset="0.66" stop-color="${colors.wash}" stop-opacity="0.9"/>
          <stop offset="1" stop-color="${colors.wash}" stop-opacity="0.66"/>
        </linearGradient>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.55" stop-color="#071a2a" stop-opacity="0"/>
          <stop offset="1" stop-color="#071a2a" stop-opacity="0.72"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#shade)"/>
      <rect width="1200" height="630" fill="url(#fade)"/>
      <path d="M31 0V462M0 64H392M0 479C84 463 146 522 163 630M260 630V570H508" fill="none" stroke="${colors.accent}" stroke-width="1.2" opacity="0.9"/>
      <path d="M1018 0V134H1200M1112 630V522H1200" fill="none" stroke="${colors.accent}" stroke-width="1" opacity="0.45"/>
      <g transform="translate(78 62)" fill="none" stroke="${colors.accent}" stroke-width="2.4">
        <path d="M0 0h24v8H9v12h15v8H9v24H0V0Zm31 0h17v52H31V0Zm9 8v36"/>
      </g>
      <text x="147" y="86" fill="#fffdf8" font-family="Helvetica, Arial, sans-serif" font-size="14" font-weight="700" letter-spacing="4">FRAN LEGACY</text>
      <text x="78" y="183" fill="${colors.accent}" font-family="Helvetica, Arial, sans-serif" font-size="12" font-weight="600" letter-spacing="3.2">${escapeXml(eyebrow.toUpperCase())}</text>
      <text fill="#fffdf8" font-family="Georgia, Times New Roman, serif" font-size="${settings.size}" font-weight="400" letter-spacing="-1.6">${titleSpans}</text>
      <line x1="78" y1="548" x2="760" y2="548" stroke="#fffdf8" stroke-opacity="0.22"/>
      <text x="78" y="580" fill="#fffdf8" fill-opacity="0.68" font-family="Helvetica, Arial, sans-serif" font-size="12" letter-spacing="1.8">${escapeXml(detail.toUpperCase())}</text>
      <text x="1121" y="580" fill="${colors.accent}" font-family="Georgia, Times New Roman, serif" font-size="38" text-anchor="end">${number}</text>
    </svg>
  `);
};

const renderCard = async (card, destination) => {
  const background = card.image
    ? await sharp(path.join(publicDirectory, card.image)).resize(1200, 630, { fit: 'cover', position: 'centre' }).modulate({ saturation: 0.72, brightness: 0.83 }).toBuffer()
    : { create: { width: 1200, height: 630, channels: 3, background: themeConfig[card.theme]?.wash ?? '#071a2a' } };
  await sharp(background)
    .composite([{ input: makeOverlay(card), top: 0, left: 0 }])
    .jpeg({ quality: 88, chromaSubsampling: '4:4:4', mozjpeg: true })
    .toFile(destination);
};

await mkdir(articleOutputDirectory, { recursive: true });

const manifest = [];
for (const card of staticCards) {
  await renderCard(card, path.join(outputDirectory, card.file));
  manifest.push({ route: card.route, image: `/social/${card.file}`, title: card.title, alt: `${card.title} — Fran Legacy` });
}

for (const item of queue) {
  const file = `${item.slug}.jpg`;
  const card = {
    eyebrow: `${item.cluster} · ${item.intent}`,
    title: item.title,
    detail: `Publishes ${item.plannedPublishDate} · Fran Legacy field notes`,
    theme: item.cluster,
    image: articleImages[item.cluster],
    sequence: item.id,
  };
  await renderCard(card, path.join(articleOutputDirectory, file));
  manifest.push({ route: `/blog/${item.slug}/`, previewRoute: `/admin/content/${item.slug}/`, image: `/social/blog/${file}`, title: item.title, alt: `${item.title} — Fran Legacy field notes` });
}

await writeFile(path.join(root, 'seo/social-share-images.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), width: 1200, height: 630, format: 'image/jpeg', items: manifest }, null, 2)}\n`);
console.log(`Generated ${manifest.length} route-specific social share images.`);
