import type { NextConfig } from "next";

// Set only by the GitHub Pages Actions workflow (see .github/workflows/deploy.yml),
// which also sets NEXT_PUBLIC_BASE_PATH to the same value so the client-side
// router and the GH Pages 404 redirect trick (src/app/not-found.tsx,
// src/app/layout.tsx) agree on it. Local `next dev`/`next build` stay
// unaffected — the app runs as a normal root-relative SPA.
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(isGithubPages ? { output: "export", basePath } : {}),
  images: {
    unoptimized: isGithubPages,
    remotePatterns: [{ protocol: "https", hostname: "avatars.githubusercontent.com" }],
  },
};

export default nextConfig;
