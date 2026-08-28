# SEO intelligence SaaS plan

## Product thesis

Turn a company domain, two or more competitor domains, and a small set of verified business facts into an evidence-led search opportunity map.

The product should help a user answer four questions:

1. Where does my domain stand today?
2. Which search territories do competitors own?
3. Which commercial pages and articles should I create?
4. What can I safely draft, review, and publish next?

The Fran Legacy dashboard is the reference fixture. It demonstrates the complete white-glove outcome: live keyword research, competitor comparison, commercial-page ownership, a non-cannibalizing 50-topic queue, complete working drafts, and a visible review boundary.

## Recommended market entry

Do not begin with a large recurring product. Validate willingness to pay with a free diagnostic, a paid one-time unlock, and a white-glove implementation.

### Phase 1 packaging

| Offer | Price | What the customer receives | Purpose |
| --- | ---: | --- | --- |
| Free Search Signal Scan | $0 | One domain, two competitors, baseline status, three gaps, and three article ideas | Lead generation and product education |
| Opportunity Map | $249 one time | Full competitor snapshot, up to 50 keyword opportunities, intent clusters, and downloadable report | Tests self-serve willingness to pay |
| Content Blueprint | $1,500 one time | Opportunity Map plus page ownership, 50 briefs, editorial order, and claim-review checklist | Productized strategy service |
| Custom SEO Dashboard | $3,500 one time | Live domain and competitor research, keyword gaps, commercial-page opportunities, 50 prioritized ideas, and a strategy walkthrough | Lower-risk sales-led entry point; credit the fee toward implementation for 30 days |
| White-glove Content Engine | $10,000–$15,000 setup | Custom dashboard, 50 drafts, repository/CMS implementation, validation, and measurement plan | High-value sales-led implementation |
| Managed Search Equity | $1,500–$3,500/month | Research refreshes, publishing, optimization, reporting, and new content | Recurring service after implementation |

After at least ten paid customers reveal repeat usage, introduce subscriptions:

- **Pro, about $149/month:** one project, three competitors, monthly refresh, 50 tracked opportunities, 10 briefs, and five draft credits.
- **Growth, about $399/month:** five projects, Search Console and analytics, 250 tracked opportunities, 30 draft credits, team approvals, and exports.
- **Agency, about $899/month:** 15 projects, white-label reports, reusable templates, client access, 75 draft credits, and priority processing.
- **White glove:** custom implementation and managed service remain sales-led.

The primary value metric should be **active domains/projects plus research and draft usage**. Seats are secondary because adding a teammate does not create the core value.

## Freemium boundary

The free experience must be useful without giving away the complete paid artifact.

### Show without an email

- Whether the domain has a detectable ranking footprint
- One competitor comparison summary
- Three keyword or page gaps
- Three article ideas
- A clear explanation of data limitations

### Unlock with an email

- Ten opportunity rows
- The full two-competitor chart
- A shareable report link with a seven-day expiration
- One exported summary

### Paid unlock

- All researched opportunities
- Intent clustering and canonical page ownership
- Commercial-page opportunities separated from articles
- Briefs, content calendar, and exports
- Saved projects and refresh history
- Draft generation credits
- Search Console and analytics connections

Do not put complete article drafts in the free plan. Ideas and a short brief demonstrate value while preserving a natural reason to upgrade.

## Next.js and Vercel architecture

Use the Next.js App Router on Vercel.

### Suggested services

- **Application:** Next.js, TypeScript, server components for reports, client components only for filters and editors
- **Database:** Postgres through Neon, Supabase, or Vercel Postgres
- **Authentication:** Clerk, Auth.js, or Supabase Auth
- **Billing:** Stripe subscriptions plus usage-credit packs
- **Background jobs:** Inngest, Trigger.dev, or Upstash QStash for crawling, keyword jobs, and draft generation
- **File storage:** Vercel Blob or S3-compatible storage for exports and report assets
- **Email:** Resend for scan delivery, demo links, and lifecycle messages
- **Analytics:** PostHog plus product events written to the application database
- **Keyword data:** Keywords Everywhere behind server-only jobs with a per-run credit budget
- **Search data:** Google Search Console and GA4 OAuth for paid workspaces
- **Content generation:** an LLM API behind a claim-aware drafting pipeline; no direct client-side calls

### Core data model

- `users`
- `organizations`
- `memberships`
- `projects`
- `domains`
- `competitors`
- `research_runs`
- `keyword_metrics`
- `domain_rankings`
- `intent_clusters`
- `page_opportunities`
- `content_items`
- `draft_versions`
- `verified_facts`
- `prohibited_claims`
- `demo_reports`
- `share_links`
- `integrations`
- `usage_ledger`
- `subscriptions`

Every metric row should retain source, country, currency, collection date, and research-run ID. `null` must mean “not queried”; `0` must remain a measured zero.

## Application routes

### Public and self-serve

- `/` — product landing page
- `/scan` — free domain input
- `/scan/[runId]` — progress and partial result
- `/report/[shareSlug]` — shareable report
- `/pricing` — plan comparison
- `/login` and `/signup`

### Customer application

- `/app` — project list
- `/app/projects/new`
- `/app/projects/[projectId]/overview`
- `/app/projects/[projectId]/competition`
- `/app/projects/[projectId]/opportunities`
- `/app/projects/[projectId]/content`
- `/app/projects/[projectId]/drafts/[contentId]`
- `/app/projects/[projectId]/integrations`
- `/app/projects/[projectId]/settings`

### Internal demo builder

- `/admin/demos`
- `/admin/demos/new`
- `/admin/demos/[demoId]`
- `/admin/demos/[demoId]/preview`
- `/demo/[shareSlug]`

Protect `/admin/*` with an explicit admin role. Public demo links should use unguessable slugs, support expiration and revocation, carry `noindex`, and never expose private credentials or raw integration data.

## Quick-demo workflow

`/admin/demos/new` should be optimized for a ten-minute sales workflow.

### Step 1: Prospect

- Company name
- Primary domain
- Up to three competitor domains
- Country and market
- Optional logo and brand color

### Step 2: Business truth

- Primary audience
- Services or products
- Conversion action
- Verified facts
- Claims that must not be generated

### Step 3: Research budget

- Quick preview: top 10 domain keywords and 20 keyword ideas
- Standard demo: top 40 domain keywords and 50 keyword ideas
- White-glove preview: custom budget with an approval warning

Show the expected data-credit and generation cost before the job runs.

### Step 4: Generate and edit

- Baseline cards
- Competitor comparison
- Commercial keyword gaps
- Article ideas
- Draft packaging recommendation
- Manual override for titles, notes, and suppressed keywords

### Step 5: Share

- Custom share slug
- “Prepared for” name
- Expiration date
- Optional call-booking URL
- Optional price/package displayed
- Watermark for free previews

### Step 6: Convert

An admin can convert a demo into a real organization and project without rerunning research. The prospect receives an account invitation and the existing report becomes the project baseline.

## Research pipeline

1. Normalize and validate domains.
2. Protect all server-side fetching against SSRF; block private IP ranges, metadata endpoints, local hosts, unsupported schemes, and redirect escapes.
3. Crawl the public site for title, headings, service language, sitemap, robots policy, and existing content.
4. Collect the domain ranking sample for the customer and competitors.
5. Expand carefully chosen seed terms within a visible credit budget.
6. Retrieve keyword metrics.
7. Normalize variants into intents.
8. Assign one canonical owner per intent.
9. Separate commercial pages from informational articles.
10. Score opportunities by evidence, demand, business value, page fit, competition, and effort.
11. Generate the dashboard snapshot.
12. Generate briefs or drafts only after the queue is locked.

The product must never label paid-ad competition as organic difficulty, promise rankings, or turn every keyword variation into a separate page.

## Drafting and publishing boundary

Article generation should use a project-level fact file similar to `seo/content-engine.json`:

- verified facts
- prohibited claims
- markets
- voice
- conversion paths
- existing page ownership
- legal or compliance notes

Drafts should include source plans and review flags. Automatic publishing should not be in the MVP. First support export to Markdown, Google Docs, WordPress draft, or webhook. Add scheduled publishing only after approvals, version history, and rollback are dependable.

## MVP scope

Build only:

- Domain and competitor input
- Public-site crawl
- Capped keyword research
- Competitor chart
- Opportunity clustering
- Commercial-versus-article ownership
- Three free ideas and a paid full report
- Admin demo builder
- Share links
- Stripe one-time unlock
- Markdown/CSV export

Defer:

- Full CMS publishing
- Search Console and GA4
- Multi-seat collaboration
- White-label custom domains
- Rank tracking history
- Automated internal linking
- Large-scale draft generation
- Agency client portals

## Success metrics

- Scan completion rate
- Anonymous scan to email conversion
- Email unlock to paid Opportunity Map conversion
- Paid map to booked consultation conversion
- White-glove close rate
- Median time to first result
- Data and generation cost per completed scan
- Percentage of suggested opportunities a user keeps
- Percentage of demos converted into projects
- 30- and 90-day project return rate

## Next implementation step

Create a separate Next.js repository and import the Fran Legacy research JSON as the first fixture. Build `/demo/fran-legacy` and `/admin/demos/new` before adding self-serve billing. If the admin workflow cannot create a persuasive prospect demo in ten minutes, the product is not yet ready for freemium traffic.
