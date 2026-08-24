"use client";

import type { GitHubApiErrorKind } from "@/lib/types";
import { useRoute } from "@/lib/spa-router";

const COPY: Record<GitHubApiErrorKind, { line: string; body: string }> = {
  "invalid-username": {
    line: "✗ Invalid GitHub username.",
    body: "Usernames may only contain letters, numbers and single hyphens.",
  },
  "not-found": {
    line: "✗ GitHub user not found.",
    body: "Check the username and try again.",
  },
  "rate-limited": {
    line: "✗ GitHub API rate limit reached.",
    body: "Try again later or view cached data.",
  },
  "api-error": {
    line: "✗ GitHub API unavailable.",
    body: "The repository index could not be refreshed.",
  },
};

export default function ErrorState({
  username,
  kind,
  onRetry,
}: {
  username: string;
  kind: GitHubApiErrorKind;
  onRetry?: () => void;
}) {
  const { navigate } = useRoute();
  const copy = COPY[kind];

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-16 text-sm">
      <p className="text-[var(--color-text-dim)]">
        <span aria-hidden="true">$ </span>repo status --user {username}
      </p>
      <p className="mt-4 text-[var(--color-error)]">{copy.line}</p>
      <p className="mt-1 text-[var(--color-text-muted)]">{copy.body}</p>
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => (onRetry ? onRetry() : window.location.reload())}
          className="rounded-sm border border-[var(--color-border)] px-3 py-1.5 text-xs hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          Retry
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="rounded-sm border border-[var(--color-border)] px-3 py-1.5 text-xs hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          Try another username
        </button>
      </div>
    </div>
  );
}
