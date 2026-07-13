import { describe, expect, it } from "vitest";
import { describeGithubEvent, pickHighlights, type GithubEvent, type Repo } from "@/lib/github";

function repo(overrides: Partial<Repo>): Repo {
  return {
    name: "repo",
    html_url: "https://github.com/u/repo",
    description: null,
    stargazers_count: 0,
    forks_count: 0,
    language: null,
    pushed_at: "2026-01-01T00:00:00Z",
    fork: false,
    archived: false,
    ...overrides,
  };
}

describe("describeGithubEvent", () => {
  const base: GithubEvent = { repo: { name: "u/repo" }, created_at: "2026-07-01T00:00:00Z" };

  it("describes pushes with commit count and pluralization", () => {
    expect(
      describeGithubEvent({ ...base, type: "PushEvent", payload: { commits: [{}] } })?.title,
    ).toBe("Pushed 1 commit to u/repo");
    expect(
      describeGithubEvent({ ...base, type: "PushEvent", payload: { commits: [{}, {}] } })?.title,
    ).toBe("Pushed 2 commits to u/repo");
  });

  it("falls back to countless phrasing when the payload omits commits", () => {
    expect(describeGithubEvent({ ...base, type: "PushEvent", payload: {} })?.title).toBe(
      "Pushed to u/repo",
    );
    expect(describeGithubEvent({ ...base, type: "PushEvent", payload: { size: 3 } })?.title).toBe(
      "Pushed 3 commits to u/repo",
    );
  });

  it("describes repository and branch creation, skips tags", () => {
    expect(
      describeGithubEvent({ ...base, type: "CreateEvent", payload: { ref_type: "repository" } })
        ?.title,
    ).toBe("Created repository u/repo");
    expect(
      describeGithubEvent({
        ...base,
        type: "CreateEvent",
        payload: { ref_type: "branch", ref: "main" },
      })?.title,
    ).toBe("Created branch main in u/repo");
    expect(
      describeGithubEvent({ ...base, type: "CreateEvent", payload: { ref_type: "tag" } }),
    ).toBeNull();
  });

  it("reports opened and merged PRs, skips closed-unmerged", () => {
    const pr = { title: "Fix", html_url: "https://github.com/u/repo/pull/1" };
    expect(
      describeGithubEvent({
        ...base,
        type: "PullRequestEvent",
        payload: { action: "opened", pull_request: pr },
      }),
    ).toMatchObject({ title: "Opened PR in u/repo: Fix", url: pr.html_url });
    expect(
      describeGithubEvent({
        ...base,
        type: "PullRequestEvent",
        payload: { action: "closed", pull_request: { ...pr, merged: true } },
      })?.title,
    ).toBe("Merged PR in u/repo: Fix");
    expect(
      describeGithubEvent({
        ...base,
        type: "PullRequestEvent",
        payload: { action: "closed", pull_request: { ...pr, merged: false } },
      }),
    ).toBeNull();
  });

  it("only reports opened issues", () => {
    const issue = { title: "Bug", html_url: "https://github.com/u/repo/issues/1" };
    expect(
      describeGithubEvent({ ...base, type: "IssuesEvent", payload: { action: "opened", issue } }),
    ).toMatchObject({ title: "Opened issue in u/repo: Bug", url: issue.html_url });
    expect(
      describeGithubEvent({ ...base, type: "IssuesEvent", payload: { action: "closed", issue } }),
    ).toBeNull();
  });

  it("ignores unknown event types", () => {
    expect(describeGithubEvent({ ...base, type: "GollumEvent" })).toBeNull();
    expect(describeGithubEvent({})).toBeNull();
  });
});

describe("pickHighlights", () => {
  it("excludes forks and archived repos", () => {
    const picked = pickHighlights(
      [repo({ name: "a", fork: true }), repo({ name: "b", archived: true }), repo({ name: "c" })],
      [],
      6,
    );
    expect(picked.map((r) => r.name)).toEqual(["c"]);
  });

  it("puts pinned repos first in the given order, case-insensitively", () => {
    const picked = pickHighlights(
      [
        repo({ name: "popular", stargazers_count: 99 }),
        repo({ name: "Pinned-Two" }),
        repo({ name: "pinned-one" }),
      ],
      ["pinned-one", "PINNED-TWO"],
      6,
    );
    expect(picked.map((r) => r.name)).toEqual(["pinned-one", "Pinned-Two", "popular"]);
  });

  it("sorts the rest by stars, then recency, and caps the count", () => {
    const picked = pickHighlights(
      [
        repo({ name: "old", stargazers_count: 5, pushed_at: "2020-01-01T00:00:00Z" }),
        repo({ name: "new", stargazers_count: 5, pushed_at: "2026-01-01T00:00:00Z" }),
        repo({ name: "starred", stargazers_count: 10 }),
      ],
      [],
      2,
    );
    expect(picked.map((r) => r.name)).toEqual(["starred", "new"]);
  });

  it("ignores pinned names that do not exist", () => {
    expect(pickHighlights([repo({ name: "real" })], ["ghost"], 6).map((r) => r.name)).toEqual([
      "real",
    ]);
  });
});
