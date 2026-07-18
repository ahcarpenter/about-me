/**
 * Site navigation — the single source of truth for the page list shared by the
 * header and footer. Previously each maintained its own (overlapping) array.
 */

export type NavLink = {
  href: string;
  /** Canonical page name (About, Philosophy, Story, Chat). */
  label: string;
  /** Rendered as the header's primary call-to-action rather than a plain link. */
  cta?: boolean;
};

export const navLinks: NavLink[] = [
  { href: "/", label: "About" },
  { href: "/philosophy/", label: "Philosophy" },
  { href: "/story/", label: "Story" },
  { href: "/chat/", label: "Chat", cta: true },
];
