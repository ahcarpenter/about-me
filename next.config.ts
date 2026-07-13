import type { NextConfig } from "next";

// Static export for GitHub Pages. The deploy workflow's configure-pages step
// injects `basePath` automatically when the site is served from a subpath.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
