import type { Repository } from "@/lib/types";
import { formatShortDate } from "@/lib/format";
import StatusBadge from "./StatusBadge";

export default function RepoCard({
  repo,
  onOpen,
}: {
  repo: Repository;
  onOpen: (repo: Repository) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(repo)}
      className="w-full rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-left transition-colors hover:border-[var(--color-border-strong)] focus-visible:border-[var(--color-accent)] sm:p-4"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="min-w-0 truncate text-base font-semibold text-[var(--color-text)]">
          {repo.name}
        </span>
        {repo.language && (
          <span className="shrink-0 text-xs text-[var(--color-text-muted)]">{repo.language}</span>
        )}
      </div>

      <p className="mt-1.5 line-clamp-2 text-sm text-[var(--color-text-muted)]">
        {repo.description || "No description available."}
      </p>

      <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1 text-xs text-[var(--color-text-dim)] sm:grid-cols-2">
        <div className="flex gap-1.5">
          <dt>created</dt>
          <dd className="text-[var(--color-text-muted)]">{formatShortDate(repo.createdAt)}</dd>
        </div>
        <div className="flex gap-1.5">
          <dt>updated</dt>
          <dd className="text-[var(--color-text-muted)]">{formatShortDate(repo.updatedAt)}</dd>
        </div>
        <div className="flex gap-1.5">
          <dt>status</dt>
          <dd>
            <StatusBadge status={repo.status} />
          </dd>
        </div>
        <div className="flex gap-1.5">
          <dt>pages</dt>
          <dd className="text-[var(--color-text-muted)]">{repo.hasPages ? "available" : "—"}</dd>
        </div>
      </dl>
    </button>
  );
}
