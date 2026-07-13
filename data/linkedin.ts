/**
 * LinkedIn data — curated by hand.
 *
 * LinkedIn has no public API for recommendations or member activity, so this
 * file is the source of truth. Paste real recommendations from
 * https://www.linkedin.com/in/andrewhcarpenter (Profile → Recommendations)
 * and recent activity here, then remove the `sample` flag. Entries flagged
 * `sample: true` render with a small "sample" badge on the site so
 * placeholder content is never mistaken for the real thing.
 */

export type Recommendation = {
  quote: string;
  name: string;
  title: string;
  relationship: string;
  sample?: boolean;
};

export type LinkedInActivity = {
  /** ISO date, used for sorting the merged front-page feed. */
  date: string;
  title: string;
  url: string;
  sample?: boolean;
};

export const recommendations: Recommendation[] = [
  {
    quote:
      "Drew is the rare engineer who cares as much about why something is being built as how. He asks the question that reframes the whole project — then quietly ships the thing.",
    name: "Jane Doe",
    title: "Engineering Manager",
    relationship: "Managed Drew directly",
    sample: true,
  },
  {
    quote:
      "Every team has someone people go to when they're stuck. On ours, that was Drew. Generous with his time, allergic to hand-waving, and unreasonably good at naming things.",
    name: "John Smith",
    title: "Staff Engineer",
    relationship: "Worked with Drew on the same team",
    sample: true,
  },
  {
    quote:
      "Drew turned a vague idea into a working product faster than I thought possible, and explained every trade-off along the way in plain English.",
    name: "Alex Roe",
    title: "Product Lead",
    relationship: "Was Drew's stakeholder",
    sample: true,
  },
];

export const linkedinActivity: LinkedInActivity[] = [
  {
    date: "2026-07-01",
    title: "Shared a post about building personal software in the age of coding agents",
    url: "https://www.linkedin.com/in/andrewhcarpenter",
    sample: true,
  },
  {
    date: "2026-06-18",
    title: "Commented on a thread about engineering career ladders",
    url: "https://www.linkedin.com/in/andrewhcarpenter",
    sample: true,
  },
];
