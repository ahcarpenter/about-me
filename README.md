# about

Personal site of [Andrew H. Carpenter](https://github.com/ahcarpenter) — built
with Next.js (App Router, static export) and Tailwind CSS v4, deployed to
GitHub Pages. Light-mode-only theme inspired by [conductor.build](https://conductor.build):
warm cream paper, serif display type (Fraunces), terracotta accent.

## Pages

- **/** — above-the-fold intro, a merged activity feed (GitHub · LinkedIn ·
  Substack · reading), GitHub project highlights, latest Substack posts, and
  LinkedIn recommendations.
- **/philosophy** — principles.
- **/story** — life story as a vertical timeline; dots mark each date/event
  and descriptions fade in to the right as you scroll.
- **/chat** — stubbed "chat with AI me" (canned responses for now).

## Where the data comes from

| Source | Mechanism |
| --- | --- |
| GitHub projects & activity | Fetched from the GitHub API at **build time** and baked into the static export — refreshed on every deploy, plus a weekly scheduled rebuild. Uses `GITHUB_TOKEN` when set (authenticated GraphQL / higher rate limits), falling back to the unauthenticated API otherwise |
| Substack posts | Fetched from the RSS feed at **build time** — refreshed on every deploy, plus a weekly scheduled rebuild |
| LinkedIn recommendations & activity | Curated by hand in [`data/linkedin.ts`](data/linkedin.ts) (LinkedIn has no public API for these) |
| Recent articles read | Curated by hand in [`data/reading.ts`](data/reading.ts) |

Entries flagged `sample: true` in the data files render with a small “sample”
badge — replace them with real content and drop the flag.

### Other knobs

- [`lib/site.ts`](lib/site.ts) — name, tagline, profile URLs.
- [`data/projects.ts`](data/projects.ts) — pin specific repos in the highlights
  grid (defaults to most-starred).
- [`data/timeline.ts`](data/timeline.ts) — life story events.
- [`data/principles.ts`](data/principles.ts) — the /philosophy principles.
- [`data/nav.ts`](data/nav.ts) — the header/footer page list.
- [`data/social.ts`](data/social.ts) — the "elsewhere" profile links.

## Develop

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # static export to ./out
pnpm test     # unit tests (Vitest)
pnpm lint     # ESLint
```

Optionally set `GITHUB_TOKEN` (see [`.env.example`](.env.example)) to fetch GitHub
data via the authenticated API at build time; without it the site still builds using
the unauthenticated API.

Pushing to `main` deploys via `.github/workflows/deploy.yml`.
