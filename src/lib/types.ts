export type RepositoryStatus = "active" | "archived" | "fork" | "experimental" | "learning" | "legacy";

export interface GitHubUser {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  htmlUrl: string;
  blog: string | null;
  location: string | null;
  publicRepos: number;
  followers: number;
  following: number;
}

export interface Repository {
  id: number;
  owner: string;
  name: string;
  description: string | null;

  url: string;
  homepage: string | null;

  createdAt: string;
  updatedAt: string;
  pushedAt: string;

  language: string | null;
  technologies: string[];
  stackConfidence: "known" | "unknown";

  topics: string[];

  status: RepositoryStatus;

  stars: number;
  forks: number;

  archived: boolean;
  fork: boolean;

  hasPages: boolean;

  license: string | null;

  cloneUrl: string;
  sshUrl: string;
  defaultBranch: string;
  visibility: string;
  sizeKb: number;

  why?: string;
  era?: string;
  featured?: boolean;
}

export interface RepositoryLocalMeta {
  status?: RepositoryStatus;
  why?: string;
  tags?: string[];
  featured?: boolean;
}

export type LocalMetadataStore = Record<string, Record<string, RepositoryLocalMeta>>;

export type GitHubApiErrorKind = "invalid-username" | "not-found" | "rate-limited" | "api-error";

export class GitHubApiError extends Error {
  kind: GitHubApiErrorKind;

  constructor(kind: GitHubApiErrorKind, message: string) {
    super(message);
    this.kind = kind;
    this.name = "GitHubApiError";
  }
}
