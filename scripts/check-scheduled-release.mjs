import { readFile } from 'node:fs/promises';

const queue = JSON.parse(await readFile(new URL('../seo/keyword-seeds.json', import.meta.url), 'utf8'));
const parts = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).formatToParts(new Date());
const part = (type) => parts.find((item) => item.type === type)?.value ?? '';
const today = process.env.CONTENT_AS_OF_DATE || `${part('year')}-${part('month')}-${part('day')}`;
const due = queue.filter((item) => item.status === 'Scheduled' && item.plannedPublishDate === today);

console.log(`due=${due.length > 0}`);
console.log(`date=${today}`);
console.log(`count=${due.length}`);
