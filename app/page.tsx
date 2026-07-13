import Link from "next/link";
import Reveal from "@/components/Reveal";
import ActivityFeed from "@/components/ActivityFeed";
import GithubHighlights from "@/components/GithubHighlights";
import { getSubstackPosts, type SubstackPost } from "@/lib/substack";
import { recommendations, type Recommendation } from "@/data/linkedin";
import { site } from "@/lib/site";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function SectionHeader({
  kicker,
  title,
  aside,
}: {
  kicker: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="kicker">{kicker}</p>
        <h2 className="display mt-2 text-3xl sm:text-4xl">{title}</h2>
      </div>
      {aside && <div className="pb-1 font-mono text-xs text-muted">{aside}</div>}
    </div>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-5xl items-center gap-10 px-5 pb-16 pt-14 sm:pt-20 md:grid-cols-[1.2fr_0.8fr]">
      <div>
        <p className="kicker">Hello, I’m</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl md:text-7xl">
          Andrew <em>Carpenter</em>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-soft">
          {site.tagline} I spend my days shipping things, writing about what I
          learn along the way, and chasing the occasional idea further than is
          strictly sensible. This site is the running record — live from{" "}
          <a href={site.githubUrl} className="font-medium text-accent hover:text-accent-deep" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          ,{" "}
          <a href={site.substackUrl} className="font-medium text-accent hover:text-accent-deep" target="_blank" rel="noopener noreferrer">
            Substack
          </a>
          , and{" "}
          <a href={site.linkedinUrl} className="font-medium text-accent hover:text-accent-deep" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
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
            className="px-2 py-1 text-sm font-medium text-muted transition-colors hover:text-accent"
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
            src={site.avatarUrl}
            alt={`Portrait of ${site.name}`}
            width={320}
            height={320}
            className="aspect-square w-full rounded-xl bg-paper object-cover"
          />
          <p className="px-2 pb-1 pt-2 text-center font-mono text-[0.65rem] tracking-widest text-faint">
            EST. SOMEWHERE — STILL SHIPPING
          </p>
        </div>
      </div>
    </section>
  );
}

function WritingSection({ posts }: { posts: SubstackPost[] }) {
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
          aside={
            <a href={site.substackUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
              {site.substackHandle} ↗
            </a>
          }
        />
      </Reveal>

      {posts.length > 0 ? (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {posts.slice(0, 3).map((post, i) => (
            <Reveal key={post.link} delay={i * 90}>
              <a href={post.link} target="_blank" rel="noopener noreferrer" className="card group flex h-full flex-col px-6 py-6">
                <p className="font-mono text-xs text-faint">{formatDate(post.date)}</p>
                <h3 className="display mt-3 text-xl leading-snug group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                )}
                <p className="mt-4 text-sm font-medium text-accent">Read on Substack →</p>
              </a>
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal>
          <a
            href={site.substackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="card mt-8 block px-6 py-10 text-center"
          >
            <p className="display text-xl">
              Fresh posts land here on every deploy<span className="text-accent">.</span>
            </p>
            <p className="mt-2 text-sm text-muted">
              In the meantime, read everything at {site.substackUrl.replace("https://", "")} ↗
            </p>
          </a>
        </Reveal>
      )}
    </section>
  );
}

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const inner = (
    <>
      <span aria-hidden className="display text-5xl leading-none text-accent">
        “
      </span>
      <blockquote className="mt-1 whitespace-pre-line text-sm leading-relaxed text-soft">
        {rec.quote}
      </blockquote>
      <figcaption className="mt-5 border-t border-line pt-4">
        <p className="flex flex-wrap items-center gap-x-2 text-sm font-semibold text-ink">
          <span className="group-hover:text-accent transition-colors">{rec.name}</span>
          {rec.profileUrl && (
            <span aria-hidden className="font-mono text-xs font-normal text-faint group-hover:text-accent">
              ↗
            </span>
          )}
          {rec.sample && <span className="chip font-normal">sample</span>}
        </p>
        <p className="mt-0.5 text-xs text-muted">
          {rec.title}
          {rec.relationship ? ` · ${rec.relationship}` : ""}
        </p>
      </figcaption>
    </>
  );

  const className = "card group block break-inside-avoid px-6 py-6";
  return rec.profileUrl ? (
    <a
      href={rec.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={`View ${rec.name}’s LinkedIn profile`}
    >
      {inner}
    </a>
  ) : (
    <figure className={className}>{inner}</figure>
  );
}

function RecommendationsSection() {
  return (
    <section className="mx-auto max-w-5xl px-5 pt-20" id="kind-words">
      <Reveal>
        <SectionHeader
          kicker="Kind words"
          title={
            <>
              What colleagues <em>say</em>
            </>
          }
          aside={
            <a href={site.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
              recommendations via LinkedIn ↗
            </a>
          }
        />
      </Reveal>

      <div className="mt-8 gap-4 sm:columns-2 lg:columns-3">
        {recommendations.map((rec, i) => (
          <Reveal
            key={rec.name}
            delay={Math.min(i, 3) * 80}
            className="reveal mb-4 break-inside-avoid"
          >
            <RecommendationCard rec={rec} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default async function Home() {
  const posts = await getSubstackPosts();

  return (
    <div className="pb-8">
      <Hero />

      <section className="mx-auto max-w-5xl px-5 pt-6" id="activity">
        <Reveal>
          <SectionHeader
            kicker="The feed"
            title={
              <>
                What I’ve been <em>up to</em>
              </>
            }
            aside={<span>GitHub live · Substack at deploy · LinkedIn &amp; reading curated</span>}
          />
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-8">
            <ActivityFeed substackPosts={posts} />
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-5xl px-5 pt-20" id="projects">
        <Reveal>
          <SectionHeader
            kicker="Projects"
            title={
              <>
                Things I’ve <em>built</em>
              </>
            }
            aside={
              <a href={site.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                github.com/{site.githubUsername} ↗
              </a>
            }
          />
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-8">
            <GithubHighlights />
          </div>
        </Reveal>
      </section>

      <WritingSection posts={posts} />
      <RecommendationsSection />
    </div>
  );
}
