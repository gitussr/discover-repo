export default function EmptyState({
  prompt,
  heading,
  suggestions,
}: {
  prompt: string;
  heading: string;
  suggestions?: string[];
}) {
  return (
    <div className="panel text-sm">
      <p className="text-[var(--color-text-dim)]">
        <span aria-hidden="true">$ </span>
        {prompt}
      </p>
      <p className="mt-3 text-[var(--color-text-muted)]">{heading}</p>
      {suggestions && suggestions.length > 0 && (
        <div className="mt-3 space-y-1 text-[var(--color-accent)]">
          <p className="text-[var(--color-text-dim)]">Try:</p>
          {suggestions.map((s) => (
            <p key={s} className="break-words">
              {s}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
