import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getGithubActivity } from "./activity";
import type { GithubEvent } from "./events";

const EMPTY_SHA = "0000000000000000000000000000000000000000";

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return { ok, status, json: async () => body } as Response;
}

/** Route each fetch by URL fragment; anything unmatched 404s. */
function routeFetch(routes: Array<[string, Response]>) {
  return vi.fn(async (url: string) => {
    for (const [fragment, res] of routes) {
      if (url.includes(fragment)) return res;
    }
    return jsonResponse(null, false, 404);
  });
}

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.stubEnv("GITHUB_TOKEN", "t0ken");
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("getGithubActivity", () => {
  it("backfills a push commit count from the compare API", async () => {
    const events: GithubEvent[] = [
      {
        type: "PushEvent",
        created_at: "2026-01-01T00:00:00Z",
        repo: { name: "ahcarpenter/about" },
        payload: { before: "aaa", head: "bbb" },
      },
    ];
    vi.stubGlobal(
      "fetch",
      routeFetch([
        ["/events/public", jsonResponse(events)],
        ["/compare/", jsonResponse({ total_commits: 3 })],
      ]),
    );

    const feed = await getGithubActivity();
    expect(feed).toEqual([
      {
        date: "2026-01-01T00:00:00Z",
        title: "Pushed 3 commits to ahcarpenter/about",
        url: "https://github.com/ahcarpenter/about",
      },
    ]);
  });

  it("backfills a pull-request title and url", async () => {
    const events: GithubEvent[] = [
      {
        type: "PullRequestEvent",
        created_at: "2026-01-02T00:00:00Z",
        repo: { name: "ahcarpenter/about" },
        payload: { action: "opened", number: 7 },
      },
    ];
    vi.stubGlobal(
      "fetch",
      routeFetch([
        ["/events/public", jsonResponse(events)],
        [
          "/pulls/7",
          jsonResponse({ title: "Add a thing", html_url: "https://github.com/pr/7", merged: false }),
        ],
      ]),
    );

    const feed = await getGithubActivity();
    expect(feed[0].title).toBe("Opened PR in ahcarpenter/about: Add a thing");
    expect(feed[0].url).toBe("https://github.com/pr/7");
  });

  it("skips enrichment for branch-creation / force pushes (empty before SHA)", async () => {
    const events: GithubEvent[] = [
      {
        type: "PushEvent",
        created_at: "2026-01-03T00:00:00Z",
        repo: { name: "ahcarpenter/about" },
        payload: { before: EMPTY_SHA, head: "bbb" },
      },
    ];
    const fetchMock = routeFetch([["/events/public", jsonResponse(events)]]);
    vi.stubGlobal("fetch", fetchMock);

    const feed = await getGithubActivity();

    // Only the events request — no compare lookup for an unreachable range.
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(feed[0].title).toBe("Pushed to ahcarpenter/about");
  });

  it("degrades gracefully when enrichment soft-fails", async () => {
    const events: GithubEvent[] = [
      {
        type: "PushEvent",
        created_at: "2026-01-04T00:00:00Z",
        repo: { name: "ahcarpenter/about" },
        payload: { before: "aaa", head: "bbb" },
      },
    ];
    vi.stubGlobal(
      "fetch",
      routeFetch([
        ["/events/public", jsonResponse(events)],
        ["/compare/", jsonResponse(null, false, 500)],
      ]),
    );

    const feed = await getGithubActivity();
    expect(feed[0].title).toBe("Pushed to ahcarpenter/about");
  });

  it("returns [] when the events request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(null, false, 403)));
    expect(await getGithubActivity()).toEqual([]);
  });
});
