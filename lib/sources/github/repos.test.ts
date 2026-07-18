import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getRepoHighlights } from "./repos";

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return { ok, status, json: async () => body } as Response;
}

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("getRepoHighlights", () => {
  it("maps GraphQL nodes into the Repo shape when a token is set", async () => {
    vi.stubEnv("GITHUB_TOKEN", "t0ken");
    const node = {
      name: "about",
      url: "https://github.com/ahcarpenter/about",
      description: "personal site",
      stargazerCount: 5,
      forkCount: 1,
      primaryLanguage: { name: "TypeScript" },
      pushedAt: "2026-01-01T00:00:00Z",
      isArchived: false,
      isFork: false,
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ data: { user: { repositories: { nodes: [node] } } } }));
    vi.stubGlobal("fetch", fetchMock);

    const repos = await getRepoHighlights();

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/graphql");
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer t0ken");
    expect(repos).toEqual([
      {
        name: "about",
        html_url: "https://github.com/ahcarpenter/about",
        description: "personal site",
        stargazers_count: 5,
        forks_count: 1,
        language: "TypeScript",
        pushed_at: "2026-01-01T00:00:00Z",
        fork: false,
        archived: false,
      },
    ]);
  });

  it("returns [] when the GraphQL response carries errors", async () => {
    vi.stubEnv("GITHUB_TOKEN", "t0ken");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ errors: [{ message: "bad credentials" }] })),
    );
    expect(await getRepoHighlights()).toEqual([]);
  });

  it("falls back to the unauthenticated REST API when no token is set", async () => {
    vi.stubEnv("GITHUB_TOKEN", "");
    const restRepo = {
      name: "rest-repo",
      html_url: "https://github.com/ahcarpenter/rest-repo",
      description: null,
      stargazers_count: 3,
      forks_count: 0,
      language: "Go",
      pushed_at: "2026-02-01T00:00:00Z",
      fork: false,
      archived: false,
    };
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([restRepo]));
    vi.stubGlobal("fetch", fetchMock);

    const repos = await getRepoHighlights();

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/users/");
    expect(url).toContain("/repos");
    expect((init.headers as Record<string, string>).Authorization).toBeUndefined();
    expect(repos).toEqual([restRepo]);
  });

  it("returns [] when the API responds non-2xx", async () => {
    vi.stubEnv("GITHUB_TOKEN", "");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(null, false, 503)));
    expect(await getRepoHighlights()).toEqual([]);
  });

  it("returns [] when the request throws", async () => {
    vi.stubEnv("GITHUB_TOKEN", "");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    expect(await getRepoHighlights()).toEqual([]);
  });
});
