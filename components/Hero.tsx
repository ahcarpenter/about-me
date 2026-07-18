import Link from "next/link";
import ExternalLink from "@/components/ExternalLink";
import { portrait } from "@/data/avatars";
import { site } from "@/lib/site";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-5xl items-center gap-10 px-5 pb-16 pt-14 sm:pt-20 md:grid-cols-[1.2fr_0.8fr]">
      <div>
        <p className="kicker">Hello, I’m</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl md:text-7xl">
          Andrew <em>Carpenter</em>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-soft">
          {site.tagline} This is the running record — live from{" "}
          <ExternalLink href={site.githubUrl} className="font-medium text-accent hover:text-accent-deep">
            GitHub
          </ExternalLink>
          ,{" "}
          <ExternalLink href={site.substackUrl} className="font-medium text-accent hover:text-accent-deep">
            Substack
          </ExternalLink>
          , and{" "}
          <ExternalLink href={site.linkedinUrl} className="font-medium text-accent hover:text-accent-deep">
            LinkedIn
          </ExternalLink>
          .
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/story/" className="btn btn-primary">
            Read my story
          </Link>
          <Link href="/philosophy/" className="btn btn-secondary">
            What I believe
          </Link>
          <Link
            href="/chat/"
            className="px-2 py-2.5 text-sm font-medium text-muted transition-colors hover:text-accent"
          >
            or just ask me →
          </Link>
        </div>
      </div>

      <div className="relative mx-auto w-56 sm:w-64 md:w-full md:max-w-[280px]">
        <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border border-line-strong bg-paper" />
        <div className="card relative overflow-hidden rounded-2xl p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={portrait.src}
            alt={`Portrait of ${site.name}`}
            width={320}
            height={320}
            fetchPriority="high"
            className="aspect-square w-full rounded-lg bg-paper object-cover outline -outline-offset-1 outline-black/10"
          />
          <p className="px-2 pb-1 pt-2 text-center font-mono text-[0.65rem] uppercase tracking-widest text-faint">
            Est. somewhere — still shipping
          </p>
        </div>
      </div>
    </section>
  );
}
