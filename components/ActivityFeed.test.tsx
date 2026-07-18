// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import ActivityFeed from "./ActivityFeed";

afterEach(cleanup);

describe("ActivityFeed", () => {
  it("renders the curated sources even with no live activity passed in", () => {
    render(<ActivityFeed githubActivity={[]} substackPosts={[]} />);
    // reading + linkedin sample data is always merged into the feed
    expect(screen.getByText(/You and Your Research/)).toBeTruthy();
    expect(screen.getAllByText("sample").length).toBeGreaterThan(0);
  });

  it("shows the empty state when a filter matches nothing", () => {
    render(<ActivityFeed githubActivity={[]} substackPosts={[]} />);
    fireEvent.click(screen.getByRole("button", { name: "GitHub" }));
    expect(screen.getByText("Nothing here yet.")).toBeTruthy();
  });

  it("includes passed-in GitHub activity", () => {
    render(
      <ActivityFeed
        githubActivity={[
          { date: "2027-01-01T00:00:00Z", title: "Pushed 2 commits to a/b", url: "https://gh" },
        ]}
        substackPosts={[]}
      />,
    );
    expect(screen.getByText("Pushed 2 commits to a/b")).toBeTruthy();
  });
});
