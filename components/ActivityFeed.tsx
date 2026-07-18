"use client";

import { useMemo, useState } from "react";
import { linkedinActivity } from "@/data/linkedin";
import { recentReads } from "@/data/reading";
import type { SubstackPost } from "@/lib/sources/substack/substack";
import type { GithubFeedItem } from "@/lib/sources/github/events";
import { relativeTime } from "@/lib/format";

type Source = "github" | "linkedin" | "substack" | "reading";

type FeedItem = {
  source: Source;
  date: string;
  title: string;
  url: string;
  sample?: boolean;
};

const SOURCE_META: Record<Source, { label: string; dot: string }> = {
  github: { label: "GitHub", dot: "var(--color-sage)" },
  linkedin: { label: "LinkedIn", dot: "#4a6c8c" },
  substack: { label: "Substack", dot: "var(--color-accent)" },
  reading: { label: "Reading", dot: "var(--color-gold)" },
};

/** Cap on merged feed items; the skeleton matches so content doesn't jump when it lands. */
const FEED_LIMIT = 14;

const FILTERS: Array<{ key: Source | "all"; label: string }> = [
  { key: "all", label: "Everything" },
  { key: "github", label: "GitHub" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "substack", label: "Substack" },
  { key: "reading", label: "Reading" },
];

export default function ActivityFeed({
  githubActivity,
  substackPosts,
}: {
  githubActivity: GithubFeedItem[];
  substackPosts: SubstackPost[];
}) {
  const [filter, setFilter] = useState<Source | "all">("all");

  const items = useMemo(() => {
    const githubItems: FeedItem[] = githubActivity.map((i) => ({
      ...i,
      source: "github" as const,
    }));
    const substackItems: FeedItem[] = substackPosts.slice(0, 4).map((p) => ({
      source: "substack",
      date: p.date,
      title: `Published “${p.title}”`,
      url: p.link,
    }));
    const linkedinItems: FeedItem[] = linkedinActivity.map((a) => ({
      source: "linkedin",
      date: a.date,
      title: a.title,
      url: a.url,
      sample: a.sample,
    }));
    const readingItems: FeedItem[] = recentReads.map((r) => ({
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
  }, [githubActivity, substackPosts]);

  const visible = filter === "all" ? items : items.filter((i) => i.source === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-x-2 gap-y-3">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`relative rounded-full border px-3 py-1.5 font-mono text-xs tracking-wide transition-[color,background-color,border-color,scale] before:absolute before:inset-x-0 before:-inset-y-1.5 before:content-[''] active:scale-[0.96] ${
              filter === f.key
                ? "border-accent bg-accent-soft text-accent-deep"
                : "border-line bg-surface text-muted hover:border-line-strong hover:text-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="card mt-5 divide-y divide-line overflow-hidden">
        {visible.length === 0 && (
          <li className="px-5 py-8 text-center text-sm text-muted">Nothing here yet.</li>
        )}

        {visible.map((item, i) => (
          <li key={`${item.source}-${item.date}-${i}`}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-baseline gap-4 px-5 py-4 transition-colors hover:bg-cream/60"
            >
              <span
                aria-hidden
                className="relative top-[-1px] h-2 w-2 shrink-0 self-center rounded-full"
                style={{ background: SOURCE_META[item.source].dot }}
              />
              <span className="min-w-0 flex-1 text-sm leading-snug text-ink">
                <span className="group-hover:underline decoration-line underline-offset-4">
                  {item.title}
                </span>
                {item.sample && <span className="chip ml-2 align-middle">sample</span>}
              </span>
              <span className="hidden shrink-0 font-mono text-xs text-muted sm:inline">
                {SOURCE_META[item.source].label}
              </span>
              <span className="shrink-0 font-mono text-xs text-muted">
                {relativeTime(item.date)}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
