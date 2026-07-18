import ExternalLink from "@/components/ExternalLink";
import { recommenderAvatars } from "@/data/avatars";
import type { Recommendation } from "@/data/linkedin";

export default function RecommendationCard({ rec }: { rec: Recommendation }) {
  const avatar = rec.profileUrl ? recommenderAvatars[rec.profileUrl] : undefined;
  const inner = (
    <>
      <span aria-hidden className="display text-5xl leading-none text-accent">
        “
      </span>
      <blockquote className="mt-1 whitespace-pre-line text-sm leading-relaxed text-soft">
        {rec.quote}
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
        {avatar && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={avatar.src}
            alt=""
            width={40}
            height={40}
            loading="lazy"
            decoding="async"
            className="h-10 w-10 shrink-0 rounded-full object-cover outline -outline-offset-1 outline-black/10"
          />
        )}
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-x-2 text-sm font-semibold text-ink">
            <span className="group-hover:text-accent transition-colors">{rec.name}</span>
            {rec.profileUrl && (
              <span aria-hidden className="font-mono text-xs font-normal text-faint group-hover:text-accent">
                ↗
              </span>
            )}
            {rec.sample && <span className="chip font-normal">sample</span>}
          </span>
          <span className="mt-0.5 block text-xs text-muted">
            {rec.title}
            {rec.relationship ? ` · ${rec.relationship}` : ""}
          </span>
        </span>
      </figcaption>
    </>
  );

  const className = "card group block break-inside-avoid px-6 py-6";
  return rec.profileUrl ? (
    <ExternalLink
      href={rec.profileUrl}
      className={className}
      aria-label={`View ${rec.name}’s LinkedIn profile`}
    >
      {inner}
    </ExternalLink>
  ) : (
    <figure className={className}>{inner}</figure>
  );
}
