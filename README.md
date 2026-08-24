# Git USSR — Repository Command Center

A searchable, terminal-inspired command center for any public GitHub user's repositories. Put a GitHub username at the start of the URL — `/octocat`, `/gitussr`, `/anyone` — and it dynamically fetches and indexes that user's public repos: no hard-coded users, repos, or metadata.

**Live:** https://gitussr.github.io/discover-repo/

Full product spec: [`Master Prompt — Git USSR Repository Command Center.md`](./Master%20Prompt%20%E2%80%94%20Git%20USSR%20Repository%20Command%20Center.md). Architecture notes for contributors (human or AI): [`CLAUDE.md`](./CLAUDE.md).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then visit `/octocat` (or any public GitHub username).

## Deployment

Deployed to **GitHub Pages** via `.github/workflows/deploy.yml` on every push to `main`. GitHub Pages serves static files only, so the app is a fully client-side SPA — all GitHub API calls happen in the browser, and there's a small custom router (`src/lib/spa-router.tsx`) plus a 404-redirect trick (`src/app/not-found.tsx`) standing in for Next's server-backed routing so that deep links like `/octocat/repo/some-repo` still work. See `CLAUDE.md` for the details before changing anything routing- or data-fetching-related — it's easy to reintroduce a server-only pattern that builds locally but breaks the static export.

To reproduce the deployed build locally:

```bash
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/discover-repo npm run build
npx serve out
```

## Environment variables

None are required for local dev — the app talks to GitHub's public, unauthenticated REST API directly from the browser (CORS-enabled). There's no server, so there's nowhere to safely hold an API token; the anonymous rate limit (60 req/hr per IP) applies.

## Progressive Web App

The site is installable — `src/app/manifest.ts` + `public/sw.js` (a minimal app-shell service worker: cache-first for hashed build assets, network-first with an offline fallback for navigations). Icons are generated as real PNGs by `scripts/generate-icons.mjs` (no image dependencies — hand-rasterized via Node's built-in `zlib`); re-run it if the icon design changes.

## Scripts

- `npm run dev` — start the dev server (Turbopack)
- `npm run build` — production build
- `npm run start` — run the production build (non-static-export mode only)
- `npm run lint` — ESLint
- `node scripts/generate-icons.mjs` — regenerate `public/icons/*.png`

## Local repository metadata

`src/data/repository-meta.ts` is an optional, namespaced-by-username override layer for context GitHub can't provide (`status`, `why`, `featured`). It ships empty — see the file's comment for the shape.
