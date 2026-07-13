import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { timeline } from "@/data/timeline";

export const metadata: Metadata = {
  title: "Story",
  description: "The life story, one dot at a time.",
};

export default function StoryPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-8 pt-14 sm:pt-20">
      <p className="kicker">Story</p>
      <h1 className="display mt-3 text-4xl sm:text-6xl">
        The road <em>so far</em>
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-soft">
        A life in dots. Scroll — each one marks a chapter, and the details fade
        in as you reach them.
      </p>

      <div className="relative mt-16">
        {/* The vertical line */}
        <div
          aria-hidden
          className="absolute bottom-4 left-[7px] top-2 w-px bg-line-strong sm:left-[9px]"
        />

        <ol className="space-y-16">
          {timeline.map((event) => (
            <li key={`${event.date}-${event.title}`}>
              <Reveal className="tl-item relative">
                {/* Dot on the line, marking the date + event header */}
                <span
                  aria-hidden
                  className="tl-dot absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-[3px] border-accent bg-cream sm:h-[19px] sm:w-[19px]"
                />
                <div className="tl-head pl-9 sm:pl-12">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
                    {event.date}
                  </p>
                  <h2 className="display mt-1 text-2xl sm:text-3xl">{event.title}</h2>
                </div>
                {/* Description fades in to the right of the dot */}
                <p className="tl-body mt-3 max-w-xl pl-9 leading-relaxed text-soft sm:pl-12">
                  {event.description}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>

        {/* Terminus */}
        <Reveal className="reveal relative mt-16">
          <span
            aria-hidden
            className="absolute left-[3px] top-1 h-2 w-2 rounded-full bg-accent sm:left-[5px]"
          />
          <p className="pl-9 font-mono text-xs uppercase tracking-[0.18em] text-faint sm:pl-12">
            to be continued…
          </p>
        </Reveal>
      </div>
    </div>
  );
}
