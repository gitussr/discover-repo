"use client";

import { useEffect, useState } from "react";

// Real progress isn't observable mid-fetch (the GitHub API gives us a
// response or it doesn't — no byte-level progress events), so this eases
// toward a cap and stops there rather than claiming false precision; it
// only reaches 100 in the render this component's last frame, i.e. never —
// AppShell swaps it out for the real content the instant data arrives.
const CAP = 96;

export default function LoadingShell({ username }: { username?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!username) return;
    const interval = setInterval(() => {
      setProgress((p) => (p >= CAP ? p : p + (CAP - p) * 0.12 + 0.3));
    }, 100);
    return () => clearInterval(interval);
  }, [username]);

  const pct = Math.min(99, Math.round(progress));

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
          <div className="mt-3 text-[var(--color-text-muted)]">
            <p className={pct >= 45 ? "text-[var(--color-success)]" : ""}>
              {pct >= 45 ? "✓ " : ""}fetching profile...
            </p>
            <p className={pct >= 90 ? "text-[var(--color-success)]" : "mt-0.5"}>
              {pct >= 90 ? "✓ " : ""}fetching repositories...
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Loading repository index for ${username}`}
                className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-border)]"
              >
                <div
                  className="h-full rounded-full transition-[width] duration-150 ease-out"
                  style={{ width: `${progress}%`, backgroundImage: "var(--gradient-brand)" }}
                />
              </div>
              <span className="w-9 shrink-0 text-right text-xs tabular-nums text-[var(--color-text-dim)]">
                {pct}%
              </span>
            </div>
            <p className="mt-1.5 text-xs text-[var(--color-text-dim)]">{pct}% loading... please wait</p>
          </div>
        )}
      </div>
    </div>
  );
}
