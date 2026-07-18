import Link from "next/link";
import { site } from "@/lib/site";
import { navLinks } from "@/data/nav";
import { socialLinks } from "@/data/social";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-paper/60">
      <div className="mx-auto grid max-w-5xl gap-10 px-5 py-12 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <p className="display text-xl">
            {site.shortName}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            {site.tagline} Thanks for stopping by — say hi on any of the
            platforms to the right.
          </p>
        </div>

        <div>
          <p className="kicker">Pages</p>
          <ul className="mt-1">
            {navLinks.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="inline-block py-2.5 text-sm text-soft transition-colors hover:text-accent"
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="kicker">Elsewhere</p>
          <ul className="mt-1">
            {socialLinks.map((e) => (
              <li key={e.href}>
                <a
                  href={e.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-2.5 text-sm text-soft transition-colors hover:text-accent"
                >
                  {e.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-5 py-4">
          <p className="font-mono text-xs text-muted">
            © {new Date().getFullYear()} {site.name}
          </p>
          <p className="font-mono text-xs text-muted">
            verify me →{" "}
            <a
              href={site.keybaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent"
            >
              keybase.io/ahcarpenter
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
