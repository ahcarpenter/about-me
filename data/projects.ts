/**
 * GitHub project highlights.
 *
 * The site fetches your public repos from the GitHub API at build time (see
 * lib/sources/github/repos.ts) and bakes them into the static export. By
 * default it shows your most-starred, recently-pushed work. To pin specific
 * repos (and control their order), list their names here — pinned repos appear
 * first, in this order, when they exist on the account.
 */
export const pinnedRepos: string[] = [
  // "my-favorite-repo",
  // "another-project",
];

/** How many highlight cards to show. */
export const highlightCount = 6;
