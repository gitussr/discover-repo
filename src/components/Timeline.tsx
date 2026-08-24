import type { Repository } from "@/lib/types";
import { formatDate } from "@/lib/format";

export default function Timeline({
  repos,
  username,
  onClose,
  onOpen,
}: {
  repos: Repository[];
  username: string;
  onClose: () => void;
  onOpen: (repo: Repository) => void;
}) {
  const byYear = new Map<string, Repository[]>();
  for (const repo of repos) {
    const year = repo.era ?? String(new Date(repo.createdAt).getUTCFullYear());
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year)!.push(repo);
  }
  const years = Array.from(byYear.keys()).sort((a, b) => Number(b) - Number(a));

  return (
    <section className="rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--color-text-muted)]">
          DEVELOPMENT HISTORY / {username}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-sm border border-[var(--color-border)] px-2 py-1 text-xs text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          close
        </button>
      </div>

      {years.length === 0 ? (
        <p className="mt-3 text-sm text-[var(--color-text-muted)]">No repositories to chart.</p>
      ) : (
        <ol className="mt-4 space-y-5 border-l border-[var(--color-border)] pl-4">
          {years.map((year) => (
            <li key={year}>
              <p className="-ml-[calc(1rem+1px)] mb-2 border-l-2 border-[var(--color-accent)] pl-[calc(1rem-1px)] text-sm font-semibold text-[var(--color-accent)]">
                {year}
              </p>
              <ul className="space-y-1.5">
                {byYear.get(year)!.map((repo) => (
                  <li key={repo.id}>
                    <button
                      type="button"
                      onClick={() => onOpen(repo)}
                      className="text-left text-sm text-[var(--color-text)] hover:text-[var(--color-accent)] hover:underline"
                    >
                      {repo.name}
                    </button>
                    <span className="ml-2 text-xs text-[var(--color-text-dim)]">
                      {repo.description ? repo.description.slice(0, 60) : formatDate(repo.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
