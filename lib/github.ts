/**
 * Pure helpers for the GitHub REST data the site fetches client-side.
 * Kept free of React so they can be unit-tested directly.
 */

export type Repo = {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

/** The subset of a GitHub public-events payload the feed cares about. */
export type GithubEvent = {
  type?: string;
  created_at?: string;
  repo?: { name?: string };
  payload?: {
    size?: number;
    commits?: unknown[];
    before?: string;
    head?: string;
    ref?: string;
    ref_type?: string;
    action?: string;
    number?: number;
    pull_request?: { title?: string; html_url?: string; merged?: boolean; number?: number };
    issue?: { title?: string; html_url?: string; number?: number };
    release?: { tag_name?: string; html_url?: string };
  };
};

export type GithubFeedItem = {
  date: string;
  title: string;
  url: string;
};

/** Turn a public event into a human-readable feed line, or null to skip it. */
export function describeGithubEvent(ev: GithubEvent): GithubFeedItem | null {
  const repo = ev.repo?.name ?? "";
  const repoUrl = `https://github.com/${repo}`;
  const base = { date: ev.created_at ?? "", url: repoUrl };
  switch (ev.type) {
    case "PushEvent": {
      // Public-events PushEvent payloads no longer include commit details —
      // just before/head/ref — so a count is often unavailable. When `size`
      // (or a legacy `commits` array) is present use it; otherwise don't
      // claim a number. `commits` also truncates at 20, so prefer `size`.
      const p = ev.payload;
      const n = p?.size ?? p?.commits?.length ?? 0;
      const url =
        p?.before && p?.head
          ? `https://github.com/${repo}/compare/${p.before}...${p.head}`
          : repoUrl;
      const title =
        n > 0 ? `Pushed ${n} commit${n === 1 ? "" : "s"} to ${repo}` : `Pushed to ${repo}`;
      return { ...base, title, url };
    }
    case "CreateEvent":
      if (ev.payload?.ref_type === "repository")
        return { ...base, title: `Created repository ${repo}` };
      if (ev.payload?.ref_type === "branch")
        return { ...base, title: `Created branch ${ev.payload.ref} in ${repo}` };
      return null;
    case "PullRequestEvent": {
      // Slim public payloads report `action: "merged"` directly and strip the
      // PR down to numbers/refs (no title, html_url, or merged flag); legacy
      // payloads use "closed" + merged. Handle both, labelling by #number
      // when the title is gone.
      const pr = ev.payload?.pull_request;
      const merged =
        ev.payload?.action === "merged" || (ev.payload?.action === "closed" && pr?.merged);
      if (ev.payload?.action !== "opened" && !merged) return null;
      const number = ev.payload?.number ?? pr?.number;
      const label = pr?.title ?? (number != null ? `#${number}` : "");
      return {
        ...base,
        title: `${merged ? "Merged" : "Opened"} PR in ${repo}${label ? `: ${label}` : ""}`,
        url: pr?.html_url ?? (number != null ? `${repoUrl}/pull/${number}` : repoUrl),
      };
    }
    case "IssuesEvent": {
      if (ev.payload?.action !== "opened") return null;
      const issue = ev.payload?.issue;
      const label = issue?.title ?? (issue?.number != null ? `#${issue.number}` : "");
      return {
        ...base,
        title: `Opened issue in ${repo}${label ? `: ${label}` : ""}`,
        url:
          issue?.html_url ?? (issue?.number != null ? `${repoUrl}/issues/${issue.number}` : repoUrl),
      };
    }
    case "WatchEvent":
      return { ...base, title: `Starred ${repo}` };
    case "ForkEvent":
      return { ...base, title: `Forked ${repo}` };
    case "ReleaseEvent": {
      const tag = ev.payload?.release?.tag_name;
      return {
        ...base,
        title: tag ? `Released ${tag} of ${repo}` : `Published a release of ${repo}`,
        url: ev.payload?.release?.html_url ?? repoUrl,
      };
    }
    case "PublicEvent":
      return { ...base, title: `Open-sourced ${repo}` };
    default:
      return null;
  }
}

/**
 * Pick repos to highlight: pinned names first (in the given order), then the
 * rest by stars and recency. Forks and archived repos never qualify.
 */
export function pickHighlights(repos: Repo[], pinned: string[], count: number): Repo[] {
  const eligible = repos.filter((r) => !r.fork && !r.archived);
  const byName = new Map(eligible.map((r) => [r.name.toLowerCase(), r]));
  const picked = pinned
    .map((name) => byName.get(name.toLowerCase()))
    .filter((r): r is Repo => Boolean(r));
  const pickedNames = new Set(picked.map((r) => r.name));
  const rest = eligible
    .filter((r) => !pickedNames.has(r.name))
    .sort(
      (a, b) =>
        b.stargazers_count - a.stargazers_count ||
        new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime(),
    );
  return [...picked, ...rest].slice(0, count);
}
