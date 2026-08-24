"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { isValidGitHubUsername } from "@/lib/github";

export default function UsernameForm() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Enter a GitHub username to inspect.");
      return;
    }
    if (!isValidGitHubUsername(trimmed)) {
      setError("Invalid GitHub username.");
      return;
    }
    router.push(`/${trimmed}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <label htmlFor="username-input" className="mb-1.5 block text-[var(--color-text-muted)]">
        Enter a GitHub username to inspect.
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="username-input"
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          placeholder="GitHub username"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "username-error" : undefined}
          className="min-w-0 flex-1 rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)] outline-none focus-visible:border-[var(--color-accent)]"
        />
        <button
          type="submit"
          className="shrink-0 rounded-sm border border-[var(--color-accent)] px-3 py-2 text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)]"
        >
          Open repository index
        </button>
      </div>
      {error && (
        <p id="username-error" role="alert" className="mt-2 text-[var(--color-error)]">
          ✗ {error}
        </p>
      )}
    </form>
  );
}
