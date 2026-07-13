import type { Metadata } from "next";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Philosophy",
  description: "The principles I try to work and live by.",
};

const principles = [
  {
    title: "Build to understand",
    body: "Reading about a thing gives you the map; building the thing gives you the territory. When I want to actually understand something — a protocol, a market, a craft — I make a small, ugly version of it first. The prototype is the argument.",
  },
  {
    title: "Strong opinions, loosely held",
    body: "Conviction is fuel and humility is steering. I try to commit hard to a position, say it out loud so it can be attacked, and then actually change my mind when the evidence lands. The failure mode isn't being wrong — it's being wrong quietly.",
  },
  {
    title: "Boring technology, interesting problems",
    body: "Novelty budgets are real. Spend them on the problem, not the plumbing. The most durable systems I've worked on were built from tools old enough to be unfashionable, aimed at questions nobody had answered yet.",
  },
  {
    title: "Writing is thinking",
    body: "If I can't write it down clearly, I don't understand it yet. Documents outlive meetings, outlast memory, and scale better than my calendar. Most of what looks like a technical disagreement is two people who haven't written their assumptions down.",
  },
  {
    title: "Kindness is a strategy",
    body: "Not niceness — kindness. Telling someone the truth early, giving credit precisely, leaving every codebase and every colleague a little better than you found them. It compounds faster than any other investment I know.",
  },
  {
    title: "Optimize for the long game",
    body: "Careers, products, relationships, health — everything meaningful is a repeated game. I try to make choices that look mediocre this quarter and obvious in ten years, and to be suspicious of the reverse.",
  },
];

export default function PhilosophyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-8 pt-14 sm:pt-20">
      <p className="kicker">Philosophy</p>
      <h1 className="display mt-3 text-4xl sm:text-6xl">
        How I try to <em>think</em>
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-soft">
        A working set of principles — written down so they can be argued with,
        revised when they lose, and actually used in the meantime.
      </p>

      <blockquote className="card mt-10 border-l-4 border-l-accent px-6 py-6">
        <p className="display text-xl leading-relaxed sm:text-2xl">
          “The point isn’t to have beliefs. It’s to have beliefs that would
          notice if they were wrong.”
        </p>
      </blockquote>

      <div className="mt-12 space-y-10">
        {principles.map((p, i) => (
          <Reveal key={p.title} delay={Math.min(i, 2) * 60}>
            <section className="grid gap-2 sm:grid-cols-[3.5rem_1fr] sm:gap-6">
              <p className="font-mono text-sm text-accent sm:pt-1">
                {String(i + 1).padStart(2, "0")}
              </p>
              <div>
                <h2 className="display text-2xl">{p.title}</h2>
                <p className="mt-3 leading-relaxed text-soft">{p.body}</p>
              </div>
            </section>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="mt-16 border-t border-line pt-8 text-sm leading-relaxed text-muted">
          These are principles, not laws — version-controlled like everything
          else here. If you think one of them is wrong, I’d genuinely like to
          hear the argument.
        </p>
      </Reveal>
    </div>
  );
}
