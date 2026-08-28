import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const readJson = async (file) => JSON.parse(await readFile(path.join(root, file), 'utf8'));
const [config, queue, state, variations, research, competitors] = await Promise.all([
  readJson('seo/content-engine.json'),
  readJson('seo/keyword-seeds.json'),
  readJson('seo/content-state.json'),
  readJson('seo/keyword-variation-map.json'),
  readJson('seo/keywords-everywhere-research.json'),
  readJson('seo/competitor-research.json'),
]);

const failures = [];
const unique = (values, label) => {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  if (duplicates.length) failures.push(`Duplicate ${label}: ${[...new Set(duplicates)].join(', ')}`);
};

if (config.version !== 1) failures.push('Unsupported content-engine config version.');
if (queue.length !== 50) failures.push(`Expected 50 queue items, found ${queue.length}.`);
if (Object.keys(state).length !== 50) failures.push(`Expected 50 state items, found ${Object.keys(state).length}.`);
if (research.items.length !== 50) failures.push(`Expected 50 research items, found ${research.items.length}.`);
if (research.creditsUsedThisPass > 500) failures.push(`Research pass exceeded the approved 500-credit cap (${research.creditsUsedThisPass}).`);
if (competitors.competitors.length !== 3) failures.push('Expected Fran Legacy plus two competitors.');

unique(queue.map((item) => item.keyword.toLowerCase()), 'primary keyword');
unique(queue.map((item) => item.slug), 'slug');
unique(queue.map((item) => item.ownerUrl), 'owner URL');
unique(queue.map((item) => item.plannedPublishDate), 'planned publication date');

const commercialKeywords = new Set(competitors.commercialOpportunities.map((item) => item.keyword.toLowerCase()));
for (const item of queue) {
  if (commercialKeywords.has(item.keyword.toLowerCase())) failures.push(`Commercial keyword incorrectly assigned to a blog post: ${item.keyword}`);
  if (item.pageType !== 'article') failures.push(`Unexpected page type for ${item.slug}.`);
  if (item.status !== 'Drafted') failures.push(`Queue item is not drafted: ${item.slug}.`);
  if (!variations[item.keyword]) failures.push(`Missing variation-map owner for ${item.keyword}.`);
  if (variations[item.keyword]?.ownerUrl !== item.ownerUrl) failures.push(`Variation-map owner mismatch for ${item.keyword}.`);
}

const blogDirectory = path.join(root, config.content.directory);
const files = (await readdir(blogDirectory)).filter((file) => file.endsWith('.md'));
if (files.length !== 50) failures.push(`Expected 50 Markdown drafts, found ${files.length}.`);

for (const item of queue) {
  const filename = `${item.slug}.md`;
  if (!files.includes(filename)) {
    failures.push(`Missing draft: ${filename}`);
    continue;
  }
  const content = await readFile(path.join(blogDirectory, filename), 'utf8');
  const body = content.replace(/^---[\s\S]*?---\s*/, '');
  const words = body.match(/\b[\w’'-]+\b/g)?.length ?? 0;
  if (words < 500) failures.push(`Draft too short (${words} words): ${filename}`);
  if (!/draft:\s*true/.test(content)) failures.push(`Draft flag missing: ${filename}`);
  if (!/reviewRequired:\s*true/.test(content)) failures.push(`Human-review flag missing: ${filename}`);
  if (!content.includes(`targetKeyword: ${JSON.stringify(item.keyword)}`)) failures.push(`Target keyword mismatch: ${filename}`);
  if (!content.includes('Editorial status:')) failures.push(`Editorial warning missing: ${filename}`);
  if (/guaranteed funding|guaranteed return|will get you funded|nationwide lending/i.test(body)) failures.push(`Unsupported promise detected: ${filename}`);
}

for (const item of Object.values(state)) {
  if (!queue.some((queued) => queued.slug === item.slug)) failures.push(`State without queue item: ${item.slug}.`);
  if (item.status !== 'drafted' || item.approvedAt || item.publishedAt || item.verifiedLiveAt) failures.push(`Unsafe publication state for ${item.slug}.`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

const measured = queue.filter((item) => typeof item.volume === 'number').length;
const unmeasured = queue.length - measured;
const dateRange = `${queue[0].plannedPublishDate} to ${queue.at(-1).plannedPublishDate}`;
console.log(`SEO content engine valid: 50 drafted, 0 published, ${measured} measured, ${unmeasured} retained for business fit.`);
console.log(`Recommended twice-weekly review calendar: ${dateRange}. Commercial intent remains outside the blog queue.`);
