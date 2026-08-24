"use client";

import { useEffect, useState } from "react";
import { getReadmeText } from "@/lib/github";

const MAX_LINES = 15;
const MAX_CHARS = 900;

function truncate(text: string): { snippet: string; wasTruncated: boolean } {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const limitedLines = lines.slice(0, MAX_LINES);
  let snippet = limitedLines.join("\n");
  let wasTruncated = lines.length > MAX_LINES;

  if (snippet.length > MAX_CHARS) {
    snippet = snippet.slice(0, MAX_CHARS);
    wasTruncated = true;
  }

  return { snippet: snippet.trimEnd(), wasTruncated };
}

type State = { status: "loading" } | { status: "empty" } | { status: "error" } | { status: "ready"; snippet: string; wasTruncated: boolean };

export default function ReadmePeek({ owner, repo, repoUrl }: { owner: string; repo: string; repoUrl: string }) {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    getReadmeText(owner, repo)
      .then((text) => {
        if (cancelled) return;
        if (text === null) {
          setState({ status: "empty" });
          return;
        }
        setState({ status: "ready", ...truncate(text) });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, [owner, repo]);

  return (
    <div>
      <p className="text-[var(--color-text-dim)]">
        <span aria-hidden="true">$ </span>cat README.md
      </p>

      {state.status === "loading" && (
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">fetching README...</p>
      )}

      {state.status === "empty" && (
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">No README found.</p>
      )}

      {state.status === "error" && (
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">README unavailable right now.</p>
      )}

      {state.status === "ready" && (
        <>
          <pre className="mt-2 max-h-64 overflow-y-auto whitespace-pre-wrap break-words rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5 text-xs text-[var(--color-text-muted)]">
            {state.snippet}
            {state.wasTruncated ? "\n…" : ""}
          </pre>
          <a
            href={`${repoUrl}#readme`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 inline-block text-xs text-[var(--color-accent)] hover:underline"
          >
            View full README on GitHub ↗
          </a>
        </>
      )}
    </div>
  );
}
