import { describe, expect, it } from "vitest";
import { buildFeed, FEED_LIMIT, type FeedSources } from "./feed";

const empty: FeedSources = { github: [], substack: [], linkedin: [], reading: [] };

describe("buildFeed", () => {
  it("returns [] when every source is empty", () => {
    expect(buildFeed(empty)).toEqual([]);
  });

  it("normalizes each source into the FeedItem published language", () => {
    const feed = buildFeed({
      github: [{ date: "2026-01-01", title: "Pushed 2 commits to a/b", url: "https://gh" }],
      substack: [{ date: "2026-01-02", title: "My Post", link: "https://sub", excerpt: "" }],
      linkedin: [{ date: "2026-01-03", title: "Shared a post", url: "https://li", sample: true }],
      reading: [
        { date: "2026-01-04", title: "A Book", author: "An Author", url: "https://read" },
      ],
    });

    const bySource = Object.fromEntries(feed.map((i) => [i.source, i]));
    expect(bySource.github.title).toBe("Pushed 2 commits to a/b");
    expect(bySource.substack.title).toBe("Published “My Post”");
    expect(bySource.substack.url).toBe("https://sub");
    expect(bySource.linkedin.title).toBe("Shared a post");
    expect(bySource.linkedin.sample).toBe(true);
    expect(bySource.reading.title).toBe("Read “A Book” by An Author");
  });

  it("sorts newest-first across sources", () => {
    const feed = buildFeed({
      ...empty,
      github: [{ date: "2026-03-01", title: "old", url: "u" }],
      linkedin: [{ date: "2026-05-01", title: "new", url: "u" }],
      reading: [{ date: "2026-04-01", title: "mid", author: "a", url: "u" }],
    });
    expect(feed.map((i) => i.source)).toEqual(["linkedin", "reading", "github"]);
  });

  it("drops items without a date", () => {
    const feed = buildFeed({
      ...empty,
      github: [
        { date: "", title: "no date", url: "u" },
        { date: "2026-01-01", title: "has date", url: "u" },
      ],
    });
    expect(feed).toHaveLength(1);
    expect(feed[0].title).toBe("has date");
  });

  it("caps the merged feed at FEED_LIMIT", () => {
    const github = Array.from({ length: FEED_LIMIT + 10 }, (_, i) => ({
      date: `2026-01-${String((i % 28) + 1).padStart(2, "0")}`,
      title: `event ${i}`,
      url: "u",
    }));
    expect(buildFeed({ ...empty, github })).toHaveLength(FEED_LIMIT);
  });

  it("shows at most the four newest Substack posts", () => {
    const substack = Array.from({ length: 6 }, (_, i) => ({
      date: `2026-02-0${i + 1}`,
      title: `Post ${i}`,
      link: "u",
      excerpt: "",
    }));
    const feed = buildFeed({ ...empty, substack });
    expect(feed.filter((i) => i.source === "substack")).toHaveLength(4);
  });
});
