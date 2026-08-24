import type { Metadata } from "next";
import { loadUserData } from "@/lib/data";
import { parseFiltersFromSearchParams } from "@/lib/parseSearchParams";
import CommandCenter from "@/components/CommandCenter";
import ErrorState from "@/components/ErrorState";

interface PageProps {
  params: Promise<{ username: string; repo: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username, repo } = await params;
  const result = await loadUserData(username);

  if (!result.ok) {
    return { title: username };
  }

  const displayName = result.user.name ?? result.user.login;
  return {
    title: `${repo} — ${displayName}`,
    description: `${repo}, a repository by ${result.user.login} on GitHub.`,
  };
}

export default async function RepoDetailPage({ params, searchParams }: PageProps) {
  const { username, repo } = await params;
  const search = await searchParams;
  const result = await loadUserData(username);

  if (!result.ok) {
    return <ErrorState username={username} kind={result.kind} />;
  }

  const initialFilters = parseFiltersFromSearchParams(search);
  const repoExists = result.repos.some((r) => r.name === repo);

  return (
    <CommandCenter
      username={result.user.login}
      user={result.user}
      repos={result.repos}
      initialFilters={initialFilters}
      initialOpenRepoName={repoExists ? repo : undefined}
      repoNotFound={!repoExists}
    />
  );
}
