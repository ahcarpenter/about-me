/**
 * The principles rendered on /philosophy — curated content, kept out of the page
 * component so the copy lives alongside the site's other data.
 */

export type Principle = { title: string; body: string };

export const principles: Principle[] = [
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
