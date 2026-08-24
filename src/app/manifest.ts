import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Git USSR — Repository Index",
    short_name: "Git USSR",
    description: "A searchable, terminal-inspired command center for any public GitHub user's repositories.",
    // Relative to this manifest's own URL, so it resolves correctly whether
    // the site is served at the domain root or under a GitHub Pages
    // basePath (e.g. /discover-repo/) without needing that path baked in.
    start_url: ".",
    scope: ".",
    display: "standalone",
    background_color: "#141414",
    theme_color: "#141414",
    icons: [
      { src: "icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
