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

// Real recommendations received on https://www.linkedin.com/in/andrewhcarpenter
// (Profile → Recommendations, "All LinkedIn members" visibility). Ordered
// newest first. Each quote is an excerpt of the opening sentences — see the
// full text on LinkedIn.
export const recommendations: Recommendation[] = [
  {
    quote:
      "I had a chance to work with Drew as part of the Acquisitions team at Frontdoor. He was always positive and a willing participant in discussions. He was also a valuable asset in assisting others on the team by pairing up to find solutions.",
    name: "John Chaffier",
    title: "Software Architect & Technical Leader",
    relationship: "Was senior to Andrew",
  },
  {
    quote:
      "Drew is a joy to work with, and uniquely gifted in his knowledge of software architecture. He has deep fluency in different design patterns and programming paradigms.",
    name: "Christian Hughes",
    title: "Senior Software Engineer, Dropbox",
    relationship: "Worked with Andrew on a different team",
  },
  {
    quote:
      "Possibly the most positive person I have ever spent extended time with is what comes to mind when I think about Drew. I've had the pleasure of knowing Drew for a few years, during which we worked as peers on several projects and eventually I had the pleasure of serving as Drew's manager.",
    name: "Rick Peyton",
    title: "Chief Technology Officer, PrintsWell",
    relationship: "Managed Andrew directly",
  },
  {
    quote:
      "Drew is passionate about Ruby on Rails and the Ruby language in general. His attention to detail and continuous attention to code quality are second to none. When working with Drew, I was often impressed with the kinds of questions he would ask.",
    name: "Patrick Taylor",
    title: "Senior Software Engineer, AI Engineering Lead",
    relationship: "Worked with Andrew on the same team",
  },
  {
    quote:
      "Andrew has a solid background in IT knowledge from the University of Transylvania Lexington. That is why he designed solid database models instead of dumping everything in one table. He is extremely fast in adopting to new techniques because he loves his job.",
    name: "Ronaldus van Uden",
    title: "Software Engineer",
    relationship: "Worked with Andrew on a different team",
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
