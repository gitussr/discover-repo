export default function TechTags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Detected technologies">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-sm border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-1.5 py-0.5 text-xs text-[var(--color-text-muted)]"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}
