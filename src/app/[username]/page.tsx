import type { Metadata } from "next";
import { loadUserData } from "@/lib/data";
import { parseFiltersFromSearchParams } from "@/lib/parseSearchParams";
import CommandCenter from "@/components/CommandCenter";
import ErrorState from "@/components/ErrorState";

interface PageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const result = await loadUserData(username);

  if (!result.ok) {
    return { title: username };
  }

  const displayName = result.user.name ?? result.user.login;
  return {
    title: displayName,
    description: `A searchable command center for ${result.user.login}'s GitHub repositories.`,
    openGraph: {
      title: `${displayName} — Repository Index`,
      description: `A searchable command center for ${result.user.login}'s GitHub repositories.`,
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: `${displayName} — Repository Index`,
      description: `A searchable command center for ${result.user.login}'s GitHub repositories.`,
    },
  };
}

export default async function UserPage({ params, searchParams }: PageProps) {
  const { username } = await params;
  const search = await searchParams;
  const result = await loadUserData(username);

  if (!result.ok) {
    return <ErrorState username={username} kind={result.kind} />;
  }

  const initialFilters = parseFiltersFromSearchParams(search);

  return (
    <CommandCenter
      username={result.user.login}
      user={result.user}
      repos={result.repos}
      initialFilters={initialFilters}
    />
  );
}
