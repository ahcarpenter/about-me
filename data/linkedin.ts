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
  /**
   * Permalink to the specific post/comment, NOT the profile. On LinkedIn,
   * open the post's ··· menu → "Copy link to post"; it looks like
   * https://www.linkedin.com/feed/update/urn:li:activity:1234567890/
   * or https://www.linkedin.com/posts/andrewhcarpenter_slug-activity-1234567890/
   */
  url: string;
  sample?: boolean;
};

export const recommendations: Recommendation[] = [
  {
    quote:
      "Andrew is the rare engineer who cares as much about why something is being built as how. He asks the question that reframes the whole project — then quietly ships the thing.",
    name: "Jane Doe",
    title: "Engineering Manager",
    relationship: "Managed Andrew directly",
    sample: true,
  },
  {
    quote:
      "Every team has someone people go to when they're stuck. On ours, that was Andrew. Generous with his time, allergic to hand-waving, and unreasonably good at naming things.",
    name: "John Smith",
    title: "Staff Engineer",
    relationship: "Worked with Andrew on the same team",
    sample: true,
  },
  {
    quote:
      "Andrew turned a vague idea into a working product faster than I thought possible, and explained every trade-off along the way in plain English.",
    name: "Alex Roe",
    title: "Product Lead",
    relationship: "Was Andrew's stakeholder",
    sample: true,
  },
];

export const linkedinActivity: LinkedInActivity[] = [
  // Sample entries link to the recent-activity feed until replaced with
  // real posts — swap each url for the post's own permalink (see type docs).
  {
    date: "2026-07-01",
    title: "Shared a post about building personal software in the age of coding agents",
    url: "https://www.linkedin.com/in/andrewhcarpenter/recent-activity/all/",
    sample: true,
  },
  {
    date: "2026-06-18",
    title: "Commented on a thread about engineering career ladders",
    url: "https://www.linkedin.com/in/andrewhcarpenter/recent-activity/comments/",
    sample: true,
  },
];
