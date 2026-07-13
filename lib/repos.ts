import { site } from "@/lib/site";
import { pickHighlights, type Repo } from "@/lib/github";
import { pinnedRepos, highlightCount } from "@/data/projects";

const REPOS_URL = `https://api.github.com/users/${site.githubUsername}/repos?per_page=100&sort=pushed`;

/**
 * Fetch repo highlights from the GitHub API at build time (the site is a
 * static export), so visitors get pre-rendered cards instead of a client-side
 * fetch that burns the unauthenticated 60 req/hr per-IP rate limit. Highlights
 * refresh on every deploy. If the API is unreachable the site still builds —
 * the section falls back to linking straight to GitHub.
 */
export async function getRepoHighlights(): Promise<Repo[]> {
  try {
    const res = await fetch(REPOS_URL, {
      // Don't let a hung API hang the deploy — fail fast and fall back.
      signal: AbortSignal.timeout(10_000),
      headers: { accept: "application/vnd.github+json" },
    });
    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
    const repos = (await res.json()) as Repo[];
    return pickHighlights(repos, pinnedRepos, highlightCount);
  } catch (err) {
    console.warn(`[github] could not fetch ${REPOS_URL}:`, err);
    return [];
  }
}
