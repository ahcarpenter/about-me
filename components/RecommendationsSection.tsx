import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import AsideLink from "@/components/AsideLink";
import RecommendationCard from "@/components/RecommendationCard";
import { recommendations } from "@/data/linkedin";
import { site } from "@/lib/site";

export default function RecommendationsSection() {
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
          aside={<AsideLink href={site.linkedinUrl}>recommendations via LinkedIn ↗</AsideLink>}
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
