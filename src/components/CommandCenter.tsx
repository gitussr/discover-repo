"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRoute } from "@/lib/spa-router";
import type { GitHubUser, Repository } from "@/lib/types";
import { applyFilters, EMPTY_FILTERS, type FilterState } from "@/lib/filter";
import { parseCommandInput, type ViewMode } from "@/lib/commands";
import { daysSince } from "@/lib/format";
import { isValidGitHubUsername } from "@/lib/github";

import UserHeader from "./UserHeader";
import StatsBar from "./StatsBar";
import CommandBar from "./CommandBar";
import QuickFilters from "./QuickFilters";
import FilterChips from "./FilterChips";
import RepoList from "./RepoList";
import EmptyState from "./EmptyState";
import DetailPanel from "./DetailPanel";
import CommandPalette from "./CommandPalette";
import HelpPanel from "./HelpPanel";
import TechMap from "./TechMap";
import Timeline from "./Timeline";
import Footer from "./Footer";

const NO_ARG_COMMANDS = new Set([
  "github",
  "profile",
  "clear",
  "help",
  "archaeology",
  "techmap",
  "forgotten",
  "featured",
  "active",
  "archived",
  "recent",
  "updated",
  "pages",
]);

function buildQueryString(filters: FilterState): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.status) params.set("status", filters.status);
  if (filters.tech) params.set("tech", filters.tech);
  if (filters.language) params.set("language", filters.language);
  if (filters.created) params.set("created", filters.created);
  if (filters.pages) params.set("pages", "available");
  if (filters.sort) params.set("sort", filters.sort);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export default function CommandCenter({
  username,
  user,
  repos,
  initialFilters,
  initialOpenRepoName,
  repoNotFound,
}: {
  username: string;
  user: GitHubUser;
  repos: Repository[];
  initialFilters: FilterState;
  initialOpenRepoName?: string;
  repoNotFound?: boolean;
}) {
  const { navigate } = useRoute();
  const inputRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [inputValue, setInputValue] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("index");
  const [openRepoName, setOpenRepoName] = useState<string | null>(initialOpenRepoName ?? null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [outputMessage, setOutputMessage] = useState<string | null>(null);
  const [notFoundBanner, setNotFoundBanner] = useState(Boolean(repoNotFound));

  const basePath = openRepoName ? `/${username}/repo/${encodeURIComponent(openRepoName)}` : `/${username}`;

  useEffect(() => {
    navigate(`${basePath}${buildQueryString(filters)}`, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, basePath]);

  const patchFilters = useCallback((patch: Partial<FilterState>) => {
    setFilters((f) => ({ ...f, ...patch }));
  }, []);

  const handleOpen = useCallback(
    (repo: Repository) => {
      setOpenRepoName(repo.name);
      setNotFoundBanner(false);
    },
    []
  );

  const handleClose = useCallback(() => {
    setOpenRepoName(null);
  }, []);

  function runCommand(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    setHistory((h) => (h[h.length - 1] === trimmed ? h : [...h, trimmed]));

    const outcome = parseCommandInput(trimmed);

    if (outcome.message) {
      setOutputMessage(outcome.message);
      setInputValue("");
      return;
    }

    if (outcome.switchUser) {
      if (isValidGitHubUsername(outcome.switchUser)) {
        navigate(`/${outcome.switchUser}`);
      } else {
        setOutputMessage("✗ Invalid GitHub username.");
      }
      setInputValue("");
      return;
    }

    if (outcome.openUrl) {
      window.open(user.htmlUrl, "_blank", "noopener,noreferrer");
      setInputValue("");
      return;
    }

    if (outcome.clearFilters) {
      setFilters(EMPTY_FILTERS);
      setViewMode("index");
      setOutputMessage(null);
      setInputValue("");
      return;
    }

    if (outcome.unknown) {
      setOutputMessage(`Unknown command: /${outcome.unknown}. Type /help for a list.`);
      setInputValue("");
      return;
    }

    if (outcome.filters && Object.keys(outcome.filters).length > 0) {
      patchFilters(outcome.filters);
    }
    if (outcome.viewMode) setViewMode(outcome.viewMode);
    setOutputMessage(null);

    // Keep plain-text search visible in the bar; clear command input after execution.
    setInputValue(trimmed.startsWith("/") ? "" : trimmed);
  }

  function handleInputChange(value: string) {
    setInputValue(value);
    if (!value.startsWith("/")) {
      patchFilters({ q: value });
    }
  }

  function handlePaletteSelect(name: string) {
    setPaletteOpen(false);
    if (NO_ARG_COMMANDS.has(name)) {
      runCommand(`/${name}`);
    } else {
      setInputValue(`/${name} `);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((open) => !open);
        return;
      }
      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }
      if (e.key === "?" && !isTyping) {
        e.preventDefault();
        setViewMode("help");
      }
    }

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const filteredRepos = useMemo(() => applyFilters(repos, filters), [repos, filters]);

  const forgottenRepos = useMemo(
    () =>
      applyFilters(repos, { ...filters, status: undefined }).filter(
        (r) => !r.archived && !r.fork && daysSince(r.pushedAt) > 365
      ),
    [repos, filters]
  );

  const featuredRepos = useMemo(() => applyFilters(repos, { ...filters, status: undefined }).filter((r) => r.featured), [repos, filters]);

  const openRepo = openRepoName ? repos.find((r) => r.name === openRepoName) ?? null : null;

  const hasActiveFilters = Boolean(filters.status || filters.tech || filters.language || filters.created || filters.pages);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:py-8">
      <UserHeader user={user} />

      <div className="mt-6">
        <StatsBar repos={repos} publicRepos={user.publicRepos} />
      </div>

      {notFoundBanner && (
        <div className="mt-4 flex items-start justify-between gap-3 rounded-sm border border-[var(--color-error)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-error)]">
          <span>✗ Repository not found for this user.</span>
          <button type="button" onClick={() => setNotFoundBanner(false)} aria-label="Dismiss" className="shrink-0">
            ✕
          </button>
        </div>
      )}

      <div className="mt-4">
        <CommandBar
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onSubmit={runCommand}
          history={history}
          username={username}
        />
      </div>

      <div className="mt-3">
        <QuickFilters filters={filters} onChange={patchFilters} />
      </div>

      <div className="mt-3">
        <FilterChips filters={filters} onRemove={(key) => patchFilters({ [key]: undefined } as Partial<FilterState>)} />
      </div>

      {outputMessage && (
        <div className="mt-4 whitespace-pre-wrap rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm text-[var(--color-text-muted)]">
          {outputMessage}
        </div>
      )}

      <p className="mt-4 text-xs text-[var(--color-text-dim)]">
        {filteredRepos.length} repositor{filteredRepos.length === 1 ? "y" : "ies"} match for {username}
      </p>

      <div className="mt-3 flex-1">
        {viewMode === "help" && <HelpPanel onClose={() => setViewMode("index")} />}

        {viewMode === "techmap" && <TechMap repos={filteredRepos} onClose={() => setViewMode("index")} />}

        {viewMode === "archaeology" && (
          <Timeline repos={filteredRepos} username={username} onClose={() => setViewMode("index")} onOpen={handleOpen} />
        )}

        {viewMode === "forgotten" &&
          (forgottenRepos.length > 0 ? (
            <section>
              <p className="mb-3 text-sm text-[var(--color-text-muted)]">
                These repositories have not been updated recently.
              </p>
              <RepoList repos={forgottenRepos} onOpen={handleOpen} />
            </section>
          ) : (
            <EmptyState prompt={`/forgotten --user ${username}`} heading="Nothing forgotten here — everything has been touched recently." />
          ))}

        {viewMode === "featured" &&
          (featuredRepos.length > 0 ? (
            <section>
              <p className="mb-3 text-sm text-[var(--color-text-muted)]">Selected projects</p>
              <RepoList repos={featuredRepos} onOpen={handleOpen} />
            </section>
          ) : (
            <EmptyState prompt={`/featured --user ${username}`} heading="No locally featured repositories for this user." />
          ))}

        {viewMode === "index" &&
          (repos.length === 0 ? (
            <EmptyState prompt={`repo status --user ${username}`} heading="No public repositories are available to index." />
          ) : filteredRepos.length === 0 ? (
            <EmptyState
              prompt={`${filters.q || "/status " + (filters.status ?? "")} --user ${username}`}
              heading="No repositories found."
              suggestions={hasActiveFilters ? ["/clear"] : ["/tech typescript", "/tech javascript", "/status active"]}
            />
          ) : (
            <RepoList repos={filteredRepos} onOpen={handleOpen} />
          ))}
      </div>

      <Footer username={username} />

      {openRepo && <DetailPanel repo={openRepo} user={user} onClose={handleClose} />}
      {paletteOpen && (
        <CommandPalette username={username} onClose={() => setPaletteOpen(false)} onSelect={handlePaletteSelect} />
      )}
    </div>
  );
}
