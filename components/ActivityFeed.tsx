"use client";

import { useEffect, useMemo, useState } from "react";
import { site } from "@/lib/site";
import { linkedinActivity } from "@/data/linkedin";
import { recentReads } from "@/data/reading";
import type { SubstackPost } from "@/lib/substack";

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

const FILTERS: Array<{ key: Source | "all"; label: string }> = [
  { key: "all", label: "Everything" },
  { key: "github", label: "GitHub" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "substack", label: "Substack" },
  { key: "reading", label: "Reading" },
];

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const days = Math.round((Date.now() - then) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.round(days / 30)}mo ago`;
  return `${Math.round(days / 365)}y ago`;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function describeGithubEvent(ev: any): FeedItem | null {
  const repo: string = ev?.repo?.name ?? "";
  const repoUrl = `https://github.com/${repo}`;
  const base = { source: "github" as const, date: ev?.created_at ?? "", url: repoUrl };
  switch (ev?.type) {
    case "PushEvent": {
      const n = ev.payload?.commits?.length ?? 0;
      return { ...base, title: `Pushed ${n} commit${n === 1 ? "" : "s"} to ${repo}` };
    }
    case "CreateEvent":
      if (ev.payload?.ref_type === "repository")
        return { ...base, title: `Created repository ${repo}` };
      if (ev.payload?.ref_type === "branch")
        return { ...base, title: `Created branch ${ev.payload.ref} in ${repo}` };
      return null;
    case "PullRequestEvent": {
      const pr = ev.payload?.pull_request;
      const action = ev.payload?.action === "closed" && pr?.merged ? "Merged" : ev.payload?.action;
      if (action !== "opened" && action !== "Merged") return null;
      return {
        ...base,
        title: `${action === "Merged" ? "Merged" : "Opened"} PR in ${repo}: ${pr?.title ?? ""}`,
        url: pr?.html_url ?? repoUrl,
      };
    }
    case "IssuesEvent":
      if (ev.payload?.action !== "opened") return null;
      return {
        ...base,
        title: `Opened issue in ${repo}: ${ev.payload?.issue?.title ?? ""}`,
        url: ev.payload?.issue?.html_url ?? repoUrl,
      };
    case "WatchEvent":
      return { ...base, title: `Starred ${repo}` };
    case "ForkEvent":
      return { ...base, title: `Forked ${repo}` };
    case "ReleaseEvent":
      return {
        ...base,
        title: `Released ${ev.payload?.release?.tag_name ?? ""} of ${repo}`,
        url: ev.payload?.release?.html_url ?? repoUrl,
      };
    case "PublicEvent":
      return { ...base, title: `Open-sourced ${repo}` };
    default:
      return null;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default function ActivityFeed({ substackPosts }: { substackPosts: SubstackPost[] }) {
  const [githubItems, setGithubItems] = useState<FeedItem[] | null>(null);
  const [githubFailed, setGithubFailed] = useState(false);
  const [filter, setFilter] = useState<Source | "all">("all");

  useEffect(() => {
    let cancelled = false;
    fetch(`https://api.github.com/users/${site.githubUsername}/events/public?per_page=30`, {
      headers: { accept: "application/vnd.github+json" },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((events: unknown[]) => {
        if (cancelled) return;
        const items = events
          .map(describeGithubEvent)
          .filter((i): i is FeedItem => i !== null)
          .slice(0, 10);
        setGithubItems(items);
      })
      .catch(() => {
        if (!cancelled) {
          setGithubItems([]);
          setGithubFailed(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(() => {
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
    return [...(githubItems ?? []), ...substackItems, ...linkedinItems, ...readingItems]
      .filter((i) => i.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 14);
  }, [githubItems, substackPosts]);

  const visible = filter === "all" ? items : items.filter((i) => i.source === filter);
  const loading = githubItems === null;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full border px-3 py-1 font-mono text-xs tracking-wide transition-colors ${
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
        {loading &&
          Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="flex animate-pulse items-center gap-4 px-5 py-4">
              <span className="h-2 w-2 rounded-full bg-line" />
              <span className="h-3 flex-1 rounded bg-line" />
              <span className="h-3 w-14 rounded bg-line" />
            </li>
          ))}

        {!loading && visible.length === 0 && (
          <li className="px-5 py-8 text-center text-sm text-muted">
            Nothing here yet{filter === "github" && githubFailed ? " — couldn’t reach the GitHub API" : ""}.
          </li>
        )}

        {!loading &&
          visible.map((item, i) => (
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
                <span className="hidden shrink-0 font-mono text-xs text-faint sm:inline">
                  {SOURCE_META[item.source].label}
                </span>
                <span className="shrink-0 font-mono text-xs text-faint">
                  {relativeTime(item.date)}
                </span>
              </a>
            </li>
          ))}
      </ul>

      {githubFailed && !loading && (
        <p className="mt-3 font-mono text-xs text-faint">
          GitHub activity is unavailable right now —{" "}
          <a href={site.githubUrl} className="underline hover:text-accent" target="_blank" rel="noopener noreferrer">
            see it on github.com ↗
          </a>
        </p>
      )}
    </div>
  );
}
