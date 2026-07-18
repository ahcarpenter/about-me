import { site } from "@/lib/site";
import { timedFetch } from "@/lib/http";
import { githubHeaders, getJson, resolveToken } from "@/lib/sources/github/client";
import {
  describeGithubEvent,
  type GithubEvent,
  type GithubFeedItem,
} from "@/lib/sources/github/events";

const API = "https://api.github.com";
const EVENTS_URL = `${API}/users/${site.githubUsername}/events/public?per_page=30`;
const EMPTY_SHA = "0000000000000000000000000000000000000000";

async function fetchEvents(token?: string): Promise<GithubEvent[]> {
  const res = await timedFetch(EVENTS_URL, { headers: githubHeaders(token) });
  if (!res.ok) throw new Error(`GitHub events responded ${res.status}`);
  return (await res.json()) as GithubEvent[];
}

/**
 * The public Events API has been stripped of the details the feed wants —
 * PushEvents no longer carry a commit count, and PullRequestEvents come back
 * without a title or URL. Backfill them at build time from authoritative
 * endpoints so describeGithubEvent has real data to render. Enrichment mutates
 * the event in place; any failed lookup just leaves the field absent, and
 * describeGithubEvent degrades gracefully.
 */
async function enrich(event: GithubEvent, token?: string): Promise<void> {
  const repo = event.repo?.name;
  if (!repo) return;

  if (event.type === "PushEvent") {
    const { before, head } = event.payload ?? {};
    // Branch creations and force pushes have no reachable before...head range.
    if (!head || !before || before === EMPTY_SHA) return;
    const compare = await getJson<{ total_commits?: number }>(
      `${API}/repos/${repo}/compare/${before}...${head}`,
      token,
    );
    if (compare?.total_commits != null) {
      event.payload = { ...event.payload, size: compare.total_commits };
    }
    return;
  }

  if (event.type === "PullRequestEvent") {
    const number = event.payload?.number;
    if (number == null) return;
    const pr = await getJson<{ title?: string; html_url?: string; merged?: boolean }>(
      `${API}/repos/${repo}/pulls/${number}`,
      token,
    );
    if (pr) {
      event.payload = {
        ...event.payload,
        pull_request: { ...event.payload?.pull_request, ...pr },
      };
    }
  }
}

/**
 * Fetch and describe recent GitHub activity at build time so it lands in the
 * static HTML with accurate push commit counts and pull-request titles. With
 * GITHUB_TOKEN set, uses the authenticated API (5,000 req/hr); without one it
 * still works via the unauthenticated API (60 req/hr per-IP). Returns [] if the
 * API is unreachable so the rest of the feed — and the build — carries on.
 */
export async function getGithubActivity(count = 10): Promise<GithubFeedItem[]> {
  try {
    const token = resolveToken("activity");
    const events = await fetchEvents(token);
    // Whether an event is shown depends only on its type/action, not on the
    // enriched fields, so pick the visible slice first and enrich just those.
    const shown = events.filter((e) => describeGithubEvent(e) !== null).slice(0, count);
    await Promise.all(shown.map((e) => enrich(e, token)));
    return shown
      .map(describeGithubEvent)
      .filter((item): item is GithubFeedItem => item !== null);
  } catch (err) {
    console.warn("[github] could not fetch activity:", err);
    return [];
  }
}
