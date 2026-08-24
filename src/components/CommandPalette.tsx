"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { COMMAND_LIST } from "@/lib/commands";

export default function CommandPalette({
  username,
  onClose,
  onSelect,
}: {
  username: string;
  onClose: () => void;
  onSelect: (commandName: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.toLowerCase().replace(/^\//, "");
    if (!q) return COMMAND_LIST;
    return COMMAND_LIST.filter((c) => c.name.includes(q) || c.description.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    inputRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = results[index];
        if (selected) onSelect(selected.name);
      } else if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>('input, [tabindex]:not([tabindex="-1"])');
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, onSelect, results, index]);

  function handleQueryChange(value: string) {
    setQuery(value);
    setIndex(0);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-0 sm:items-start sm:p-6 sm:pt-24" role="presentation" onClick={onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full flex-col overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-raised)] sm:h-auto sm:max-h-[70vh] sm:max-w-lg sm:rounded-sm"
      >
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-3 py-3">
          <span aria-hidden="true" className="text-[var(--color-text-dim)]">
            &gt;
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder={`search repositories for ${username}...`}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Search commands"
            className="focus-ring-none min-w-0 flex-1 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-dim)]"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close command palette"
            className="shrink-0 rounded-sm border border-[var(--color-border)] px-2 py-1 text-xs text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Esc
          </button>
        </div>
        <ul role="listbox" className="flex-1 overflow-y-auto py-1">
          {results.length === 0 && (
            <li className="px-3 py-3 text-sm text-[var(--color-text-muted)]">No matching commands.</li>
          )}
          {results.map((cmd, i) => (
            <li
              key={cmd.name}
              role="option"
              aria-selected={i === index}
              className={`flex flex-col gap-0.5 px-3 py-2.5 text-sm sm:flex-row sm:items-baseline sm:gap-3 ${
                i === index ? "bg-[var(--color-border)]" : ""
              }`}
              onMouseEnter={() => setIndex(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(cmd.name);
              }}
            >
              <span className="text-[var(--color-accent)]">/{cmd.name}</span>
              <span className="text-xs text-[var(--color-text-muted)]">{cmd.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
