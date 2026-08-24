# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current state

This repository currently contains only a specification document — no application code has been written yet:

```
Master Prompt — Git USSR Repository Command Center.md
```

There is no package.json, build tooling, test runner, or source tree. Do not assume any framework, dependency, or file layout beyond what's described below until it has actually been scaffolded. Once a project is initialized, update this file with real build/lint/test commands — don't invent them now.

## What this project is

"Git USSR" is a terminal-inspired repository discovery site: given any public GitHub username in the URL, it dynamically fetches and displays that user's repositories as a searchable, keyboard-driven "command center." It is explicitly **not** a portfolio site, GitHub clone, or dashboard — see the "WHAT NOT TO BUILD" section of the master prompt (§61) for hard boundaries.

The full spec lives in the master prompt file (66+ sections). Key load-bearing decisions future work must honor:

### Routing (must-have)
- Primary route: `/:username` (e.g. `/gitussr`, `/octocat`). The first URL segment is always the active GitHub username — never hard-coded.
- Root `/` shows a username entry state, not a hard redirect.
- Filters/state live in the URL as query params (`?q=`, `?tech=`, `?status=`, `?created=`) so views are shareable.
- Deep links to a single repo: `/:username/repo/:repoName` (or `?repo=`), scoped strictly to that username — a repo of the same name under a different owner must never be shown.

### Data model
Two normalized interfaces (GitHub API responses must be mapped into these, not used raw in UI components):
```ts
interface GitHubUser {
    login: string; name: string | null; avatarUrl: string; bio: string | null;
    htmlUrl: string; blog: string | null; location: string | null;
    publicRepos: number; followers: number; following: number;
}
interface Repository {
    id: number; owner: string; name: string; description: string | null;
    url: string; homepage: string | null;
    createdAt: string; updatedAt: string; pushedAt: string;
    language: string | null; technologies: string[]; topics: string[];
    status: RepositoryStatus; stars: number; forks: number;
    archived: boolean; fork: boolean; hasPages: boolean; license: string | null;
    cloneUrl: string; sshUrl: string; why?: string; era?: string;
}
```
`owner` is always derived from the active username — never assumed.

### API layer
Keep GitHub API logic isolated from UI components behind functions like:
```ts
getGitHubUser(username)
getGitHubRepositories(username)
getRepositoryDetails(username, repositoryName)
```
Never expose GitHub tokens/credentials client-side; if auth or rate-limit mitigation requires a server component, keep it minimal (small backend/serverless layer) and server-side only.

### Local metadata layer
GitHub data alone can't explain *why* a repo exists. A separate, optional, **namespaced-by-username** local metadata store (e.g. `data/repository-meta.ts`) supplies `status`, `why`, `tags`, `featured` overrides. Never fabricate this content for users who don't have it — fall back to neutral text ("not documented") instead of inventing personal context.

### Tech stack detection (critical — see §56)
Never infer a technology from a repo name or vibes. Only claim a technology when there's real evidence: GitHub `language`, `package.json`/`composer.json`/`requirements.txt`/lockfiles, topics, README, framework config files. When uncertain, show `stack unknown` rather than guessing.

### Command system
A lightweight `/command` palette (`/status`, `/tech`, `/created`, `/recent`, `/archived`, `/pages`, `/archaeology`, `/era`, `/techmap`, `/forgotten`, `/user`, `/help`, `/clear`, etc.) augments — never replaces — normal click/filter UI. Commands are composable (`/tech typescript /status active`) and always operate on the currently active username's dataset. `/user <name>` switches the active username and must update the URL and fully replace the loaded dataset (no stale cross-user leakage).

### Caching
Cache repository/profile data keyed by username; client-side filtering/search happens instantly against the cached dataset. Switching usernames must invalidate/replace the cache entry for the old user's view, not merge with it.

### Responsive requirement (hard constraint)
**320px is the minimum supported viewport and is non-negotiable.** No page-level horizontal scrolling, no fixed-width panels/timelines/code blocks that overflow, no desktop-only multi-column layouts without a mobile stack fallback. This applies to every component: command palette, repository cards, detail drawer (becomes full-screen/bottom-sheet on mobile), era timeline (becomes vertical), techmap bars, filter chips, clone-command blocks.

### Visual language
Restrained terminal aesthetic (near-black background, monospace type, minimal chrome) borrowing the *interaction language* of a shell (commands, paths, status output) — not a literal fake-terminal-window skin everywhere. See §36–37.

## Working from the spec

When implementing against this spec:
1. Re-read the relevant numbered section(s) in the master prompt file before building that feature — it contains exact copy, example output, and responsive rules per feature.
2. Section §46 (data model) and §45 (architecture) are the contract other sections build on; keep changes consistent with them.
3. Section §68 ("Definition of Done") is the acceptance checklist for the whole project — use it to verify completeness before declaring work finished.
4. Section §66 asks for 3 proposed additional features (with usefulness/UX-fit/complexity notes) before final completion, with one recommended — don't skip this.
