"use client";

import { forwardRef, useMemo, useState } from "react";
import { COMMAND_LIST } from "@/lib/commands";

interface CommandBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  history: string[];
  username: string;
}

const CommandBar = forwardRef<HTMLInputElement, CommandBarProps>(function CommandBar(
  { value, onChange, onSubmit, history, username },
  ref
) {
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [suggestIndex, setSuggestIndex] = useState(0);

  const suggestions = useMemo(() => {
    if (!value.startsWith("/")) return [];
    const token = value.slice(1).split(" ")[0].toLowerCase();
    if (value.includes(" ")) return [];
    return COMMAND_LIST.filter((c) => c.name.startsWith(token));
  }, [value]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      if (suggestions.length > 0) {
        e.preventDefault();
        setSuggestIndex((i) => (i + 1) % suggestions.length);
        return;
      }
      if (history.length > 0) {
        e.preventDefault();
        const nextIndex = historyIndex === null ? history.length - 1 : Math.min(historyIndex + 1, history.length - 1);
        setHistoryIndex(nextIndex);
        onChange(history[nextIndex]);
      }
      return;
    }
    if (e.key === "ArrowUp") {
      if (suggestions.length > 0) {
        e.preventDefault();
        setSuggestIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (history.length > 0) {
        e.preventDefault();
        const nextIndex = historyIndex === null ? history.length - 1 : Math.max(historyIndex - 1, 0);
        setHistoryIndex(nextIndex);
        onChange(history[nextIndex]);
      }
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0 && value.startsWith("/") && !value.includes(" ")) {
        onChange(`/${suggestions[suggestIndex].name} `);
        return;
      }
      onSubmit(value);
      setHistoryIndex(null);
      return;
    }
    if (e.key === "Escape") {
      (e.target as HTMLInputElement).blur();
      return;
    }
    if (e.key === "Tab" && suggestions.length > 0) {
      e.preventDefault();
      onChange(`/${suggestions[suggestIndex].name} `);
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 focus-within:border-[var(--color-accent)] focus-within:shadow-[0_0_0_2px_var(--color-accent)]">
        <span aria-hidden="true" className="text-[var(--color-text-dim)]">
          $
        </span>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setHistoryIndex(null);
            setSuggestIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder={`Search repositories for ${username}... or type /`}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          role="combobox"
          aria-expanded={suggestions.length > 0}
          aria-controls="command-suggestions"
          aria-autocomplete="list"
          aria-label={`Search or command repositories for ${username}`}
          className="focus-ring-none min-w-0 flex-1 bg-transparent text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-dim)]"
        />
        <kbd className="hidden shrink-0 rounded-sm border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] text-[var(--color-text-dim)] sm:inline-block">
          Ctrl K
        </kbd>
      </div>

      {suggestions.length > 0 && (
        <ul
          id="command-suggestions"
          role="listbox"
          className="absolute inset-x-0 top-full z-40 mt-1 max-h-64 overflow-y-auto rounded-sm border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-lg"
        >
          {suggestions.map((cmd, i) => (
            <li
              key={cmd.name}
              role="option"
              aria-selected={i === suggestIndex}
              className={`flex flex-col gap-0.5 px-3 py-2 text-sm sm:flex-row sm:items-baseline sm:gap-3 ${
                i === suggestIndex ? "bg-[var(--color-border)]" : ""
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(`/${cmd.name} `);
              }}
            >
              <span className="text-[var(--color-accent)]">/{cmd.name}</span>
              <span className="text-xs text-[var(--color-text-muted)]">{cmd.description}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default CommandBar;
