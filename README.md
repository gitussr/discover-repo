# Git USSR — Repository Command Center

A searchable, terminal-inspired command center for any public GitHub user's repositories. Put a GitHub username at the start of the URL — `/octocat`, `/gitussr`, `/anyone` — and it dynamically fetches and indexes that user's public repos: no hard-coded users, repos, or metadata.

Full product spec: [`Master Prompt — Git USSR Repository Command Center.md`](./Master%20Prompt%20%E2%80%94%20Git%20USSR%20Repository%20Command%20Center.md). Architecture notes for contributors (human or AI): [`CLAUDE.md`](./CLAUDE.md).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then visit `/octocat` (or any public GitHub username).

## Environment variables

None are required — the app works against GitHub's public, unauthenticated API. Optionally set `GITHUB_TOKEN` (a fine-grained PAT with no special scopes, read-only public access) in a local `.env.local` to raise the GitHub API rate limit from 60 to 5,000 requests/hour. It is read server-side only and never sent to the client.

## Scripts

- `npm run dev` — start the dev server (Turbopack)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint

## Local repository metadata

`src/data/repository-meta.ts` is an optional, namespaced-by-username override layer for context GitHub can't provide (`status`, `why`, `featured`). It ships empty — see the file's comment for the shape.
