import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname) },
  },
  test: {
    // Default to node (fast) for the pure lib tests; component tests opt into
    // jsdom per-file with a `// @vitest-environment jsdom` docblock.
    environment: "node",
  },
});
