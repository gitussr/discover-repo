import { getGitHubRepositories, getGitHubUser } from "./github";
import { normalizeRepositories } from "./normalize";
import { GitHubApiError, type GitHubApiErrorKind, type GitHubUser, type Repository } from "./types";

export type UserDataResult =
  | { ok: true; user: GitHubUser; repos: Repository[] }
  | { ok: false; kind: GitHubApiErrorKind; message: string };

export async function loadUserData(username: string): Promise<UserDataResult> {
  try {
    const user = await getGitHubUser(username);
    const rawRepos = await getGitHubRepositories(username);
    const repos = normalizeRepositories(rawRepos, user.login);
    return { ok: true, user, repos };
  } catch (err) {
    if (err instanceof GitHubApiError) {
      return { ok: false, kind: err.kind, message: err.message };
    }
    return { ok: false, kind: "api-error", message: "GitHub API unavailable." };
  }
}
