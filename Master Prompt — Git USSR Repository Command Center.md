# MASTER PROMPT

## Build: Git USSR Repository Command Center

You are building a developer-first repository discovery website for GitHub users.

The website should function as a **searchable, terminal-inspired command center for a user's repositories**, rather than a traditional portfolio website.

The primary purpose is:

> **“What have I built, when did I build it, what is it, what is it built with, and where can I find it?”**

The interface must make answering those questions extremely fast.

The site must be fully responsive across all supported viewport sizes, with a minimum supported breakpoint of **320px**. Nothing may overflow, become unusable, or require horizontal scrolling at 320px wide.

---

# 1. CORE PRODUCT IDEA

Build a landing page that automatically discovers and presents repositories for any public GitHub user.

A user must be able to check their repository status simply by placing their GitHub user ID at the beginning of the URL.

Examples:

```text
https://your-domain.com/gitussr
```

```text
https://your-domain.com/octocat
```

```text
https://your-domain.com/sandesh
```

The first URL segment must be treated as the GitHub username.

The application should:

1. Read the username from the URL.
2. Validate and normalize it.
3. Fetch that user's public repositories dynamically from GitHub.
4. Display the repository command center for that user.
5. Preserve the username in all generated links, filters and deep links.
6. Show a clear error if the username is missing, invalid or unavailable.

The default example user may be:

```text
gitussr
```

but the application must not be hard-coded to that account.

Do NOT make this feel like:

- a generic developer portfolio
- a marketing landing page
- a card-heavy SaaS dashboard
- a conventional GitHub clone
- an over-designed glassmorphism website

Instead, make it feel like:

> **A Linux terminal + developer command palette + repository index.**

Think:

```text
$ repo status --user gitussr

58 repositories found

┌──────────────────────────────────────────────────────────────┐
│ cwp                                                          │
│ Hand-built TCP protocol implementation                       │
│                                                              │
│ created   2026-08-xx                                         │
│ tech      TypeScript                                         │
│ github    available                                          │
│ status    active                                             │
└──────────────────────────────────────────────────────────────┘
```

The experience should feel extremely fast, keyboard-friendly and intentional.

All layouts, controls, metadata rows, command interfaces and repository results must remain usable at widths down to 320px.

---

# 2. USER-BASED ROUTING

The primary route format must be:

```text
/:username
```

Examples:

```text
/gitussr
/octocat
/sandesh
```

The application should also support optional nested routes or query parameters for repository details and filters.

Examples:

```text
/gitussr/repo/cwp
```

```text
/gitussr?q=wordpress
```

```text
/gitussr?tech=typescript
```

```text
/gitussr?status=archived
```

```text
/gitussr?created=2024
```

If the user visits the root path without a username:

```text
/
```

show a concise username entry state:

```text
$ repo init

Enter a GitHub username to inspect.

[ GitHub username ]
[ Open repository index ]
```

The root page may optionally redirect to a default demo user, but the preferred behavior is to let the visitor enter a username.

If the username does not exist:

```text
$ repo status --user unknown-user

✗ GitHub user not found.

Check the username and try again.
```

If the user exists but has no public repositories:

```text
$ repo status --user example

✓ GitHub user found.

No public repositories available.
```

The username must be visible throughout the interface:

```text
gitussr/
repository index
```

or:

```text
$ repo list --owner gitussr
```

Do not display a generic title that hides whose repositories are being viewed.

---

# 3. IMPORTANT — DO NOT HARD-CODE THE REPOSITORIES OR USER

Use the GitHub API to discover repositories dynamically.

The username must come from the URL or the username input.

Do not hard-code:

- the GitHub username
- repository names
- repository counts
- languages
- technologies
- statuses
- dates
- links

Use GitHub's repository API wherever possible.

Repository metadata should be derived from GitHub rather than manually entered.

Useful metadata includes:

- repository name
- description
- HTML URL
- homepage
- created date
- updated date
- pushed date
- primary language
- topics
- stars
- forks
- archived status
- fork status
- default branch
- repository visibility
- GitHub Pages availability
- license
- issues availability
- wiki availability
- repository size

Do not expose unnecessary GitHub API complexity to the user.

The UI should present a clean developer-oriented abstraction.

The application must work for any public GitHub username that can be resolved through the API.

---

# 4. USER PROFILE HEADER

After loading a username, fetch and display basic public profile information where useful.

Possible information:

- username
- display name
- avatar
- bio
- profile URL
- public repository count
- followers
- following
- location
- personal website

Keep this compact.

Do not turn the page into a social profile or GitHub clone.

Example:

```text
$ repo status --user gitussr

gitussr/
repository index

A searchable archive of public repositories.

[ GitHub profile ↗ ]
```

If an avatar is displayed:

- provide meaningful alt text
- keep it visually secondary to the repository index
- ensure it does not consume excessive space on mobile
- do not let it cause layout overflow at 320px

If profile data is unavailable, continue loading repositories where possible.

---

# 5. PRIMARY UX

The first screen should immediately communicate the active username and repository index.

Possible headline:

```text
$ ls ~/projects
```

or:

```text
$ repo list --owner gitussr
```

Subheading:

```text
A searchable index of things I've built, experimented with,
learned from, and preserved.
```

For another user:

```text
$ repo list --owner octocat
```

Do NOT overdo the hero section.

The repository search interface should be the primary visual element.

At 320px wide:

- the heading must wrap naturally without clipping
- the username must remain visible
- the search field must fit within the viewport
- no fixed-width hero content may force horizontal scrolling
- command prompts must remain readable
- decorative elements must not push functional content off-screen

---

# 6. TERMINAL-INSPIRED INTERFACE

Create a highly polished Linux-terminal-inspired UI.

It must feel like a real developer tool, not a fake terminal gimmick.

Use concepts such as:

```text
$ repo
> user
> search
> status
> tech
> created
> recent
> archived
> pages
```

However:

**Do not force users to type commands.**

Commands are an enhancement.

Normal users should be able to click/filter/search normally.

Developers should be able to operate the entire interface from the keyboard.

The terminal-inspired layout must adapt responsively. Do not use fixed-width terminal panels that overflow at 320px. Any terminal-style output must wrap, stack or scroll internally only when necessary, without causing page-level horizontal scrolling.

The active username should be included in command output:

```text
$ /status --user gitussr
```

or:

```text
$ repo status --user gitussr
```

---

# 7. COMMAND SYSTEM

Implement a lightweight command palette.

Example commands:

```text
/status
/created
/updated
/tech
/language
/recent
/archived
/active
/pages
/github
/forks
/stars
/profile
/user
/help
/clear
```

Examples:

```text
/status active
```

```text
/tech TypeScript
```

```text
/created 2024
```

```text
/created before:2023
```

```text
/updated recent
```

```text
/pages available
```

```text
/status archived
```

Commands should modify the repository result set for the active username.

The system should provide autocomplete.

For example:

```text
/
├── status
├── created
├── updated
├── tech
├── language
├── recent
├── archived
├── pages
├── github
├── stars
├── forks
├── profile
├── user
└── help
```

Support explicit user switching through a command:

```text
/user octocat
```

or:

```text
/user gitussr
```

When the user changes, update the URL and reload the repository index for that username.

At 320px:

- autocomplete menus must fit within the viewport
- long command descriptions must wrap
- command rows must remain large enough to tap
- the palette must not extend beyond the screen
- use a full-width or full-screen mobile presentation when needed

---

# 8. GLOBAL SEARCH

The search box must support fuzzy search.

Search across:

- repository name
- description
- language
- topics
- technology
- status
- year
- GitHub metadata

Examples:

```text
wordpress
```

should find WordPress-related repositories for the active user.

```text
react
```

should find React projects.

```text
api
```

should find repositories whose name, description or topics relate to APIs.

```text
2024
```

should find repositories created in 2024.

Search must be instant.

Prefer client-side filtering after the initial repository dataset has loaded.

The search input must remain fully usable at 320px:

- use a single-column layout
- avoid placing search and controls side by side if they cannot fit
- allow the input to shrink naturally
- prevent placeholder text from overflowing
- ensure clear and submit controls remain accessible
- support touch interaction without requiring precision tapping

The search context must remain tied to the active username:

```text
Search repositories for gitussr...
```

---

# 9. REPOSITORY RESULT DESIGN

Each repository should have a compact but information-rich result.

Avoid giant cards.

Think:

```text
┌──────────────────────────────────────────────────────────────┐
│ ● cwp                                      TypeScript         │
│                                                              │
│ Hand-built TCP protocol implementation with binary framing, │
│ session handshakes and CRC-32 integrity checks.              │
│                                                              │
│ created   Aug 2026       updated   Aug 2026                 │
│ status    active         github    available                │
│ tech      TypeScript     pages     —                         │
│                                                              │
│ [GitHub ↗]                                                   │
└──────────────────────────────────────────────────────────────┘
```

The repository name should be the strongest visual element.

On narrow screens, transform the result into a stacked layout:

```text
┌──────────────────────────────┐
│ ● cwp                        │
│ TypeScript                   │
│                              │
│ Hand-built TCP protocol...   │
│                              │
│ created  Aug 2026            │
│ updated  Aug 2026            │
│ status   active              │
│ tech     TypeScript           │
│ pages    —                   │
│                              │
│ [GitHub ↗]                  │
└──────────────────────────────┘
```

At 320px:

- do not preserve desktop two-column alignment if it causes overflow
- metadata must wrap or stack
- long repository names must break safely or truncate with accessible full text
- buttons must fit within the viewport
- descriptions must wrap naturally
- no result card may exceed the viewport width
- avoid relying on horizontal scrolling for repository information

Every result must clearly belong to the active username context, even if the username is only shown in the page header.

---

# 10. DESCRIPTION

Every repository should have a short human-readable explanation.

Do not blindly display only the GitHub description.

Where the repository has a useful description, use it.

If the description is missing, attempt to derive a concise description from available repository metadata such as:

- README
- topics
- language
- repository name

However:

**Do not hallucinate project functionality.**

If no reliable description can be generated:

```text
No description available.
```

Descriptions must be responsive:

- use line wrapping rather than forced truncation where possible
- if truncation is necessary, provide an accessible way to view the full text
- do not use fixed heights that cut off text awkwardly on small screens

---

# 11. TECH STACK DETECTION

Do more than display GitHub's primary language.

Create a small technology-detection layer.

Inspect repository metadata/files where appropriate.

Examples:

```text
TypeScript
Node.js
Express
React
Next.js
PHP
WordPress
WooCommerce
Python
MySQL
MongoDB
HTML
CSS
JavaScript
Tailwind
Bootstrap
Docker
```

The technology display should distinguish between:

```text
Language
```

and:

```text
Stack
```

Example:

```text
language   TypeScript
stack      Node.js · Express · PostgreSQL
```

Do not falsely infer technologies.

Only show a technology when there is reasonable evidence.

Technology tags must wrap cleanly at 320px. Do not force all tags into one horizontal row. Use wrapping, stacking or a compact overflow treatment with accessible disclosure.

---

# 12. GITHUB AVAILABILITY

Every repository should clearly indicate GitHub availability.

For example:

```text
github   ● available
```

Clicking it should open the actual repository.

Also detect:

```text
pages   ● available
```

when GitHub Pages is available.

If a repository has an external homepage:

```text
demo     ↗ available
```

This creates an important distinction between:

```text
source
demo
documentation
```

Action links must remain usable at 320px:

- buttons may stack vertically
- links must not be squeezed into unreadable widths
- icon-only controls require accessible labels
- external-link indicators must not cause overflow

---

# 13. REPOSITORY STATUS

Create meaningful statuses.

At minimum:

```text
active
archived
fork
```

Consider:

```text
active
experimental
learning
legacy
archived
fork
```

Do not invent these statuses from arbitrary assumptions.

Where GitHub metadata cannot establish a status, allow a small local metadata layer to override/enrich the repository.

For example:

```js
{
  "repo": "sandesh-lib",
  "status": "legacy",
  "note": "Early learning project preserved for historical value."
}
```

This local metadata layer is important because GitHub alone cannot explain the *story* behind a repository.

Status indicators must include text and must remain understandable without color.

---

# 14. CREATED / UPDATED INFORMATION

Implement:

```text
/created
```

and:

```text
/updated
```

Allow sorting:

```text
created: newest
created: oldest

updated: newest
updated: oldest
```

Display dates in a human-friendly format:

```text
created  24 Aug 2026
```

Optionally provide relative time:

```text
updated  2 days ago
```

On hover or expanded view, show the exact timestamp.

Date metadata must adapt at 320px:

- labels and values may stack
- dates must not be forced into a single line
- use concise formats on narrow screens when appropriate
- preserve exact dates through accessible labels or detail views

---

# 15. INTERESTING "REPOSITORY AGE" FEATURE

Add a subtle:

```text
age
```

field.

Example:

```text
created  2020
age      6 years
```

This is especially useful for a personal repository archive because it visually communicates the evolution of the developer.

---

# 16. "REPOSITORY DNA"

Add a creative feature called:

```text
repo dna
```

Each repository gets a compact DNA summary:

```text
DNA

language   TypeScript
stack      Node.js
type       protocol / backend
era        2026
status     active
```

This should feel like developer metadata rather than a marketing badge.

On narrow screens, display DNA as a vertical list or responsive grid that fits within 320px. Do not use a fixed multi-column layout that becomes cramped or overflows.

---

# 17. "WHY IT EXISTS"

This is one of the most important features.

A repository is not merely code.

Some repositories may exist because:

- they were learning experiments
- they were client projects
- they were experiments with a technology
- they were portfolio projects
- they were abandoned
- they were early attempts
- they are legacy projects worth preserving
- they evolved into something else

Allow optional local metadata:

```text
why

Built while learning Fetch API.
```

or:

```text
why

A legacy experiment preserved as part of my development history.
```

This turns the website from a GitHub index into a **developer history archive**.

The “why” content must wrap naturally on small screens and must not be hidden behind inaccessible hover-only interactions.

For arbitrary GitHub users, local metadata may be unavailable. In that case, omit the section or display:

```text
why     not documented
```

Do not invent personal context for another user.

---

# 18. "ERA" FILTER

Introduce an optional concept:

```text
/era
```

Example:

```text
/era 2020
/era 2021
/era 2024
/era 2026
```

Or UI:

```text
2020 ───── 2021 ───── 2022 ───── 2023 ───── 2024 ───── 2025 ───── 2026
```

Repositories appear along the timeline.

This could become one of the site's most interesting visual features.

It shows how a user's technical interests evolved over time.

On screens near 320px, the timeline must not force page-level horizontal scrolling. Use one of the following responsive approaches:

- convert the timeline into a vertical timeline
- allow controlled horizontal scrolling inside the timeline component only
- collapse years into a selectable list
- use a compact stacked chronology

The preferred mobile experience is a vertical timeline or stacked year list.

---

# 19. TECHNOLOGY EVOLUTION

Add an optional view:

```text
/techmap
```

It should answer:

> What technologies has this user used throughout their repository history?

Example:

```text
HTML
████████████████

JavaScript
██████████████

PHP
██████████

TypeScript
██████

React
████

Python
███
```

Do not make this a giant analytics dashboard.

Keep it compact and terminal-like.

At 320px:

- bars must scale to the available width
- labels must wrap or use a stacked layout
- do not use fixed-width charts
- ensure text remains readable
- provide text equivalents for visual bars

---

# 20. "RECENTLY TOUCHED"

Implement:

```text
/recent
```

Show repositories that were most recently updated for the active username.

Example:

```text
$ /recent --user gitbit

01  gitbit             updated 2 days ago
02  custom-theme       updated 5 days ago
03  cwp                updated 8 days ago
```

On narrow screens, use a stacked list:

```text
01  gitbit
    updated 2 days ago
```

Do not force numbered entries, names and dates into a single line if they do not fit.

---

# 21. "LOST / FORGOTTEN" MODE

Add an interesting discovery feature:

```text
/forgotten
```

This finds repositories that:

- are old
- have not been updated for a long time
- are not archived
- have little activity

Example:

```text
$ /forgotten --user gitussr

You haven't touched these in a while.

likealot       last update 2021
woman          last update 2020
...
```

For another user's repositories, avoid claiming personal ownership or behavior unless the interface is explicitly framed as an observation:

```text
These repositories have not been updated recently.
```

This should be playful rather than judgmental.

Possible message:

```text
> archaeology mode enabled
```

Ensure the output wraps cleanly at 320px.

---

# 22. "ARCHAEOLOGY MODE"

This could be a signature feature.

Command:

```text
/archaeology
```

It reveals old repositories and presents them as pieces of development history.

Example:

```text
┌───────────────────────────────────────────┐
│ ARCHIVE / 2020                            │
│                                           │
│ likealot                                  │
│ Early web experiment                      │
│                                           │
│ HTML                                      │
│                                           │
│ "One of the early experiments."           │
└───────────────────────────────────────────┘
```

For arbitrary users, only display personal commentary when it is available from local metadata or reliable repository information.

Otherwise use neutral wording:

```text
Repository created in 2020.
```

This makes the site memorable.

At 320px:

- archive panels must become full-width
- internal content must wrap
- decorative borders must not create overflow
- timeline content should stack vertically
- animations must remain subtle and must not interfere with scrolling

---

# 23. REPOSITORY DETAIL PANEL

Clicking a repository should NOT necessarily navigate away immediately.

Open a command-center style detail drawer/panel.

Display:

```text
repository
description

owner
created
updated
language
stack
topics
status
license

github
demo
pages

stars
forks

why
```

The owner should link to or identify the active username:

```text
owner    gitussr
```

Actions:

```text
[ Open GitHub ]
[ Open Demo ]
[ Copy Clone URL ]
[ View User Profile ]
```

Responsive behavior is required:

- desktop may use a side drawer
- tablet may use a narrower drawer or modal
- at 320px, use a full-screen modal or bottom sheet
- the panel must not extend beyond the viewport
- close controls must remain visible and reachable
- content must scroll within the panel without causing body-level horizontal scrolling
- focus must be trapped appropriately while open
- the panel must be dismissible with Escape and an accessible close button

---

# 24. CLONE COMMAND

This is a particularly developer-friendly feature.

Each repository should have:

```text
$ git clone https://github.com/gitussr/repository.git
```

with a copy button.

For another user:

```text
$ git clone https://github.com/octocat/repository.git
```

Also provide:

```text
$ git clone git@github.com:gitussr/repository.git
```

when appropriate.

After copying:

```text
✓ copied to clipboard
```

This should feel like a real CLI utility.

At 320px:

- clone commands may wrap across multiple lines
- use a horizontally scrollable code region only if necessary, with clear touch support
- never let the code block force the entire page wider than the viewport
- keep the copy button accessible and visible
- provide an accessible full command label

---

# 25. COMMAND PALETTE

Support keyboard shortcut:

```text
Ctrl + K
```

or:

```text
/
```

to focus search.

Command palette:

```text
╭──────────────────────────────────────────────╮
│ > search repositories for gitussr...         │
├──────────────────────────────────────────────┤
│ /status                                      │
│ /tech                                        │
│ /created                                     │
│ /updated                                     │
│ /recent                                      │
│ /archived                                    │
│ /pages                                       │
│ /archaeology                                 │
│ /user                                        │
│ /help                                        │
╰──────────────────────────────────────────────╯
```

Keyboard navigation:

```text
↑ ↓
Enter
Esc
```

must work.

Responsive requirements:

- desktop: centered command palette with a constrained width
- mobile: full-width or full-screen command palette
- at 320px: no fixed minimum width
- input and suggestions must fit inside the viewport
- touch targets must be at least comfortably tappable
- long commands and descriptions must wrap
- the palette must not be clipped by the viewport

---

# 26. /HELP

Implement:

```text
/help
```

Show the available commands in a beautiful terminal-style panel.

Example:

```text
AVAILABLE COMMANDS

/status       Filter repository status
/created      Sort/filter by creation date
/updated      Sort/filter by update date
/tech         Filter by technology
/language     Filter by language
/recent       Recently updated repositories
/archived     Archived repositories
/pages        GitHub Pages repositories
/archaeology  Explore old projects
/era          Explore repositories by year
/techmap      Technology evolution
/forgotten    Long-neglected repositories
/user         Switch GitHub user
/profile      Open the active GitHub profile
/clear        Reset filters
/help         Show this help
```

At 320px, use a two-line command row when necessary:

```text
/status
Filter repository status
```

Do not shrink text below a readable size merely to preserve desktop alignment.

---

# 27. URL-BASED STATE

This is MUST-HAVE.

Filters should be represented in the URL while preserving the active username.

Examples:

```text
/gitussr?tech=typescript
```

```text
/gitussr?status=archived
```

```text
/gitussr?created=2024
```

```text
/gitussr?q=wordpress
```

This makes searches shareable.

A developer should be able to copy the URL and send someone directly to a filtered repository view for a specific user.

Changing the username must update the path:

```text
/gitussr
```

to:

```text
/octocat
```

Do not store the active username only in client-side state.

---

# 28. DEEP LINKING

Every repository should have a stable URL that includes the username.

Example:

```text
/gitussr/repo/cwp
```

or:

```text
/gitussr?repo=cwp
```

For another user:

```text
/octocat/repo/Hello-World
```

Opening that URL should directly display the repository detail panel.

Deep-linked detail panels must work at 320px and open in the responsive full-screen or bottom-sheet presentation.

If the repository does not exist for the active username:

```text
✗ Repository not found for this user.
```

Do not silently display a repository with the same name from another user.

---

# 29. QUICK STATS

At the top, show only useful statistics for the active username.

For example:

```text
58 repos
17 languages
12 technologies
8 active
14 archived
```

Do not create a huge analytics dashboard.

The numbers should support discovery.

At narrow widths, stats may wrap into multiple rows or become a compact vertical list. Do not force all statistics into one line.

If GitHub's profile repository count differs from the fetched public repository count, label the value clearly:

```text
58 public repositories indexed
```

---

# 30. EMPTY STATES

Make empty states interesting.

Example:

```text
$ /tech rust --user gitussr

No repositories found.

Try:

/tech typescript
/tech javascript
/language rust
```

Or:

```text
> nothing matched.

Maybe the repository is hiding.
```

Avoid generic:

```text
No results found.
```

Empty-state content must fit within 320px and wrap naturally.

For a user with no repositories:

```text
$ repo status --user example

✓ user found

No public repositories are available to index.
```

---

# 31. LOADING STATE

Do not show a generic spinner.

Use terminal output:

```text
$ repo init --user gitussr

fetching profile...
fetching repositories...
████████████████████ 100%

✓ repository index ready
```

Keep it extremely brief.

The loading indicator must scale to narrow screens. Progress bars must use available width rather than a fixed width.

When switching users:

```text
$ repo switch --user octocat
```

show a short transition state without making the interface feel slow.

---

# 32. ERROR HANDLING

If GitHub API fails:

```text
$ repo status --user gitussr

✗ GitHub API unavailable.

The repository index could not be refreshed.

[ Retry ]
```

If cached data exists, show cached data:

```text
⚠ showing cached repository index for gitussr
```

Do not make the entire site unusable because of a temporary API failure.

Error panels and retry controls must fit within 320px and remain easy to tap.

If the username is invalid:

```text
✗ Invalid GitHub username.
```

If the username is not found:

```text
✗ GitHub user not found.
```

If the API rate limit is reached:

```text
✗ GitHub API rate limit reached.

Try again later or view cached data.
```

---

# 33. CACHE STRATEGY

Do not hammer the GitHub API.

Implement sensible caching keyed by username.

Possible architecture:

```text
GitHub API
    ↓
User profile + repositories
    ↓
Normalize
    ↓
Cache by username
    ↓
Frontend search/filter
```

The UI should feel instant after initial loading.

If necessary, introduce a small backend/serverless endpoint to safely cache GitHub responses.

Do NOT expose private GitHub credentials in the browser.

Cache entries must not leak data between users.

When switching from one username to another:

- clear or replace the active repository dataset
- update the visible username immediately
- prevent stale repositories from appearing under the new username
- preserve only shared UI preferences where appropriate

---

# 34. ACCESSIBILITY

This must be production-quality.

Requirements:

- keyboard navigation
- visible focus states
- semantic HTML
- accessible buttons
- accessible command palette
- reduced-motion support
- readable contrast
- screen-reader labels
- no interaction dependent solely on color
- no tiny unreadable text
- accessible modal and drawer behavior
- logical focus order
- touch-friendly controls
- no content hidden only on hover
- accessible username input
- accessible user-switching controls
- clear announcements when repository data changes

Terminal aesthetics must never compromise usability.

At 320px, preserve readable text and usable controls instead of compressing the interface excessively.

---

# 35. RESPONSIVE DESIGN

Mobile-first.

The application must work beautifully at:

```text
320px
375px
390px
768px
1024px
1440px+
```

**320px is the minimum supported viewport width and must be treated as a hard requirement.**

At every width:

- no page-level horizontal scrolling
- no clipped text or controls
- no fixed-width component that exceeds the viewport
- no overlapping content
- no inaccessible off-screen buttons
- no layout that depends on hover
- no unreadable metadata
- no broken terminal borders
- no command palette overflow

On mobile:

- command palette becomes full-width
- repository entries become compact
- metadata wraps intelligently
- avoid horizontal scrolling
- maintain terminal character
- controls may stack vertically
- detail panels become full-screen or bottom sheets
- timelines become vertical or compact
- stats wrap or stack
- technology tags wrap
- long commands wrap or scroll within their own code container
- username switching remains easy to access

Do not simply shrink the desktop UI.

Design mobile intentionally.

Use responsive CSS with fluid sizing where appropriate, such as:

- flexible widths
- `minmax(0, 1fr)`
- `clamp()` for typography
- `max-width: 100%`
- safe text wrapping
- responsive gaps and padding
- breakpoint-specific layout changes

Avoid relying only on a single breakpoint. Test the layout at 320px, 375px, 390px, 768px, 1024px and 1440px or wider.

---

# 36. VISUAL LANGUAGE

Use a restrained terminal aesthetic.

Possible visual characteristics:

- near-black background
- subtle borders
- monospace typography
- terminal cursor
- tiny status indicators
- restrained accent color
- subtle grid/noise texture
- thin separators
- compact spacing
- minimal shadows
- no excessive gradients

Use a proper monospace font.

Possible:

```text
Ubuntu Mono
JetBrains Mono
IBM Plex Mono
```

Do not use too many fonts.

Ensure the chosen font remains legible at 320px. Do not use decorative typography that becomes cramped or unreadable on small screens.

The active username should be visually prominent but not overpower the repository content.

---

# 37. TERMINAL WITHOUT THE GIMMICK

Important:

Do not make the entire page look like a fake terminal window with:

```text
┌───────────────┐
│ Terminal      │
│ $ hello       │
└───────────────┘
```

everywhere.

Instead, borrow the **interaction language** of Linux:

```text
commands
paths
stdin-like search
keyboard navigation
status output
logs
compact metadata
```

The website should still feel like a polished modern product.

Terminal styling must remain responsive. Decorative borders and ASCII layouts must never create horizontal overflow at 320px.

---

# 38. EASTER EGG

Add a small developer Easter egg.

Typing:

```text
sudo make portfolio
```

could return:

```text
[sudo] password for developer:

Nice try.

This isn't a portfolio.

It's a repository archaeology tool.
```

Keep it harmless and subtle.

Other possible Easter eggs:

```text
sudo rm -rf /
```

must NEVER actually execute anything.

Simply return a humorous terminal response.

Easter-egg output must wrap correctly on narrow screens.

The Easter egg should work for any active username without executing real shell commands.

---

# 39. "ABOUT THIS PROJECT"

Do not create a giant About section.

Near the bottom:

```text
Why this exists

GitHub tells you what repositories exist.

This interface tells you what they mean.
```

Then:

```text
Built as a searchable archive of development journeys.
```

Keep it concise.

The section must remain readable and properly spaced at 320px.

Avoid implying that every user's repositories have been personally curated unless local metadata exists.

---

# 40. DESIGN SYSTEM FIRST

Before implementing the page, establish a small design system.

Define:

### Typography

- display
- command
- repository name
- body
- metadata
- terminal output

### Colors

- background
- surface
- border
- primary text
- muted text
- success
- warning
- error
- accent

### Components

- username input
- user header
- command input
- command palette
- repository result
- metadata row
- status indicator
- technology tag
- detail drawer
- timeline
- empty state
- loading state
- error state
- toast
- keyboard hint

Do not start by randomly styling individual components.

Define responsive behavior for each component before implementation:

- minimum usable width
- wrapping behavior
- stacking behavior
- mobile spacing
- touch target size
- overflow handling

---

# 41. UX PRINCIPLE

Every UI element should answer one of these questions:

```text
Which user am I viewing?
What is this repository?
When was it created?
When was it last updated?
What technology does it use?
Is it active?
Can I visit it?
Can I see a demo?
Why does it exist?
```

If an element does not contribute to discovery, remove it.

At 320px, prioritize these questions over decorative elements.

---

# 42. PERFORMANCE

Performance is important.

Requirements:

- fast initial render
- lazy-load expensive repository details
- debounce search where necessary
- client-side filtering should be instant
- avoid unnecessary API requests
- cache repository data by username
- avoid heavy animation libraries unless justified
- minimize JavaScript
- optimize fonts
- no giant UI framework if unnecessary

The site should feel like a CLI:

```text
instant
```

Responsive behavior must not depend on expensive layout calculations or heavy animations.

Switching between usernames should not require a full page reload unless the architecture makes that necessary.

---

# 43. SEO

Although this is a developer tool, make it indexable.

Include:

```text
title
description
Open Graph
Twitter/X metadata
canonical URL
structured metadata where useful
```

The metadata should reflect the active username when possible.

Example title:

```text
Git USSR — Repository Index
```

For another user:

```text
Octocat — Repository Index
```

Example description:

```text
A searchable command center for gitussr's GitHub repositories.
```

For dynamic usernames:

```text
A searchable command center for octocat's GitHub repositories.
```

---

# 44. PWA / INSTALLATION

Consider making the site installable as a lightweight PWA.

It should be possible to open it like a developer utility:

```text
GitHub Repository Index
```

However:

**Do not add PWA complexity unless it provides real value.**

If implemented, ensure the installed experience remains usable at 320px.

Do not cache one user's repository data in a way that makes it appear as another user's data.

---

# 45. TECHNOLOGY ARCHITECTURE

Choose the simplest modern architecture appropriate for this project.

Preferred characteristics:

- component-based frontend
- TypeScript
- clean data layer
- API abstraction
- client-side search/filtering
- accessible command palette
- responsive CSS
- no unnecessary dependencies
- route-based username handling
- cache keyed by username

Do not over-engineer the backend.

If the GitHub public API is sufficient, use it.

If caching or rate limiting requires a server-side layer, introduce the smallest possible backend/serverless layer.

The API layer should expose functions similar to:

```ts
getGitHubUser(username)
getGitHubRepositories(username)
getRepositoryDetails(username, repositoryName)
```

Keep GitHub API-specific logic separate from UI components.

---

# 46. DATA MODEL

Normalize GitHub data into an internal structure similar to:

```ts
interface GitHubUser {
    login: string;
    name: string | null;
    avatarUrl: string;
    bio: string | null;
    htmlUrl: string;
    blog: string | null;
    location: string | null;
    publicRepos: number;
    followers: number;
    following: number;
}
```

```ts
interface Repository {
    id: number;
    owner: string;
    name: string;
    description: string | null;

    url: string;
    homepage: string | null;

    createdAt: string;
    updatedAt: string;
    pushedAt: string;

    language: string | null;
    technologies: string[];

    topics: string[];

    status: RepositoryStatus;

    stars: number;
    forks: number;

    archived: boolean;
    fork: boolean;

    hasPages: boolean;

    license: string | null;

    cloneUrl: string;
    sshUrl: string;

    why?: string;
    era?: string;
}
```

Keep GitHub API-specific structures separate from the UI model.

The `owner` field must always be derived from the active GitHub username and must not be assumed to be `gitussr`.

---

# 47. LOCAL METADATA

Create an optional local metadata file.

Example:

```text
data/
    repository-meta.ts
```

or equivalent.

Use it for information GitHub cannot know:

```ts
{
    "gitussr": {
        "repo-name": {
            status: "legacy",
            why: "Built while learning Fetch API.",
            tags: ["learning", "legacy"],
            featured: false
        }
    }
}
```

The metadata structure must be namespaced by username so that one user's context cannot be applied to another user's repository with the same name.

The GitHub API remains the source of truth for GitHub metadata.

Local metadata provides context and storytelling.

For users without local metadata, do not fabricate personal explanations.

---

# 48. FEATURED REPOSITORY

Do NOT create a traditional "Featured Projects" marketing section.

Instead support:

```text
/featured
```

This simply filters repositories marked as noteworthy in local metadata.

Example:

```text
$ /featured --user gitussr

Selected projects

cwp
gitbit
...
```

For users without local featured metadata:

```text
No locally featured repositories for this user.
```

The featured list must use the same responsive result layout as the main repository index.

---

# 49. SORTING

Support:

```text
newest
oldest
recently updated
alphabetical
stars
forks
```

Potential command syntax:

```text
/sort newest
/sort oldest
/sort stars
/sort forks
```

Sorting controls must remain usable at 320px. If a horizontal control row does not fit, stack the controls or use a compact select/menu.

Sorting must apply only to the active username's repository dataset.

---

# 50. FILTER COMBINATIONS

Commands must be composable.

Example:

```text
/tech typescript /status active
```

or through UI:

```text
Technology: TypeScript
Status: Active
Created: 2026
```

The result count should update instantly:

```text
12 repositories match for gitussr
```

Filter chips must wrap or stack at 320px. Do not force all active filters into one line.

---

# 51. COMMAND HISTORY

Add lightweight command history.

For example:

```text
↑
```

recalls previous searches/commands.

Example:

```text
$ /tech typescript
$ /status active
$ /created 2026
```

Pressing ↑ should recall the previous command.

Command history must remain functional with mobile keyboards and touch interfaces. Do not make it keyboard-only.

History should be scoped appropriately. It may be global, but commands must always execute against the currently active username.

---

# 52. KEYBOARD SHORTCUTS

Support:

```text
/
Ctrl + K
Esc
↑ ↓
Enter
```

Optional:

```text
g h
```

→ GitHub profile for the active user

```text
g r
```

→ repository index for the active user

```text
?
```

→ help

Display shortcuts subtly.

On mobile, provide visible touch-accessible alternatives because physical keyboard shortcuts may not be available.

---

# 53. COMMAND OUTPUT STYLE

Command responses should feel like actual shell output.

Example:

```text
$ /tech typescript --user gitussr

Found 7 repositories for gitussr.

01  cwp
    TCP protocol implementation
    created 2026
    active

02  gitbit
    Git learning utility
    created 2026
    active
```

Avoid excessive decoration.

At 320px, command output should use stacked rows and wrap long text rather than preserving desktop columns.

---

# 54. SECURITY

Never expose:

- GitHub tokens
- private credentials
- server secrets
- API secrets

If authentication becomes necessary, keep it server-side.

For a public repository explorer, prefer public GitHub data.

Validate and sanitize usernames before using them in API requests, routes or rendered content.

Do not allow arbitrary input to become executable shell commands.

---

# 55. GITHUB API LIMITATIONS

Handle:

- API rate limits
- pagination
- network failures
- incomplete metadata
- repositories with no description
- repositories with no language
- repositories with no homepage
- archived repositories
- forks
- users with many repositories
- users with no public repositories
- invalid usernames
- deleted or renamed repositories

Do not assume every repository has the same metadata.

GitHub's repository API supports pagination, and repository responses contain fields such as creation/update timestamps, language, homepage, topics, Pages availability, archive/fork state, stars and forks.

The application must fetch all public repositories needed for the index, while respecting pagination and rate limits.

---

# 56. IMPORTANT: NO HALLUCINATED TECH STACKS

This is critical.

Never say:

```text
React
```

simply because a repository is named something that sounds React-related.

Use evidence.

Possible evidence sources:

1. GitHub language metadata
2. package.json
3. composer.json
4. requirements.txt
5. pyproject.toml
6. package-lock.json
7. pnpm-lock.yaml
8. yarn.lock
9. framework-specific configuration
10. repository topics
11. README

If uncertain:

```text
stack     unknown
```

is better than an incorrect claim.

This rule applies equally to every GitHub username.

---

# 57. ACCESSIBILITY OF TERMINAL COLORS

Do not rely solely on:

```text
green = active
red = error
yellow = warning
```

Also include text:

```text
● ACTIVE
● ARCHIVED
● FORK
```

---

# 58. MOBILE COMMAND EXPERIENCE

On mobile, provide a floating command/search trigger.

Example:

```text
┌─────────────────────────────┐
│ $ search repositories...    │
└─────────────────────────────┘
```

The command palette should become a bottom sheet or full-screen interface.

At 320px:

- the trigger must fit within the viewport
- it must not obscure important content
- it must have a clear accessible label
- it must remain usable with touch
- the bottom sheet or full-screen palette must respect safe areas
- close and back controls must remain visible
- the active username must remain clear

---

# 59. FINAL LANDING PAGE STRUCTURE

Keep the page compact.

Recommended structure:

```text
HEADER

username/
repository index

[ command/search ]

quick stats

repository results

(optional timeline / archaeology section)

short "why this exists"

footer
```

For the root route:

```text
HEADER

GitHub repository index

[ enter username ]

short explanation

footer
```

Do not create:

- giant hero
- testimonials
- pricing
- marketing sections
- unnecessary illustrations
- excessive animations

At 320px, each section should use a single-column layout with responsive spacing.

---

# 60. THE SIGNATURE EXPERIENCE

The site should have one unforgettable interaction.

Recommended:

### Repository Archaeology Timeline

User executes:

```text
$ /archaeology --user gitussr
```

The site transitions into:

```text
DEVELOPMENT HISTORY / gitussr

2020
│
├── project-a
├── project-b
│
2021
│
├── project-c
│
2022
│
├── project-d
│
2024
│
├── project-e
│
2026
│
├── cwp
├── gitbit
└── ...
```

For another user:

```text
$ /archaeology --user octocat
```

This transforms a collection of GitHub repositories into a **visual history of technical evolution**.

Keep the animation subtle and fast.

On mobile, especially at 320px, use a vertical timeline or stacked year sections rather than a wide horizontal timeline.

---

# 61. WHAT NOT TO BUILD

Do NOT turn this into:

- LinkedIn
- GitHub clone
- traditional portfolio
- blog
- CMS
- social network
- analytics-heavy dashboard
- unnecessary authentication system
- unnecessary database
- giant animation showcase

The product is:

> **A developer-friendly repository index for any public GitHub user.**

---

# 62. DEVELOPMENT WORKFLOW

Before coding:

1. Inspect the GitHub API behavior for arbitrary usernames.
2. Determine how username-based routing will work.
3. Test valid, invalid and nonexistent usernames.
4. Inspect representative repositories from multiple users.
5. Identify common languages and technologies.
6. Identify missing GitHub metadata.
7. Determine which information can be derived automatically.
8. Design the user and repository data models.
9. Design the command system.
10. Establish the design system.
11. Define responsive behavior for every major component.
12. Build the interface.

Do not start implementation blindly.

---

# 63. TESTING

Test at minimum:

### User routes

```text
/
 /gitussr
/octocat
/invalid-user-name
```

### User switching

```text
/user gitussr
/user octocat
```

### Search

```text
wordpress
typescript
react
api
```

### Commands

```text
/status
/status active
/tech typescript
/created 2026
/recent
/archived
/pages
/archaeology
/forgotten
/profile
/user octocat
/help
/clear
```

### Keyboard

```text
/
Ctrl + K
↑
↓
Enter
Esc
```

### Responsive

```text
320px
375px
390px
768px
1024px
1440px
```

At 320px specifically verify:

- no horizontal page scrolling
- no clipped headings
- no overflowing search controls
- no broken repository cards
- no inaccessible buttons
- no clipped command palette
- no overflowing metadata
- no broken modal or drawer
- no unreadable text
- no timeline overflow
- no code block forcing page width
- no overlapping fixed or floating controls
- username input remains usable
- user-switching controls remain usable

### Failure cases

- GitHub API unavailable
- invalid username
- nonexistent username
- user with no public repositories
- user with many repositories
- empty description
- empty language
- missing homepage
- no GitHub Pages
- archived repository
- forked repository
- no detected technology
- rate limit
- repository not found in a deep link
- stale cache from a previous username

---

# 64. QUALITY BAR

The final result must feel like a real developer product.

Not:

> "A website with a terminal theme."

Instead:

> "A useful repository discovery tool that happens to have a terminal-native interaction model."

The difference is extremely important.

Prioritize:

```text
UX
speed
clarity
keyboard interaction
accessibility
data accuracy
responsive design
visual restraint
correct username routing
safe user switching
```

Responsive design is not complete unless the site works at the required 320px breakpoint.

---

# 65. FINAL PRODUCT STATEMENT

The product should communicate this idea immediately:

> **GitHub tells me where my code lives.**\
> **This tells me what I've built.**

For every user:

> **Put your GitHub user ID at the beginning of the URL and inspect your repository history.**

Possible footer:

```text
username / repository index

built for archaeology, discovery & remembering
```

---

# 66. FINAL CREATIVE REQUIREMENT

Before considering the project complete, independently propose **3 additional features** that fit the philosophy of the product.

For each feature, explain:

```text
feature
why it is useful
why it fits the terminal UX
implementation complexity
```

Do NOT blindly implement all three.

Recommend the strongest one first.

The goal is to discover something more interesting than a simple repository browser.

---

# 67. IMPLEMENTATION RULE

Work incrementally.

After each meaningful phase:

1. implement
2. run/build
3. test
4. inspect the UI
5. fix issues
6. verify responsive behavior at 320px and larger breakpoints
7. verify keyboard navigation
8. verify username routing
9. verify user switching
10. verify API/data handling
11. verify cache isolation between users
12. report what changed

Do not declare the project finished simply because it builds.

---

# 68. DEFINITION OF DONE

The project is complete only when:

- a user can open `/:username` to inspect that GitHub user's public repositories.
- the root route provides a username entry experience.
- GitHub user profiles are loaded dynamically.
- GitHub repositories are loaded dynamically for the active username.
- no username or repository data is hard-coded.
- invalid usernames are handled.
- nonexistent usernames are handled.
- users with no public repositories are handled.
- repository search works.
- `/status` works.
- `/created` works.
- `/updated` works.
- `/tech` works.
- `/language` works.
- `/recent` works.
- `/archived` works.
- `/pages` works.
- `/help` works.
- `/clear` works.
- `/user` works.
- keyboard navigation works.
- command history works.
- repository detail view works.
- GitHub links work.
- clone command copying works.
- URL state/deep linking works.
- username switching updates the URL and dataset.
- repository details cannot be opened under the wrong username.
- responsive UI works from 320px upward.
- no page-level horizontal scrolling occurs at 320px.
- API failures are handled.
- caching is sensible and isolated by username.
- technology detection does not hallucinate.
- accessibility has been tested.
- loading and empty states are polished.
- archaeology mode works.
- the UI feels like a real developer utility.
- no unnecessary features have been added.
- all major components have been tested at the 320px breakpoint.

---

# 69. MOST IMPORTANT DESIGN PRINCIPLE

When making a decision, ask:

```text
Would a developer actually use this for any GitHub user?
```

If yes:

```text
build it.
```

If it merely makes the screenshot look impressive:

```text
remove it.
```

The final product should be **minimal, fast, useful, slightly nerdy, memorable, user-aware, and fully usable down to 320px wide.**
