"use client";

import { useState } from "react";

export default function CopyButton({
  value,
  label,
  className = "",
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable — fail silently, the command text is still selectable.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? `Copied ${label}` : `Copy ${label}`}
      className={`btn-ghost shrink-0 ${copied ? "border-[var(--color-success)] text-[var(--color-success)]" : ""} ${className}`}
    >
      {copied ? "✓ copied" : "copy"}
    </button>
  );
}
