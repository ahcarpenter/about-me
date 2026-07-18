import Reveal from "@/components/Reveal";
import ActivityFeed from "@/components/ActivityFeed";
import GithubHighlights from "@/components/GithubHighlights";
import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";
import AsideLink from "@/components/AsideLink";
import WritingSection from "@/components/WritingSection";
import RecommendationsSection from "@/components/RecommendationsSection";
import { getSubstackPosts } from "@/lib/sources/substack/substack";
import { getRepoHighlights } from "@/lib/sources/github/repos";
import { getGithubActivity } from "@/lib/sources/github/activity";
import { site } from "@/lib/site";

export default async function Home() {
  const [posts, repos, githubActivity] = await Promise.all([
    getSubstackPosts(),
    getRepoHighlights(),
    getGithubActivity(),
  ]);

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
            aside={<span>GitHub &amp; Substack at deploy · LinkedIn &amp; reading curated</span>}
          />
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-8">
            <ActivityFeed githubActivity={githubActivity} substackPosts={posts} />
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
            aside={<AsideLink href={site.githubUrl}>github.com/{site.githubUsername} ↗</AsideLink>}
          />
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-8">
            <GithubHighlights repos={repos} />
          </div>
        </Reveal>
      </section>

      <WritingSection posts={posts} />
      <RecommendationsSection />
    </div>
  );
}
