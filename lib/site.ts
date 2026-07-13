/** Central place for identity + external profile links. */
export const site = {
  name: "Andrew H. Carpenter",
  shortName: "Andrew Carpenter",
  firstName: "Andrew",
  tagline: "Builder of software, collector of ideas.",
  description:
    "Personal site of Andrew H. Carpenter — what I'm building, writing, reading, and thinking about.",

  /** Canonical deployed URL (GitHub Pages project site). */
  url: "https://ahcarpenter.github.io/about/",

  githubUsername: "ahcarpenter",
  githubUrl: "https://github.com/ahcarpenter",
  linkedinUrl: "https://www.linkedin.com/in/andrewhcarpenter",
  substackHandle: "@ahcarpenter",
  substackUrl: "https://ahcarpenter.substack.com",
  substackProfileUrl: "https://substack.com/@ahcarpenter",
  keybaseUrl: "https://keybase.io/ahcarpenter",

  /** Rendered avatar; GitHub serves this for any account. */
  avatarUrl: "https://github.com/ahcarpenter.png?size=320",
} as const;
