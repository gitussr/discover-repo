import type { Repository, RepositoryStatus } from "./types";

export type SortOption = "newest" | "oldest" | "updated" | "alphabetical" | "stars" | "forks";

export interface FilterState {
  q: string;
  status?: RepositoryStatus;
  tech?: string;
  language?: string;
  created?: string;
  pages?: boolean;
  sort?: SortOption;
}

export const EMPTY_FILTERS: FilterState = { q: "" };

function searchableText(repo: Repository): string {
  return [
    repo.name,
    repo.description ?? "",
    repo.language ?? "",
    repo.status,
    ...repo.topics,
    ...repo.technologies,
    new Date(repo.createdAt).getUTCFullYear().toString(),
    new Date(repo.updatedAt).getUTCFullYear().toString(),
  ]
    .join(" ")
    .toLowerCase();
}

function matchesQuery(repo: Repository, q: string): boolean {
  if (!q.trim()) return true;
  const haystack = searchableText(repo);
  const tokens = q.toLowerCase().trim().split(/\s+/);
  return tokens.every((t) => haystack.includes(t));
}

export function applyFilters(repos: Repository[], filters: FilterState): Repository[] {
  let result = repos.filter((repo) => matchesQuery(repo, filters.q));

  if (filters.status) {
    result = result.filter((r) => r.status === filters.status);
  }

  if (filters.tech) {
    const tech = filters.tech.toLowerCase();
    result = result.filter((r) => r.technologies.some((t) => t.toLowerCase() === tech));
  }

  if (filters.language) {
    const lang = filters.language.toLowerCase();
    result = result.filter((r) => (r.language ?? "").toLowerCase() === lang);
  }

  if (filters.created) {
    if (filters.created.startsWith("before:")) {
      const year = parseInt(filters.created.slice(7), 10);
      result = result.filter((r) => new Date(r.createdAt).getUTCFullYear() < year);
    } else if (filters.created.startsWith("after:")) {
      const year = parseInt(filters.created.slice(6), 10);
      result = result.filter((r) => new Date(r.createdAt).getUTCFullYear() > year);
    } else {
      const year = parseInt(filters.created, 10);
      if (!Number.isNaN(year)) {
        result = result.filter((r) => new Date(r.createdAt).getUTCFullYear() === year);
      }
    }
  }

  if (filters.pages) {
    result = result.filter((r) => r.hasPages);
  }

  return sortRepositories(result, filters.sort ?? "updated");
}

export function sortRepositories(repos: Repository[], sort: SortOption): Repository[] {
  const sorted = [...repos];
  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    case "oldest":
      return sorted.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
    case "alphabetical":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "stars":
      return sorted.sort((a, b) => b.stars - a.stars);
    case "forks":
      return sorted.sort((a, b) => b.forks - a.forks);
    case "updated":
    default:
      return sorted.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
  }
}
