"use client";

import { useEffect, useRef } from "react";
import type { GitHubUser, Repository } from "@/lib/types";
import { formatDate, repositoryAge } from "@/lib/format";
import StatusBadge from "./StatusBadge";
import TechTags from "./TechTags";
import CloneCommand from "./CloneCommand";
import ReadmePeek from "./ReadmePeek";

export default function DetailPanel({
  repo,
  user,
  onClose,
}: {
  repo: Repository;
  user: GitHubUser;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60" role="presentation" onClick={onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-panel-title"
        onClick={(e) => e.stopPropagation()}
        className="h-full w-full overflow-y-auto border-l border-[var(--color-border)] bg-[var(--color-bg)] p-4 sm:max-w-md sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id="detail-panel-title" className="min-w-0 break-words text-lg font-semibold">
            {repo.name}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close repository details"
            className="shrink-0 rounded-sm border border-[var(--color-border)] px-2 py-1 text-sm text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            ✕
          </button>
        </div>

        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          {repo.description || "No description available."}
        </p>

        <dl className="mt-5 space-y-2.5 text-sm">
          <Row label="owner">
            <a
              href={user.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              {repo.owner}
            </a>
          </Row>
          <Row label="created">
            {formatDate(repo.createdAt)} <span className="text-[var(--color-text-dim)]">({repositoryAge(repo.createdAt)})</span>
          </Row>
          <Row label="updated">{formatDate(repo.updatedAt)}</Row>
          <Row label="language">{repo.language ?? "—"}</Row>
          {repo.technologies.length > 0 && (
            <Row label="stack">
              <TechTags tags={repo.technologies} />
            </Row>
          )}
          {repo.topics.length > 0 && <Row label="topics">{repo.topics.join(", ")}</Row>}
          <Row label="status">
            <StatusBadge status={repo.status} />
          </Row>
          <Row label="license">{repo.license ?? "—"}</Row>
          <Row label="stars">{repo.stars}</Row>
          <Row label="forks">{repo.forks}</Row>
          <Row label="github">
            <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">
              available ↗
            </a>
          </Row>
          {repo.homepage && (
            <Row label="demo">
              <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">
                available ↗
              </a>
            </Row>
          )}
          <Row label="pages">{repo.hasPages ? "available" : "—"}</Row>
          <Row label="why">{repo.why ?? "not documented"}</Row>
        </dl>

        <div className="mt-5">
          <ReadmePeek owner={repo.owner} repo={repo.name} repoUrl={repo.url} />
        </div>

        <div className="mt-5">
          <CloneCommand cloneUrl={repo.cloneUrl} sshUrl={repo.sshUrl} />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm border border-[var(--color-border)] px-3 py-1.5 text-xs hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Open GitHub ↗
          </a>
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm border border-[var(--color-border)] px-3 py-1.5 text-xs hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              Open Demo ↗
            </a>
          )}
          <a
            href={user.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm border border-[var(--color-border)] px-3 py-1.5 text-xs hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            View User Profile ↗
          </a>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
      <dt className="w-20 shrink-0 text-[var(--color-text-dim)]">{label}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  );
}
