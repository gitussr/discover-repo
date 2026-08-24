import Image from "next/image";
import type { GitHubUser } from "@/lib/types";

export default function UserHeader({ user, onExit }: { user: GitHubUser; onExit: () => void }) {
  return (
    <header className="flex items-start gap-3">
      <Image
        src={user.avatarUrl}
        alt={`${user.login}'s GitHub avatar`}
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 rounded-sm border border-[var(--color-border)]"
      />
      <div className="min-w-0">
        <p className="text-[var(--color-text-dim)]">
          <span aria-hidden="true">$ </span>repo status --user {user.login}
        </p>
        <h1 className="mt-1 break-words text-xl font-semibold">
          {user.login}/<span className="text-[var(--color-text-muted)]">repository index</span>
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          A searchable archive of public repositories.
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <a
            href={user.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-accent)] hover:underline"
          >
            GitHub profile ↗
          </a>
          <button type="button" onClick={onExit} className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:underline">
            ✕ exit {user.login}
          </button>
        </div>
      </div>
    </header>
  );
}
