import type { RawGitHubRepo } from "./github";
import repositoryMeta from "@/data/repository-meta";
import { detectTechnologies } from "./tech-detection";
import type { Repository, RepositoryStatus } from "./types";

function deriveDefaultStatus(raw: RawGitHubRepo): RepositoryStatus {
  if (raw.archived) return "archived";
  if (raw.fork) return "fork";
  return "active";
}

export function normalizeRepository(raw: RawGitHubRepo, owner: string): Repository {
  const { technologies, confidence } = detectTechnologies(raw.topics ?? []);
  const meta = repositoryMeta[owner.toLowerCase()]?.[raw.name];

  return {
    id: raw.id,
    owner,
    name: raw.name,
    description: raw.description,

    url: raw.html_url,
    homepage: raw.homepage,

    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    pushedAt: raw.pushed_at,

    language: raw.language,
    technologies,
    stackConfidence: confidence,

    topics: raw.topics ?? [],

    status: meta?.status ?? deriveDefaultStatus(raw),

    stars: raw.stargazers_count,
    forks: raw.forks_count,

    archived: raw.archived,
    fork: raw.fork,

    hasPages: raw.has_pages,

    license: raw.license?.name ?? null,

    cloneUrl: raw.clone_url,
    sshUrl: raw.ssh_url,
    defaultBranch: raw.default_branch,
    visibility: raw.visibility,
    sizeKb: raw.size,

    why: meta?.why,
    era: String(new Date(raw.created_at).getUTCFullYear()),
    featured: meta?.featured,
  };
}

export function normalizeRepositories(raws: RawGitHubRepo[], owner: string): Repository[] {
  return raws.map((raw) => normalizeRepository(raw, owner));
}
