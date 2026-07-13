import type { StaticImageData } from "next/image";
import portraitImage from "@/public/avatar.jpg";
import portraitAvif1x from "@/public/avatar-320.avif";
import portraitAvif2x from "@/public/avatar-460.avif";
import johnChaffier from "@/public/avatars/john-chaffier.jpg";
import christianHughes from "@/public/avatars/christian-hughes.jpg";
import rickPeyton from "@/public/avatars/rick-peyton.jpg";
import patrickTaylor from "@/public/avatars/patrick-taylor.jpg";
import ronaldusVanUden from "@/public/avatars/ronaldus-van-uden.jpg";

/**
 * Self-hosted copies of the GitHub avatar (github.com/ahcarpenter.png), so the
 * hero portrait and og:image are served from this origin instead of chasing
 * github.com's 302 redirect to avatars.githubusercontent.com. The JPEG is the
 * universal fallback and og:image; the AVIFs feed the hero's <picture> at 1x
 * and 2x (460px is the largest GitHub serves for this avatar). Refresh with:
 *   curl -sL "https://github.com/ahcarpenter.png?size=640" -o /tmp/avatar.png \
 *     && sips -s format jpeg -s formatOptions 85 -z 320 320 /tmp/avatar.png --out public/avatar.jpg \
 *     && avifenc -q 60 -s 6 /tmp/avatar.png public/avatar-460.avif \
 *     && sips -z 320 320 /tmp/avatar.png --out /tmp/avatar-320.png \
 *     && avifenc -q 60 -s 6 /tmp/avatar-320.png public/avatar-320.avif
 */
export const portrait = portraitImage;

/** AVIF sources for the hero portrait's <picture>, 1x and 2x. */
export const portraitAvifSrcSet = `${portraitAvif1x.src} 1x, ${portraitAvif2x.src} 2x`;

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
