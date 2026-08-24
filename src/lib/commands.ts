import type { RepositoryStatus } from "./types";
import type { FilterState, SortOption } from "./filter";

export type ViewMode = "index" | "help" | "techmap" | "archaeology" | "forgotten" | "featured";

export interface CommandOutcome {
  filters?: Partial<FilterState>;
  clearFilters?: boolean;
  viewMode?: ViewMode;
  switchUser?: string;
  openUrl?: "github" | "profile";
  message?: string;
  unknown?: string;
}

export const COMMAND_LIST = [
  { name: "status", description: "Filter repository status" },
  { name: "created", description: "Sort/filter by creation date" },
  { name: "updated", description: "Sort/filter by update date" },
  { name: "tech", description: "Filter by technology" },
  { name: "language", description: "Filter by language" },
  { name: "recent", description: "Recently updated repositories" },
  { name: "archived", description: "Archived repositories" },
  { name: "active", description: "Active repositories" },
  { name: "pages", description: "GitHub Pages repositories" },
  { name: "archaeology", description: "Explore old projects" },
  { name: "era", description: "Explore repositories by year" },
  { name: "techmap", description: "Technology evolution" },
  { name: "forgotten", description: "Long-neglected repositories" },
  { name: "featured", description: "Locally featured repositories" },
  { name: "sort", description: "Sort results" },
  { name: "github", description: "Open the active GitHub profile" },
  { name: "profile", description: "Open the active GitHub profile" },
  { name: "user", description: "Switch GitHub user" },
  { name: "clear", description: "Reset filters" },
  { name: "help", description: "Show available commands" },
] as const;

const STATUSES: RepositoryStatus[] = ["active", "archived", "fork", "experimental", "learning", "legacy"];
const SORTS: SortOption[] = ["newest", "oldest", "updated", "alphabetical", "stars", "forks"];

function splitSegments(input: string): string[] {
  return input
    .trim()
    .split(/(?=\/)/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

const EASTER_EGGS: Record<string, string> = {
  "sudo make portfolio": "[sudo] password for developer:\n\nNice try.\n\nThis isn't a portfolio. It's a repository archaeology tool.",
  "sudo rm -rf /": "Permission denied.\n\nNothing was deleted. Nice try though.",
};

export function parseCommandInput(rawInput: string): CommandOutcome {
  const trimmed = rawInput.trim();
  if (!trimmed) return {};

  const eggKey = trimmed.toLowerCase();
  if (EASTER_EGGS[eggKey]) {
    return { message: EASTER_EGGS[eggKey] };
  }

  if (!trimmed.startsWith("/")) {
    return { filters: { q: trimmed } };
  }

  const segments = splitSegments(trimmed);
  const outcome: CommandOutcome = { filters: {} };

  for (const segment of segments) {
    const withoutSlash = segment.slice(1);
    const spaceIdx = withoutSlash.indexOf(" ");
    const name = (spaceIdx === -1 ? withoutSlash : withoutSlash.slice(0, spaceIdx)).toLowerCase();
    const arg = (spaceIdx === -1 ? "" : withoutSlash.slice(spaceIdx + 1)).trim();

    switch (name) {
      case "status": {
        const status = arg.toLowerCase() as RepositoryStatus;
        if (STATUSES.includes(status)) outcome.filters!.status = status;
        outcome.viewMode = "index";
        break;
      }
      case "active":
        outcome.filters!.status = "active";
        outcome.viewMode = "index";
        break;
      case "archived":
        outcome.filters!.status = "archived";
        outcome.viewMode = "index";
        break;
      case "tech":
        if (arg) outcome.filters!.tech = arg;
        outcome.viewMode = "index";
        break;
      case "language":
        if (arg) outcome.filters!.language = arg;
        outcome.viewMode = "index";
        break;
      case "created":
        if (arg) outcome.filters!.created = arg;
        outcome.viewMode = "index";
        break;
      case "updated":
        outcome.filters!.sort = "updated";
        outcome.viewMode = "index";
        break;
      case "recent":
        outcome.filters!.sort = "updated";
        outcome.viewMode = "index";
        break;
      case "pages":
        outcome.filters!.pages = true;
        outcome.viewMode = "index";
        break;
      case "sort": {
        const sort = arg.toLowerCase() as SortOption;
        if (SORTS.includes(sort)) outcome.filters!.sort = sort;
        break;
      }
      case "era":
        outcome.viewMode = "archaeology";
        if (arg) outcome.filters!.created = arg;
        break;
      case "archaeology":
        outcome.viewMode = "archaeology";
        break;
      case "techmap":
        outcome.viewMode = "techmap";
        break;
      case "forgotten":
        outcome.viewMode = "forgotten";
        break;
      case "featured":
        outcome.viewMode = "featured";
        break;
      case "github":
        outcome.openUrl = "github";
        break;
      case "profile":
        outcome.openUrl = "profile";
        break;
      case "user":
        if (arg) outcome.switchUser = arg.trim();
        break;
      case "clear":
        outcome.clearFilters = true;
        outcome.viewMode = "index";
        break;
      case "help":
        outcome.viewMode = "help";
        break;
      default:
        outcome.unknown = name;
    }
  }

  return outcome;
}
