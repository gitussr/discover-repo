import { GitHubApiError, type GitHubUser } from "./types";

const GITHUB_API = "https://api.github.com";
const USERNAME_PATTERN = /^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$/;

export function isValidGitHubUsername(username: string): boolean {
  return USERNAME_PATTERN.test(username);
}

// This runs entirely client-side (see src/lib/spa-router.tsx for why), so
// requests are always unauthenticated — GitHub's anonymous rate limit
// (60 req/hr per IP) applies. There is no server to hold a token safely.
const HEADERS: HeadersInit = { Accept: "application/vnd.github+json" };

async function githubFetch(path: string): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(`${GITHUB_API}${path}`, { headers: HEADERS });
  } catch {
    throw new GitHubApiError("api-error", "GitHub API unavailable.");
  }

  if (res.status === 404) {
    throw new GitHubApiError("not-found", "GitHub user not found.");
  }

  if (res.status === 403 || res.status === 429) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    if (remaining === "0") {
      throw new GitHubApiError("rate-limited", "GitHub API rate limit reached.");
    }
    throw new GitHubApiError("api-error", "GitHub API unavailable.");
  }

  if (!res.ok) {
    throw new GitHubApiError("api-error", "GitHub API unavailable.");
  }

  return res;
}

interface RawGitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  html_url: string;
  blog: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

export interface RawGitHubRepo {
  id: number;
  owner: { login: string };
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  archived: boolean;
  fork: boolean;
  has_pages: boolean;
  license: { name: string } | null;
  clone_url: string;
  ssh_url: string;
  default_branch: string;
  visibility: string;
  size: number;
}

export async function getGitHubUser(username: string): Promise<GitHubUser> {
  if (!isValidGitHubUsername(username)) {
    throw new GitHubApiError("invalid-username", "Invalid GitHub username.");
  }

  const res = await githubFetch(`/users/${encodeURIComponent(username)}`);
  const raw: RawGitHubUser = await res.json();

  return {
    login: raw.login,
    name: raw.name,
    avatarUrl: raw.avatar_url,
    bio: raw.bio,
    htmlUrl: raw.html_url,
    blog: raw.blog,
    location: raw.location,
    publicRepos: raw.public_repos,
    followers: raw.followers,
    following: raw.following,
  };
}

const MAX_PAGES = 5; // 5 * 100 = up to 500 public repos indexed per user.

export async function getReadmeText(owner: string, repo: string): Promise<string | null> {
  let res: Response;
  try {
    res = await fetch(
      `${GITHUB_API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`,
      { headers: { Accept: "application/vnd.github.raw+json" } }
    );
  } catch {
    return null;
  }

  if (!res.ok) return null;
  return res.text();
}

export async function getGitHubRepositories(username: string): Promise<RawGitHubRepo[]> {
  if (!isValidGitHubUsername(username)) {
    throw new GitHubApiError("invalid-username", "Invalid GitHub username.");
  }

  const repos: RawGitHubRepo[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await githubFetch(
      `/users/${encodeURIComponent(username)}/repos?per_page=100&page=${page}&type=owner&sort=updated`
    );
    const batch: RawGitHubRepo[] = await res.json();
    repos.push(...batch);
    if (batch.length < 100) break;
  }

  return repos;
}
