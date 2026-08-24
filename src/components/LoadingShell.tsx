export default function LoadingShell({ username }: { username?: string }) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 items-center px-4 py-16">
      <div className="w-full text-sm">
        <p className="text-[var(--color-text-dim)]">
          <span aria-hidden="true">$ </span>
          {username ? `repo init --user ${username}` : "repo init"}
          <span aria-hidden="true" className="blink-cursor">
            ▍
          </span>
        </p>
        {username && (
          <div className="mt-3 space-y-1 text-[var(--color-text-muted)]">
            <p>fetching profile...</p>
            <p>fetching repositories...</p>
            <div
              role="progressbar"
              aria-label={`Loading repository index for ${username}`}
              className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-border)]"
            >
              <div
                className="h-full w-1/3 animate-[indeterminate_1.2s_ease-in-out_infinite] rounded-full"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
