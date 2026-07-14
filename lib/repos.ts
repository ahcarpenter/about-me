import { site } from "@/lib/site";
import { pickHighlights, type Repo } from "@/lib/github";
import { pinnedRepos, highlightCount } from "@/data/projects";

const GQL_URL = "https://api.github.com/graphql";
const REST_URL = `https://api.github.com/users/${site.githubUsername}/repos?per_page=100&sort=pushed`;

// Single authenticated request: all repo metadata + commit counts in one shot.
// Costs 1 GraphQL point (vs. N+1 REST calls to get the same data).
const GQL_QUERY = `{
  user(login: "${site.githubUsername}") {
    repositories(first: 100, orderBy: {field: PUSHED_AT, direction: DESC}) {
      nodes {
        name
        url
        description
        stargazerCount
        forkCount
        primaryLanguage { name }
        pushedAt
        isArchived
        isFork
        defaultBranchRef {
          target {
            ... on Commit {
              history { totalCount }
            }
          }
        }
      }
    }
  }
}`;

type GqlRepoNode = {
  name: string;
  url: string;
  description: string | null;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: { name: string } | null;
  pushedAt: string;
  isArchived: boolean;
  isFork: boolean;
  defaultBranchRef: { target: { history: { totalCount: number } } | null } | null;
};

function mapNode(node: GqlRepoNode): Repo {
  return {
    name: node.name,
    html_url: node.url,
    description: node.description,
    stargazers_count: node.stargazerCount,
    forks_count: node.forkCount,
    language: node.primaryLanguage?.name ?? null,
    pushed_at: node.pushedAt,
    fork: node.isFork,
    archived: node.isArchived,
    commit_count: node.defaultBranchRef?.target?.history.totalCount,
  };
}

async function fetchViaGraphQL(token: string): Promise<Repo[]> {
  const res = await fetch(GQL_URL, {
    method: "POST",
    signal: AbortSignal.timeout(10_000),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({ query: GQL_QUERY }),
  });
  if (!res.ok) throw new Error(`GitHub GraphQL responded ${res.status}`);
  const json = (await res.json()) as {
    data?: { user?: { repositories?: { nodes: GqlRepoNode[] } } };
    errors?: unknown[];
  };
  if (json.errors) throw new Error(`GitHub GraphQL errors: ${JSON.stringify(json.errors)}`);
  return (json.data?.user?.repositories?.nodes ?? []).map(mapNode);
}

async function fetchViaREST(): Promise<Repo[]> {
  const res = await fetch(REST_URL, {
    signal: AbortSignal.timeout(10_000),
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub REST responded ${res.status}`);
  return (await res.json()) as Repo[];
}

/**
 * Fetch repo highlights at build time. With GITHUB_TOKEN set, uses a single
 * authenticated GraphQL request that also returns commit counts (5,000 points/hr).
 * Without a token, falls back to the unauthenticated REST API (no commit counts,
 * 60 req/hr per-IP limit). Either way, the site still builds if the API is down.
 */
export async function getRepoHighlights(): Promise<Repo[]> {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      console.warn(
        "[github] GITHUB_TOKEN not set — falling back to unauthenticated REST (no commit counts, 60 req/hr limit)",
      );
    }
    const repos = await (token ? fetchViaGraphQL(token) : fetchViaREST());
    return pickHighlights(repos, pinnedRepos, highlightCount);
  } catch (err) {
    console.warn("[github] could not fetch repo highlights:", err);
    return [];
  }
}
