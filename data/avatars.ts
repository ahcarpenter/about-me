import type { StaticImageData } from "next/image";
import portraitImage from "@/public/avatar.jpg";
import johnChaffier from "@/public/avatars/john-chaffier.jpg";
import christianHughes from "@/public/avatars/christian-hughes.jpg";
import rickPeyton from "@/public/avatars/rick-peyton.jpg";
import patrickTaylor from "@/public/avatars/patrick-taylor.jpg";
import ronaldusVanUden from "@/public/avatars/ronaldus-van-uden.jpg";

/**
 * Self-hosted copy of the GitHub avatar (github.com/ahcarpenter.png), so the
 * hero portrait and og:image are served from this origin instead of chasing
 * github.com's 302 redirect to avatars.githubusercontent.com. Refresh it with:
 *   curl -sL "https://github.com/ahcarpenter.png?size=320" -o /tmp/avatar.png \
 *     && sips -s format jpeg -s formatOptions 85 /tmp/avatar.png --out public/avatar.jpg
 */
export const portrait = portraitImage;

/**
 * Recommender avatars, keyed by the recommendation's `profileUrl` field —
 * a stable identifier, unlike display names, which get reformatted.
 * Kept separate from data/linkedin.ts so the import script can regenerate
 * that file without touching avatar wiring. Static imports ensure the URLs
 * respect the GitHub Pages basePath at build time.
 */
export const recommenderAvatars: Record<string, StaticImageData> = {
  "https://www.linkedin.com/in/jchaffier": johnChaffier,
  "https://www.linkedin.com/in/christianjhughes": christianHughes,
  "https://www.linkedin.com/in/rickpeyton": rickPeyton,
  "https://www.linkedin.com/in/pstaylor-patrick": patrickTaylor,
  "https://www.linkedin.com/in/ronaldus": ronaldusVanUden,
};
