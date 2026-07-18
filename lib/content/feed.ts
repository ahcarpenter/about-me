/**
 * Content domain — the merged activity feed.
 *
 * The front page aggregates four upstream sources (GitHub, Substack, LinkedIn,
 * reading) into one chronological stream. Each source speaks its own shape;
 * buildFeed translates them all into the FeedItem "published language" so the
 * view only ever deals with one type. Pure — no React, no I/O — so it's
 * unit-testable and reusable outside the component.
 */
import type { SubstackPost } from "@/lib/sources/substack/substack";
import type { GithubFeedItem } from "@/lib/sources/github/events";
import type { LinkedInActivity } from "@/data/linkedin";
import type { ReadItem } from "@/data/reading";

export type Source = "github" | "linkedin" | "substack" | "reading";

/** The published language every source is normalized into for the merged feed. */
export type FeedItem = {
  source: Source;
  date: string;
  title: string;
  url: string;
  sample?: boolean;
};

/** Cap on merged feed items; the skeleton matches so content doesn't jump when it lands. */
export const FEED_LIMIT = 14;

/** Newest Substack posts shown in the feed (the Writing section shows the rest). */
const SUBSTACK_FEED_COUNT = 4;

export type FeedSources = {
  github: GithubFeedItem[];
  substack: SubstackPost[];
  linkedin: LinkedInActivity[];
  reading: ReadItem[];
};

/**
 * Merge every source into the FeedItem published language, drop dateless items,
 * sort newest-first, and cap at FEED_LIMIT.
 */
export function buildFeed({ github, substack, linkedin, reading }: FeedSources): FeedItem[] {
  const githubItems: FeedItem[] = github.map((i) => ({ ...i, source: "github" }));
  const substackItems: FeedItem[] = substack.slice(0, SUBSTACK_FEED_COUNT).map((p) => ({
    source: "substack",
    date: p.date,
    title: `Published “${p.title}”`,
    url: p.link,
  }));
  const linkedinItems: FeedItem[] = linkedin.map((a) => ({
    source: "linkedin",
    date: a.date,
    title: a.title,
    url: a.url,
    sample: a.sample,
  }));
  const readingItems: FeedItem[] = reading.map((r) => ({
    source: "reading",
    date: r.date,
    title: `Read “${r.title}” by ${r.author}`,
    url: r.url,
    sample: r.sample,
  }));

  return [...githubItems, ...substackItems, ...linkedinItems, ...readingItems]
    .filter((i) => i.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, FEED_LIMIT);
}
