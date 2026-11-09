import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AGENTS.md is the harness's planning context, loaded every morning; keep Next's coding rules out of it.
  agentRules: false,
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
};

export default nextConfig;
