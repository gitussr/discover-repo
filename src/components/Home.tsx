"use client";

import { useRoute } from "@/lib/spa-router";
import UsernameForm from "@/components/UsernameForm";

export default function Home() {
  const { navigate } = useRoute();

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <main className="w-full max-w-sm">
        <p className="text-[var(--color-text-dim)]">
          <span aria-hidden="true">$ </span>repo init
        </p>
        <h1 className="mt-4 text-lg font-semibold">GitHub repository index</h1>
        <p className="mt-2 text-[var(--color-text-muted)]">
          A searchable, terminal-inspired command center for any public GitHub user&apos;s
          repositories.
        </p>
        <div className="mt-6">
          <UsernameForm />
        </div>
        <p className="mt-8 text-xs text-[var(--color-text-dim)]">
          Try:{" "}
          <button
            type="button"
            onClick={() => navigate("/gitussr")}
            className="text-[var(--color-accent)] hover:underline"
          >
            /gitussr
          </button>{" "}
          ·{" "}
          <button
            type="button"
            onClick={() => navigate("/octocat")}
            className="text-[var(--color-accent)] hover:underline"
          >
            /octocat
          </button>
        </p>
      </main>
    </div>
  );
}
