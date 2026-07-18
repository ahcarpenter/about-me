/**
 * External profile links, in display order. Derived from lib/site.ts so the URLs
 * are declared once; used by the footer's "Elsewhere" list (and anywhere else
 * that needs the full set).
 */
import { site } from "@/lib/site";

export type SocialLink = { label: string; href: string };

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: site.githubUrl },
  { label: "LinkedIn", href: site.linkedinUrl },
  { label: "Substack", href: site.substackUrl },
  { label: "Keybase", href: site.keybaseUrl },
];
