"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { pinnedRepos, highlightCount } from "@/data/projects";

type Repo = {
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

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  Java: "#b07219",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  HTML: "#e34c26",
  CSS: "#663399",
  Shell: "#89e051",
  Elixir: "#6e4a7e",
};

function pickHighlights(repos: Repo[]): Repo[] {
  const eligible = repos.filter((r) => !r.fork && !r.archived);
  const byName = new Map(eligible.map((r) => [r.name.toLowerCase(), r]));
  const pinned = pinnedRepos
    .map((name) => byName.get(name.toLowerCase()))
    .filter((r): r is Repo => Boolean(r));
  const pinnedNames = new Set(pinned.map((r) => r.name));
  const rest = eligible
    .filter((r) => !pinnedNames.has(r.name))
    .sort(
      (a, b) =>
        b.stargazers_count - a.stargazers_count ||
        new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime(),
    );
  return [...pinned, ...rest].slice(0, highlightCount);
}

export default function GithubHighlights() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://api.github.com/users/${site.githubUsername}/repos?per_page=100&sort=pushed`, {
      headers: { accept: "application/vnd.github+json" },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: Repo[]) => {
        if (!cancelled) setRepos(pickHighlights(data));
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) {
    return (
      <a href={site.githubUrl} target="_blank" rel="noopener noreferrer" className="card block px-6 py-8 text-center">
        <p className="text-sm text-muted">
          Couldn’t reach the GitHub API just now — browse everything at{" "}
          <span className="font-medium text-accent">github.com/{site.githubUsername} ↗</span>
        </p>
      </a>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {repos === null &&
        Array.from({ length: highlightCount }).map((_, i) => (
          <div key={i} className="card animate-pulse px-5 py-5">
            <div className="h-4 w-2/3 rounded bg-line" />
            <div className="mt-3 h-3 w-full rounded bg-line" />
            <div className="mt-2 h-3 w-4/5 rounded bg-line" />
            <div className="mt-5 h-3 w-1/3 rounded bg-line" />
          </div>
        ))}

      {repos?.map((repo) => (
        <a
          key={repo.name}
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="card group flex flex-col px-5 py-5"
        >
          <h3 className="font-mono text-sm font-medium text-ink group-hover:text-accent transition-colors">
            {repo.name}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
            {repo.description ?? "No description yet — but the code speaks for itself."}
          </p>
          <div className="mt-4 flex items-center gap-4 font-mono text-xs text-faint">
            {repo.language && (
              <span className="inline-flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="h-2 w-2 rounded-full"
                  style={{ background: LANGUAGE_COLORS[repo.language] ?? "var(--color-faint)" }}
                />
                {repo.language}
              </span>
            )}
            {repo.stargazers_count > 0 && <span>★ {repo.stargazers_count}</span>}
            {repo.forks_count > 0 && <span>⑂ {repo.forks_count}</span>}
          </div>
        </a>
      ))}

      {repos !== null && repos.length === 0 && (
        <a
          href={site.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="card px-6 py-8 text-center text-sm text-muted sm:col-span-2 lg:col-span-3"
        >
          Nothing to highlight yet — see github.com/{site.githubUsername} ↗
        </a>
      )}
    </div>
  );
}
