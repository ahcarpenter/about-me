/**
 * Recent articles read — curated by hand (swap in a Readwise/Pocket export or
 * API later if you want this automated). Entries flagged `sample: true`
 * render with a small "sample" badge until replaced with your real reading.
 */

export type ReadItem = {
  /** ISO date you read it, used for sorting the merged front-page feed. */
  date: string;
  title: string;
  author: string;
  url: string;
  sample?: boolean;
};

export const recentReads: ReadItem[] = [
  {
    date: "2026-07-08",
    title: "You and Your Research",
    author: "Richard Hamming",
    url: "https://www.cs.virginia.edu/~robins/YouAndYourResearch.html",
    sample: true,
  },
  {
    date: "2026-06-27",
    title: "How to Do Great Work",
    author: "Paul Graham",
    url: "https://paulgraham.com/greatwork.html",
    sample: true,
  },
  {
    date: "2026-06-15",
    title: "Choose Boring Technology",
    author: "Dan McKinley",
    url: "https://mcfunley.com/choose-boring-technology",
    sample: true,
  },
];
