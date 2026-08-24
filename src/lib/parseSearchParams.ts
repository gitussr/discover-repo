import type { RepositoryStatus } from "./types";
import type { FilterState, SortOption } from "./filter";

const STATUSES: RepositoryStatus[] = ["active", "archived", "fork", "experimental", "learning", "legacy"];
const SORTS: SortOption[] = ["newest", "oldest", "updated", "alphabetical", "stars", "forks"];

export function parseFiltersFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): FilterState {
  const get = (key: string): string | undefined => {
    const v = searchParams[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const status = get("status");
  const sort = get("sort");

  return {
    q: get("q") ?? "",
    status: status && STATUSES.includes(status as RepositoryStatus) ? (status as RepositoryStatus) : undefined,
    tech: get("tech"),
    language: get("language"),
    created: get("created"),
    pages: get("pages") === "available",
    sort: sort && SORTS.includes(sort as SortOption) ? (sort as SortOption) : undefined,
  };
}
