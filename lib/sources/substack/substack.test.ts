import { describe, expect, it } from "vitest";
import { stripHtml, tag, truncate } from "./substack";

describe("tag", () => {
  it("extracts inner text of a tag", () => {
    expect(tag("<item><title>Hello</title></item>", "title")).toBe("Hello");
  });

  it("unwraps CDATA", () => {
    expect(tag("<title><![CDATA[Hi & bye]]></title>", "title")).toBe("Hi & bye");
  });

  it("ignores tag attributes", () => {
    expect(tag('<link rel="alt">https://x.test</link>', "link")).toBe("https://x.test");
  });

  it("returns empty string when the tag is missing", () => {
    expect(tag("<item></item>", "title")).toBe("");
  });
});

describe("stripHtml", () => {
  it("removes tags and collapses whitespace", () => {
    expect(stripHtml("<p>Hello  <b>world</b></p>\n<p>again</p>")).toBe("Hello world again");
  });

  it("decodes common named entities", () => {
    expect(stripHtml("a &amp; b &lt;c&gt; &quot;d&quot;&nbsp;e")).toBe('a & b <c> "d" e');
  });

  it("decodes decimal and hex numeric entities, including astral code points", () => {
    expect(stripHtml("&#8212; and &#x1F600;")).toBe("— and 😀");
  });
});

describe("truncate", () => {
  it("returns short text unchanged", () => {
    expect(truncate("short", 220)).toBe("short");
  });

  it("truncates long text with an ellipsis at the limit", () => {
    const long = "a".repeat(300);
    const out = truncate(long, 220);
    expect(out).toHaveLength(220);
    expect(out.endsWith("…")).toBe(true);
  });

  it("never splits surrogate pairs", () => {
    const out = truncate("😀".repeat(300), 220);
    expect(out).not.toContain("�");
    // Every remaining character is a whole emoji or the ellipsis.
    expect([...out].every((c) => c === "😀" || c === "…")).toBe(true);
  });
});
