import CopyButton from "./CopyButton";

export default function CloneCommand({ cloneUrl, sshUrl }: { cloneUrl: string; sshUrl: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-2 overflow-x-auto rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
        <code className="min-w-0 flex-1 whitespace-nowrap text-xs text-[var(--color-text)]" aria-label={`git clone ${cloneUrl}`}>
          <span className="text-[var(--color-text-dim)]">$ </span>git clone {cloneUrl}
        </code>
        <CopyButton value={`git clone ${cloneUrl}`} label="HTTPS clone command" />
      </div>
      <div className="flex items-start gap-2 overflow-x-auto rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
        <code className="min-w-0 flex-1 whitespace-nowrap text-xs text-[var(--color-text)]" aria-label={`git clone ${sshUrl}`}>
          <span className="text-[var(--color-text-dim)]">$ </span>git clone {sshUrl}
        </code>
        <CopyButton value={`git clone ${sshUrl}`} label="SSH clone command" />
      </div>
    </div>
  );
}
