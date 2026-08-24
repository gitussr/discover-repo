import type { RepositoryStatus } from "./types";
import type { FilterState, SortOption } from "./filter";

const STATUSES: RepositoryStatus[] = ["active", "archived", "fork", "experimental", "learning", "legacy"];
const SORTS: SortOption[] = ["newest", "oldest", "updated", "alphabetical", "stars", "forks"];

export function parseFiltersFromSearch(search: string): FilterState {
  const params = new URLSearchParams(search);
  const status = params.get("status");
  const sort = params.get("sort");

  return {
    q: params.get("q") ?? "",
    status: status && STATUSES.includes(status as RepositoryStatus) ? (status as RepositoryStatus) : undefined,
    tech: params.get("tech") ?? undefined,
    language: params.get("language") ?? undefined,
    created: params.get("created") ?? undefined,
    pages: params.get("pages") === "available",
    sort: sort && SORTS.includes(sort as SortOption) ? (sort as SortOption) : undefined,
  };
}
