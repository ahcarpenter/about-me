/**
 * Life story timeline — edit freely; these entries are intentionally written
 * as a starting template. Each event renders as a dot on the vertical line
 * with the date + header at the dot and the description fading in to the
 * right as you scroll.
 */

export type TimelineEvent = {
  /** Short label shown at the dot, e.g. "1994" or "Summer 2012". */
  date: string;
  title: string;
  description: string;
};

export const timeline: TimelineEvent[] = [
  {
    date: "The early years",
    title: "Curiosity sets in",
    description:
      "A kid who took things apart faster than they could be put back together. The questions started early — how does this work, and who decided it should work that way? — and never really stopped.",
  },
  {
    date: "First computer",
    title: "The machine that talked back",
    description:
      "The first computer changed everything. Here was a thing that did exactly what you told it — no more, no less — and the gap between what I meant and what I typed became a lifelong teacher.",
  },
  {
    date: "School days",
    title: "Learning how to learn",
    description:
      "Formal education supplied the fundamentals; late nights on side projects supplied the fun. Somewhere in between, tinkering hardened into a craft.",
  },
  {
    date: "First job",
    title: "Software in the wild",
    description:
      "Shipping to real users was a humbling upgrade from shipping to localhost. I learned that most hard problems are people problems wearing a technical costume.",
  },
  {
    date: "Leveling up",
    title: "From building things to building teams",
    description:
      "The work shifted from writing every line myself to multiplying through others — reviews, mentorship, and the slow art of writing things down so the next person doesn't have to rediscover them.",
  },
  {
    date: "Today",
    title: "Still building",
    description:
      "Writing, shipping side projects, and exploring what personal software looks like when an AI pair-programmer is always on call. The questions from the early years remain undefeated.",
  },
];
