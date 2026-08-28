export const publishingTimeZone = 'America/New_York';

const dateKeyInTimeZone = (value: Date) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: publishingTimeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(value);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
};

export const publicationAsOfDate = process.env.CONTENT_AS_OF_DATE || dateKeyInTimeZone(new Date());

export const dateKey = (value: Date | string) => {
  if (typeof value === 'string') return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
};

export const isPublished = (plannedPublishDate: Date | string) => dateKey(plannedPublishDate) <= publicationAsOfDate;

export const formatPublicationDate = (value: Date | string, includeYear = true) => new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  month: 'short',
  day: 'numeric',
  ...(includeYear ? { year: 'numeric' } : {}),
}).format(new Date(`${dateKey(value)}T00:00:00Z`));

export const daysUntilPublication = (value: Date | string) => {
  const start = Date.parse(`${publicationAsOfDate}T00:00:00Z`);
  const end = Date.parse(`${dateKey(value)}T00:00:00Z`);
  return Math.max(0, Math.round((end - start) / 86_400_000));
};
