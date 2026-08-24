import type { FilterState } from "@/lib/filter";

export default function FilterChips({
  filters,
  onRemove,
}: {
  filters: FilterState;
  onRemove: (key: keyof FilterState) => void;
}) {
  const chips: { key: keyof FilterState; label: string }[] = [];

  if (filters.status) chips.push({ key: "status", label: `status: ${filters.status}` });
  if (filters.tech) chips.push({ key: "tech", label: `tech: ${filters.tech}` });
  if (filters.language) chips.push({ key: "language", label: `language: ${filters.language}` });
  if (filters.created) chips.push({ key: "created", label: `created: ${filters.created}` });
  if (filters.pages) chips.push({ key: "pages", label: "pages: available" });

  if (chips.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Active filters">
      {chips.map((chip) => (
        <li key={chip.key}>
          <button
            type="button"
            onClick={() => onRemove(chip.key)}
            className="flex items-center gap-1.5 rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-xs text-[var(--color-text-muted)] hover:border-[var(--color-error)] hover:text-[var(--color-error)]"
          >
            {chip.label}
            <span aria-hidden="true">✕</span>
            <span className="sr-only">Remove filter</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
