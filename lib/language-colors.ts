/**
 * Brand colors for the language dot on repo cards. These are third-party brand
 * colors (as used by github-linguist), deliberately kept as sRGB hex rather than
 * promoted into the OKLCH design tokens in app/globals.css — they aren't part of
 * this site's palette, they just echo GitHub's.
 */
export const LANGUAGE_COLORS: Record<string, string> = {
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

/** The dot color for a repo's primary language, falling back to a neutral token. */
export function languageColor(language: string | null): string {
  return (language && LANGUAGE_COLORS[language]) || "var(--color-faint)";
}
