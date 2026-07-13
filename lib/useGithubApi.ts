"use client";

import { useEffect, useState } from "react";

/**
 * Fetch a GitHub REST endpoint in the browser. `data` is null while loading;
 * `failed` flips instead of throwing so callers can render a fallback.
 */
export function useGithubApi<T>(path: string): { data: T | null; failed: boolean } {
  const [data, setData] = useState<T | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://api.github.com${path}`, {
      headers: { accept: "application/vnd.github+json" },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json: T) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  return { data, failed };
}
