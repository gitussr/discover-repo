import type { RepositoryStatus } from "@/lib/types";

const STATUS_COLOR: Record<RepositoryStatus, string> = {
  active: "text-[var(--color-success)]",
  archived: "text-[var(--color-text-dim)]",
  fork: "text-[var(--color-text-muted)]",
  experimental: "text-[var(--color-accent)]",
  learning: "text-[var(--color-accent)]",
  legacy: "text-[var(--color-warning)]",
};

export default function StatusBadge({ status }: { status: RepositoryStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${STATUS_COLOR[status]}`}>
      <span aria-hidden="true">●</span>
      <span className="uppercase tracking-wide">{status}</span>
    </span>
  );
}
