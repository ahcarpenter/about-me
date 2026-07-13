"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

const links = [
  { href: "/", label: "About" },
  { href: "/philosophy/", label: "Philosophy" },
  { href: "/story/", label: "Story" },
];

export default function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    const base = href.replace(/\/$/, "");
    return pathname === base || pathname.startsWith(`${base}/`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-3.5">
        <Link
          href="/"
          className="display text-lg leading-none tracking-tight hover:text-accent transition-colors"
        >
          {site.shortName}
          <span className="text-accent">.</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors before:absolute before:inset-x-0 before:-inset-y-1 before:content-[''] ${
                isActive(l.href)
                  ? "bg-accent-soft text-accent-deep"
                  : "text-soft hover:bg-surface hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/chat/"
            className="btn btn-primary relative ml-1 px-4 py-1.5 text-sm before:absolute before:inset-x-0 before:-inset-y-1 before:content-['']"
          >
            <span className="sm:hidden">Chat</span>
            <span className="hidden sm:inline">Chat with me</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
