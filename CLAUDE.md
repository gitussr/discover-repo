# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

"Git USSR" is a terminal-inspired repository discovery site: given any public GitHub username in the URL, it dynamically fetches and displays that user's repositories as a searchable, keyboard-driven "command center." It is explicitly **not** a portfolio site, GitHub clone, or dashboard — see the "WHAT NOT TO BUILD" section of the master prompt (§61) for hard boundaries.

The full spec lives in [`Master Prompt — Git USSR Repository Command Center.md`](./Master%20Prompt%20%E2%80%94%20Git%20USSR%20Repository%20Command%20Center.md) (66+ sections). Re-read the relevant numbered section before building/changing a feature — it has exact copy, example output, and responsive rules. §68 ("Definition of Done") is the acceptance checklist for the whole project.

## Commands

```bash
npm run dev      # dev server at localhost:3000
npm run build    # production build (regular Node/Vercel-style output)
npm run lint      # ESLint
node scripts/generate-icons.mjs   # regenerate public/icons/*.png if the icon design changes
```

GitHub Pages build (what CI runs — see below for why the env vars matter):
```bash
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/discover-repo npm run build   # writes out/
```

No env vars are required for local dev — the app talks to GitHub's public, unauthenticated REST API directly from the browser.

## Architecture: this is a fully client-side SPA — deliberately

The site is deployed to **GitHub Pages** (`.github/workflows/deploy.yml`, live at `https://gitussr.github.io/discover-repo/`), which serves static files only — no server, no API routes, no per-request rendering. That one constraint shapes almost everything about how this code is structured, and it's easy to accidentally reintroduce server-only patterns (a Next server component doing `fetch` for its own data, a Route Handler, `next/navigation`'s router) that build fine locally but silently break the exported site. Know this before touching routing or data-fetching:

- **Routing is not Next's file-based router beyond one catch-all.** `src/app/[[...slug]]/page.tsx` is the *only* real route (an optional catch-all matching `/`, `/:username`, `/:username/repo/:repo`, anything) and it just renders `<AppShell />`. There's no way to pre-render a page per possible GitHub username (infinite), so `generateStaticParams` only returns the root — every other path is unmatched at the static-file level.
- **`src/lib/spa-router.tsx`** is a small custom router (History API + `useSyncExternalStore`) that `AppShell` and `CommandCenter` use instead of `next/navigation`. Never import `useRouter`/`Link` from `next/navigation` or `next/link` for in-app navigation — there's no route for them to resolve to once exported. Use `useRoute().navigate(path)` instead.
- **The GitHub Pages 404 trick** makes deep links like `/octocat/repo/foo` work despite the above: `src/app/not-found.tsx` (becomes `out/404.html`) captures the unmatched URL and redirects to the real `index.html` with it encoded in a `?redirect=` param; an inline `beforeInteractive` script in `src/app/layout.tsx` decodes it back into a pretty URL via `history.replaceState` *before* the router or React ever reads `window.location`. Both halves read `NEXT_PUBLIC_BASE_PATH` (baked in at build time) so they agree with `next.config.ts`'s `basePath`. If you change the basePath, all three must stay in sync — they're not otherwise coupled.
- **All data fetching is client-side.** `src/lib/github.ts` calls `api.github.com` directly from the browser (it sends CORS headers for anonymous GETs — verified, no proxy needed). There is no server to hold a `GITHUB_TOKEN` safely, so requests are always unauthenticated (60 req/hr/IP rate limit) — don't reintroduce a token-based header. `src/components/AppShell.tsx` owns the fetch-on-username-change lifecycle; `src/lib/cache.ts` is a session-lived in-memory cache keyed by username (there's no edge/server cache to lean on either).
- **`src/app/manifest.ts`** needs `export const dynamic = "force-static"` or static export fails — don't remove it.

None of this applies if this project is ever redeployed somewhere with a real server (Vercel, etc.) — the code would still work there (the SPA shell doesn't require GitHub Pages specifically), it just wouldn't be using that host's server capabilities. Don't add server components/Route Handlers back without first deciding whether GitHub Pages is still the deploy target.

## Design tokens

- Color palette: [dofuuz/dimidium](https://github.com/dofuuz/dimidium) (Zlib-licensed terminal color scheme), defined as CSS custom properties in `src/app/globals.css`. Don't hand-pick new colors outside that palette without reason — it's a coherent, already-accessible-contrast set.
- Font: Ubuntu Sans Mono, loaded via `next/font/google` in `src/app/layout.tsx`.

## Key load-bearing decisions from the spec

### Routing (must-have)
- Primary route: `/:username` (e.g. `/gitussr`, `/octocat`). The first URL segment is always the active GitHub username — never hard-coded.
- Root `/` shows a username entry state, not a hard redirect.
- Filters/state live in the URL as query params (`?q=`, `?tech=`, `?status=`, `?created=`) so views are shareable.
- Deep links to a single repo: `/:username/repo/:repoName`, scoped strictly to that username — a repo of the same name under a different owner must never be shown.

### Data model
Two normalized interfaces (`src/lib/types.ts`) that all GitHub API responses get mapped into before touching UI components — see `src/lib/normalize.ts`. `owner` is always derived from the active username, never assumed.

### Local metadata layer
GitHub data alone can't explain *why* a repo exists. `src/data/repository-meta.ts` is a separate, optional, **namespaced-by-username** store supplying `status`, `why`, `tags`, `featured` overrides. Never fabricate this content for users who don't have it — fall back to neutral text ("not documented") instead of inventing personal context.

### Tech stack detection (critical — see §56)
Never infer a technology from a repo name or vibes. `src/lib/tech-detection.ts` only claims a technology when a repo's GitHub `topics` match a curated dictionary; GitHub's `language` field is surfaced separately as ground truth. When uncertain, show `stack unknown` rather than guessing.

### Command system
`src/lib/commands.ts` parses a lightweight `/command` palette (`/status`, `/tech`, `/created`, `/recent`, `/archived`, `/pages`, `/archaeology`, `/era`, `/techmap`, `/forgotten`, `/user`, `/help`, `/clear`, etc.) that augments — never replaces — normal click/filter UI (`QuickFilters`, `FilterChips`). Commands are composable and always operate on the currently active username's dataset. `/user <name>` switches the active username via the SPA router, which re-triggers the fetch and fully replaces the loaded dataset.

### Responsive requirement (hard constraint)
**320px is the minimum supported viewport and is non-negotiable.** No page-level horizontal scrolling, no fixed-width panels/timelines/code blocks that overflow. This applies to every component: command palette, repository cards, detail drawer (full-screen/bottom-sheet on mobile), era timeline (vertical), techmap bars, filter chips, clone-command blocks.

## Working from the spec

§66 asks for 3 proposed additional features (with usefulness/UX-fit/complexity notes) before final completion, with one recommended — don't skip this when doing further spec work.
