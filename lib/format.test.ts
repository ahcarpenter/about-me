import { describe, expect, it } from "vitest";
import { formatDate, relativeTime } from "@/lib/format";

const NOW = new Date("2026-07-13T12:00:00Z").getTime();
const daysAgo = (n: number) => new Date(NOW - n * 86_400_000).toISOString();

describe("relativeTime", () => {
  it("handles today and yesterday", () => {
    expect(relativeTime(daysAgo(0), NOW)).toBe("today");
    expect(relativeTime(daysAgo(1), NOW)).toBe("yesterday");
  });

  it("scales through days, months, and years", () => {
    expect(relativeTime(daysAgo(12), NOW)).toBe("12d ago");
    expect(relativeTime(daysAgo(90), NOW)).toBe("3mo ago");
    expect(relativeTime(daysAgo(730), NOW)).toBe("2y ago");
  });

  it("returns empty string for unparseable dates", () => {
    expect(relativeTime("not-a-date", NOW)).toBe("");
    expect(relativeTime("", NOW)).toBe("");
  });
});

describe("formatDate", () => {
  it("formats an ISO date", () => {
    expect(formatDate("2026-07-08T00:00:00Z")).toBe("Jul 8, 2026");
  });

  it("returns empty string for unparseable dates", () => {
    expect(formatDate("nope")).toBe("");
  });
});
