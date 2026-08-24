import type { Repository } from "@/lib/types";

export default function StatsBar({ repos, publicRepos }: { repos: Repository[]; publicRepos: number }) {
  const languages = new Set(repos.map((r) => r.language).filter(Boolean));
  const technologies = new Set(repos.flatMap((r) => r.technologies));
  const active = repos.filter((r) => r.status === "active").length;
  const archived = repos.filter((r) => r.status === "archived").length;

  const stats = [
    { label: repos.length === publicRepos ? "repos" : "repos indexed", value: repos.length },
    { label: "languages", value: languages.size },
    { label: "technologies", value: technologies.size },
    { label: "active", value: active },
    { label: "archived", value: archived },
  ];

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-[var(--color-text-muted)]" role="list" aria-label="Repository statistics">
      {stats.map((s) => (
        <span key={s.label} role="listitem">
          <span className="text-[var(--color-text)]">{s.value}</span> {s.label}
        </span>
      ))}
    </div>
  );
}
