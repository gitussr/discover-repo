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

const PILL_BASE = "rounded-full border px-2.5 py-1 transition-colors";
const PILL_ON = "border-[var(--color-accent)] bg-[color-mix(in_srgb,var(--color-accent)_14%,transparent)] text-[var(--color-accent)]";
const PILL_OFF = "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]";

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
          className={`${PILL_BASE} ${!filters.status ? PILL_ON : PILL_OFF}`}
        >
          all
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange({ status: filters.status === s ? undefined : s })}
            aria-pressed={filters.status === s}
            className={`${PILL_BASE} ${filters.status === s ? PILL_ON : PILL_OFF}`}
          >
            {s}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange({ pages: !filters.pages })}
          aria-pressed={Boolean(filters.pages)}
          className={`${PILL_BASE} ${filters.pages ? PILL_ON : PILL_OFF}`}
        >
          pages only
        </button>
      </div>

      <label className="ml-auto flex items-center gap-1.5 text-[var(--color-text-muted)]">
        sort
        <select
          value={filters.sort ?? "updated"}
          onChange={(e) => onChange({ sort: e.target.value as SortOption })}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-1.5 py-1 text-[var(--color-text)] outline-none transition-colors focus-visible:border-[var(--color-accent)]"
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
