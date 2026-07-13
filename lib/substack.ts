import { site } from "@/lib/site";

export type SubstackPost = {
  title: string;
  link: string;
  /** ISO date string. */
  date: string;
  excerpt: string;
  image?: string;
};

const FEED_URL = `${site.substackUrl}/feed`;

/** Pull a single tag's inner text, unwrapping CDATA. */
function tag(block: string, name: string): string {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  if (!m) return "";
  return m[1].replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, "$1").trim();
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
    const res = await fetch(FEED_URL, {
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
      const image = item.match(/<enclosure[^>]*url="([^"]+)"/i)?.[1];
      return {
        title: stripHtml(tag(item, "title")),
        link: tag(item, "link"),
        date: pubDate ? new Date(pubDate).toISOString() : "",
        excerpt:
          description.length > 220 ? `${description.slice(0, 217)}…` : description,
        image,
      };
    });
    return posts.filter((p) => p.title && p.link);
  } catch (err) {
    console.warn(`[substack] could not fetch ${FEED_URL}:`, err);
    return [];
  }
}
