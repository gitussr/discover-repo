import { COMMAND_LIST } from "@/lib/commands";

export default function HelpPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--color-text-muted)]">AVAILABLE COMMANDS</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-sm border border-[var(--color-border)] px-2 py-1 text-xs text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          /clear
        </button>
      </div>
      <dl className="mt-3 space-y-2 text-sm">
        {COMMAND_LIST.map((cmd) => (
          <div key={cmd.name} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
            <dt className="text-[var(--color-accent)]">/{cmd.name}</dt>
            <dd className="text-[var(--color-text-muted)]">{cmd.description}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
