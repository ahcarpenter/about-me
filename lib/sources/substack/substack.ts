import { site } from "@/lib/site";
import { timedFetch } from "@/lib/http";

export type SubstackPost = {
  title: string;
  link: string;
  /** ISO date string. */
  date: string;
  excerpt: string;
};

const FEED_URL = `${site.substackUrl}/feed`;

/** Pull a single tag's inner text, unwrapping CDATA. */
export function tag(block: string, name: string): string {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  if (!m) return "";
  return m[1].replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, "$1").trim();
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Truncate by code point so astral characters (emoji, etc.) never split. */
export function truncate(text: string, max: number): string {
  const points = [...text];
  if (points.length <= max) return text;
  return `${points.slice(0, max - 1).join("")}…`;
}

/**
 * Fetch recent Substack posts from the publication's RSS feed.
 *
 * This runs at build time (the site is a static export), so the list
 * refreshes on every deploy. If the feed is unreachable the site still
 * builds — sections fall back to linking straight to Substack.
 */
export async function getSubstackPosts(limit = 6): Promise<SubstackPost[]> {
  try {
    // Don't let a hung feed hang the deploy — timedFetch fails fast and we fall back.
    const res = await timedFetch(FEED_URL, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; about-me-site/1.0; +" + site.githubUrl + ")",
        accept: "application/rss+xml, application/xml, text/xml, */*",
      },
    });
    if (!res.ok) throw new Error(`feed responded ${res.status}`);
    const xml = await res.text();

    const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
    const posts = items.slice(0, limit).map((item): SubstackPost => {
      const pubDate = tag(item, "pubDate");
      const description = stripHtml(tag(item, "description"));
      return {
        title: stripHtml(tag(item, "title")),
        link: tag(item, "link"),
        date: pubDate ? new Date(pubDate).toISOString() : "",
        excerpt: truncate(description, 220),
      };
    });
    return posts.filter((p) => p.title && p.link);
  } catch (err) {
    console.warn(`[substack] could not fetch ${FEED_URL}:`, err);
    return [];
  }
}
