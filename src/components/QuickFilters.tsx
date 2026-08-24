import type { RepositoryStatus } from "@/lib/types";
import type { FilterState, SortOption } from "@/lib/filter";

const STATUS_OPTIONS: RepositoryStatus[] = ["active", "archived", "fork"];
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "updated", label: "recently updated" },
  { value: "newest", label: "newest" },
  { value: "oldest", label: "oldest" },
  { value: "alphabetical", label: "alphabetical" },
  { value: "stars", label: "stars" },
  { value: "forks", label: "forks" },
];

export default function QuickFilters({
  filters,
  onChange,
}: {
  filters: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by status">
        <button
          type="button"
          onClick={() => onChange({ status: undefined })}
          aria-pressed={!filters.status}
          className={`rounded-sm border px-2 py-1 ${
            !filters.status
              ? "border-[var(--color-accent)] text-[var(--color-accent)]"
              : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)]"
          }`}
        >
          all
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange({ status: filters.status === s ? undefined : s })}
            aria-pressed={filters.status === s}
            className={`rounded-sm border px-2 py-1 ${
              filters.status === s
                ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)]"
            }`}
          >
            {s}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange({ pages: !filters.pages })}
          aria-pressed={Boolean(filters.pages)}
          className={`rounded-sm border px-2 py-1 ${
            filters.pages
              ? "border-[var(--color-accent)] text-[var(--color-accent)]"
              : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)]"
          }`}
        >
          pages only
        </button>
      </div>

      <label className="ml-auto flex items-center gap-1.5 text-[var(--color-text-muted)]">
        sort
        <select
          value={filters.sort ?? "updated"}
          onChange={(e) => onChange({ sort: e.target.value as SortOption })}
          className="rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] px-1.5 py-1 text-[var(--color-text)] outline-none focus-visible:border-[var(--color-accent)]"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
