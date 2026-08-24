import CopyButton from "./CopyButton";

function CloneRow({ label, url }: { label: string; url: string }) {
  const command = `git clone ${url}`;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-wide text-[var(--color-text-dim)]">{label}</span>
      <div className="flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pl-3 pr-2">
        <div className="min-w-0 flex-1 overflow-x-auto">
          <code className="whitespace-nowrap text-xs text-[var(--color-text)]" aria-label={command}>
            <span className="text-[var(--color-text-dim)]">$ </span>
            {command}
          </code>
        </div>
        <CopyButton value={command} label={`${label} clone command`} className="shrink-0" />
      </div>
    </div>
  );
}

export default function CloneCommand({ cloneUrl, sshUrl }: { cloneUrl: string; sshUrl: string }) {
  return (
    <div className="flex flex-col gap-3">
      <CloneRow label="HTTPS" url={cloneUrl} />
      <CloneRow label="SSH" url={sshUrl} />
    </div>
  );
}
