import type { Repository } from "@/lib/types";

export default function TechMap({ repos, onClose }: { repos: Repository[]; onClose: () => void }) {
  const counts = new Map<string, number>();
  for (const repo of repos) {
    if (repo.language) counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }

  const entries = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  const max = entries[0]?.[1] ?? 1;

  return (
    <section className="panel">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--color-text-muted)]">
          <span aria-hidden="true">$ </span>/techmap
        </h2>
        <button type="button" onClick={onClose} className="btn-ghost">
          close
        </button>
      </div>

      {entries.length === 0 ? (
        <p className="mt-3 text-sm text-[var(--color-text-muted)]">No language data available.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {entries.map(([language, count]) => (
            <li key={language} className="text-sm">
              <div className="flex items-baseline justify-between">
                <span>{language}</span>
                <span className="text-xs text-[var(--color-text-dim)]">{count}</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[var(--color-border)]" role="img" aria-label={`${language}: ${count} repositories`}>
                <div
                  className="h-full rounded-full transition-[width] duration-500 ease-out"
                  style={{ width: `${Math.max(4, (count / max) * 100)}%`, backgroundImage: "var(--gradient-brand)" }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
