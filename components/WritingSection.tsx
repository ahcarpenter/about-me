import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import AsideLink from "@/components/AsideLink";
import ExternalLink from "@/components/ExternalLink";
import type { SubstackPost } from "@/lib/sources/substack/substack";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/format";

export default function WritingSection({ posts }: { posts: SubstackPost[] }) {
  return (
    <section className="mx-auto max-w-5xl px-5 pt-20" id="writing">
      <Reveal>
        <SectionHeader
          kicker="Writing"
          title={
            <>
              From the <em>Substack</em>
            </>
          }
          aside={<AsideLink href={site.substackUrl}>{site.substackHandle} ↗</AsideLink>}
        />
      </Reveal>

      {posts.length > 0 ? (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {posts.slice(0, 3).map((post, i) => (
            <Reveal key={post.link} delay={i * 90}>
              <ExternalLink href={post.link} className="card group flex h-full flex-col px-6 py-6">
                <p className="font-mono text-xs text-muted">{formatDate(post.date)}</p>
                <h3 className="display mt-3 text-xl leading-snug group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                )}
                <p className="mt-4 text-sm font-medium text-accent">Read on Substack →</p>
              </ExternalLink>
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal>
          <ExternalLink href={site.substackUrl} className="card mt-8 block px-6 py-10 text-center">
            <p className="display text-xl">
              Fresh posts land here on every deploy<span className="text-accent">.</span>
            </p>
            <p className="mt-2 text-sm text-muted">
              In the meantime, read everything at {site.substackUrl.replace("https://", "")} ↗
            </p>
          </ExternalLink>
        </Reveal>
      )}
    </section>
  );
}
