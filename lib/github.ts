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
  commit_count?: number;
};

/** The subset of a GitHub public-events payload the feed cares about. */
export type GithubEvent = {
  type?: string;
  created_at?: string;
  repo?: { name?: string };
  payload?: {
    size?: number;
    commits?: unknown[];
    ref?: string;
    ref_type?: string;
    action?: string;
    pull_request?: { title?: string; html_url?: string; merged?: boolean };
    issue?: { title?: string; html_url?: string };
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
      // The Events API truncates `commits` to 20 entries, so `size` is the only
      // reliable total for larger pushes; fall back to the array length.
      const n = ev.payload?.size ?? ev.payload?.commits?.length ?? 0;
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
