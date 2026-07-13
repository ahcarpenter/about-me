import { site } from "@/lib/site";
import { describeGithubEvent, type GithubEvent, type GithubFeedItem } from "@/lib/github";

const EVENTS_URL = `https://api.github.com/users/${site.githubUsername}/events/public?per_page=30`;

/**
 * Fetch recent public GitHub events at build time (the site is a static
 * export), so the activity feed is fully pre-rendered instead of hiding
 * behind a client-side fetch that burns the unauthenticated 60 req/hr
 * per-IP rate limit. Events refresh on every deploy — the weekly cron in
 * deploy.yml keeps them acceptably fresh. If the API is unreachable the
 * site still builds; the feed just links straight to GitHub.
 */
export async function getGithubEvents(): Promise<GithubFeedItem[]> {
  try {
    const res = await fetch(EVENTS_URL, {
      // Don't let a hung API hang the deploy — fail fast and fall back.
      signal: AbortSignal.timeout(10_000),
      headers: { accept: "application/vnd.github+json" },
    });
    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
    const events = (await res.json()) as GithubEvent[];
    return events
      .map(describeGithubEvent)
      .filter((item): item is GithubFeedItem => item !== null)
      .slice(0, 10);
  } catch (err) {
    console.warn(`[github] could not fetch ${EVENTS_URL}:`, err);
    return [];
  }
}
