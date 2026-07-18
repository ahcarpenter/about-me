// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import GithubHighlights from "./GithubHighlights";
import type { Repo } from "@/lib/sources/github/events";

afterEach(cleanup);

const repo: Repo = {
  name: "about",
  html_url: "https://github.com/ahcarpenter/about",
  description: "personal site",
  stargazers_count: 12,
  forks_count: 2,
  language: "TypeScript",
  pushed_at: "2026-01-01T00:00:00Z",
  fork: false,
  archived: false,
};

describe("GithubHighlights", () => {
  it("renders a card per repo with its metadata", () => {
    render(<GithubHighlights repos={[repo]} />);
    expect(screen.getByText("about")).toBeTruthy();
    expect(screen.getByText("personal site")).toBeTruthy();
    expect(screen.getByText("TypeScript")).toBeTruthy();
    expect(screen.getByText("★ 12")).toBeTruthy();
  });

  it("renders a link-out fallback when there are no repos", () => {
    render(<GithubHighlights repos={[]} />);
    expect(screen.getByText(/Nothing to highlight just now/)).toBeTruthy();
  });
});
