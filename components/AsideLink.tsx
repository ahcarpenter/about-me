import type { ReactNode } from "react";
import ExternalLink from "@/components/ExternalLink";

/**
 * The small external link that sits in a SectionHeader's aside slot. The
 * `before:` pseudo-element enlarges the tap target without changing layout.
 */
export default function AsideLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <ExternalLink
      href={href}
      className="relative inline-block transition-colors before:absolute before:-inset-x-1 before:-inset-y-3 before:content-[''] hover:text-accent"
    >
      {children}
    </ExternalLink>
  );
}
