/**
 * Shared HTTP plumbing for the build-time content fetchers (the anti-corruption
 * layers under lib/sources). Every upstream fetch fails fast so a hung or slow
 * source can never hang the deploy — the caller then falls back to empty data.
 */

/** Abort budget for any single upstream request. */
export const TIMEOUT_MS = 10_000;

/** fetch() with the standard abort timeout applied (ours always wins over init). */
export function timedFetch(url: string, init: RequestInit = {}): Promise<Response> {
  return fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
}
