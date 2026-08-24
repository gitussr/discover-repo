export default function Footer({ username }: { username: string }) {
  return (
    <footer className="mt-12 border-t border-[var(--color-border)] px-4 py-6 text-xs text-[var(--color-text-dim)]">
      <p className="text-[var(--color-text-muted)]">Why this exists</p>
      <p className="mt-1">GitHub tells you what repositories exist. This interface tells you what they mean.</p>
      <p className="mt-3">
        {username}/repository index — built for archaeology, discovery &amp; remembering.
      </p>
    </footer>
  );
}
