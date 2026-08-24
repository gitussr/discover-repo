import AppShell from "@/components/AppShell";

// GitHub Pages serves static files with no server, so there is no way to
// pre-render a page per possible GitHub username. This single optional
// catch-all matches every path (/, /:username, /:username/repo/:repo, ...)
// and hands rendering entirely to the client-side AppShell/router — see
// src/lib/spa-router.tsx. generateStaticParams only pre-renders the root
// ("/"); every other path is served by the GitHub Pages 404 -> restore-path
// redirect (see src/app/not-found.tsx) landing back on this same shell.
export function generateStaticParams() {
  return [{ slug: [] }];
}

export default function CatchAllPage() {
  return <AppShell />;
}
