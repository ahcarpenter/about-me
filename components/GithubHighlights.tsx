import { site } from "@/lib/site";
import type { Repo } from "@/lib/github";

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

/**
 * Repo highlight cards, pre-rendered from data fetched at build time
 * (see lib/repos.ts). An empty list means the API was unreachable during
 * the build or there was nothing to show — either way, link out.
 */
export default function GithubHighlights({ repos }: { repos: Repo[] }) {
  if (repos.length === 0) {
    return (
      <a href={site.githubUrl} target="_blank" rel="noopener noreferrer" className="card block px-6 py-8 text-center">
        <p className="text-sm text-muted">
          Nothing to highlight just now — browse everything at{" "}
          <span className="font-medium text-accent">github.com/{site.githubUsername} ↗</span>
        </p>
      </a>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo) => (
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
          <div className="mt-4 flex items-center gap-4 font-mono text-xs text-muted">
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
    </div>
  );
}
