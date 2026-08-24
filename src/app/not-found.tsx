// Rendered by Next as the site-wide out/404.html for the static export.
// GitHub Pages has no server-side rewrites, so it serves this file verbatim
// for any path with no matching static file (i.e. every /:username route).
// This script captures the URL the visitor actually wanted and redirects to
// the real app shell (index.html) with it encoded in a query param; the
// root layout's restore script (see src/app/layout.tsx) decodes it back into
// a pretty URL before the client router ever reads window.location.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const redirectScript = `(function () {
  var basePath = ${JSON.stringify(BASE_PATH)};
  var loc = window.location;
  var path = loc.pathname;
  if (basePath && path.indexOf(basePath) === 0) path = path.slice(basePath.length);
  var target = basePath + "/?redirect=" + encodeURIComponent(path + loc.search + loc.hash);
  loc.replace(target);
})();`;

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16 text-sm text-[var(--color-text-muted)]">
      <p>Redirecting…</p>
      <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
    </div>
  );
}
