/**
 * GitHub anti-corruption layer — shared transport.
 *
 * Every GitHub fetcher (repos, activity) speaks to the API through these
 * helpers so the auth headers, token lookup, timeout, and soft-fail semantics
 * live in exactly one place.
 */
import { timedFetch } from "@/lib/http";

const ACCEPT = "application/vnd.github+json";

/** Standard GitHub API headers, adding bearer auth when a token is available. */
export function githubHeaders(token?: string): HeadersInit {
  return {
    Accept: ACCEPT,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Resolve the build-time GitHub token, warning when it's absent so the operator
 * knows why they're on the unauthenticated rate limit. `context` names the
 * fetcher for the log line (e.g. "repo highlights", "activity").
 */
export function resolveToken(context: string): string | undefined {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn(
      `[github] GITHUB_TOKEN not set — ${context} uses the unauthenticated API (60 req/hr per-IP limit)`,
    );
  }
  return token;
}

/** GET and parse JSON, returning undefined on any error or non-2xx (soft fail). */
export async function getJson<T>(url: string, token?: string): Promise<T | undefined> {
  try {
    const res = await timedFetch(url, { headers: githubHeaders(token) });
    if (!res.ok) return undefined;
    return (await res.json()) as T;
  } catch {
    return undefined;
  }
}
