/**
 * Pure helpers for the GitHub data the site fetches at build time.
 * Kept free of React (and of the network) so they can be unit-tested directly.
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
      // The Events API no longer returns a commit count in PushEvent payloads;
      // the build backfills `size` from the compare API (see lib/activity.ts).
      // When it's still missing (compare failed, force push), don't invent a
      // total — just say a push happened.
      const n = ev.payload?.size ?? ev.payload?.commits?.length;
      return n
        ? { ...base, title: `Pushed ${n} commit${n === 1 ? "" : "s"} to ${repo}` }
        : { ...base, title: `Pushed to ${repo}` };
    }
    case "CreateEvent":
      if (ev.payload?.ref_type === "repository")
        return { ...base, title: `Created repository ${repo}` };
      if (ev.payload?.ref_type === "branch")
        return { ...base, title: `Created branch ${ev.payload.ref} in ${repo}` };
      return null;
    case "PullRequestEvent": {
      const pr = ev.payload?.pull_request;
      // Merges arrive as action "merged" today; older payloads used "closed"
      // with pull_request.merged. We only surface opens and merges.
      const merged =
        ev.payload?.action === "merged" || (ev.payload?.action === "closed" && pr?.merged === true);
      const opened = ev.payload?.action === "opened";
      if (!merged && !opened) return null;
      const verb = merged ? "Merged" : "Opened";
      // The Events API no longer returns PR titles/URLs; the build backfills them
      // (see lib/activity.ts). Fall back to a title-less line if it's still absent.
      return {
        ...base,
        title: pr?.title ? `${verb} PR in ${repo}: ${pr.title}` : `${verb} a PR in ${repo}`,
        url: pr?.html_url ?? repoUrl,
      };
    }
    case "IssuesEvent": {
      if (ev.payload?.action !== "opened") return null;
      const issue = ev.payload?.issue;
      return {
        ...base,
        title: issue?.title ? `Opened issue in ${repo}: ${issue.title}` : `Opened an issue in ${repo}`,
        url: issue?.html_url ?? repoUrl,
      };
    }
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
