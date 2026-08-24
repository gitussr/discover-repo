"use client";

import { useEffect, useState } from "react";
import { useRoute } from "@/lib/spa-router";
import { loadUserData, type UserDataResult } from "@/lib/data";
import { getCachedUserData, setCachedUserData } from "@/lib/cache";
import { parseFiltersFromSearch } from "@/lib/parseSearchParams";
import Home from "./Home";
import LoadingShell from "./LoadingShell";
import CommandCenter from "./CommandCenter";
import ErrorState from "./ErrorState";

interface FetchedResult {
  username: string;
  result: UserDataResult;
}

export default function AppShell() {
  const { pathname, search, ready } = useRoute();

  const segments = pathname.split("/").filter(Boolean);
  const username = segments[0];
  const repoName = segments[1] === "repo" ? segments[2] : undefined;

  const [retryCount, setRetryCount] = useState(0);
  const [fetched, setFetched] = useState<FetchedResult | null>(null);

  // Derived, not stored: a cache hit is available synchronously during
  // render, so there's nothing to synchronize via an effect for that case.
  const cached = username && retryCount === 0 ? getCachedUserData(username) : null;

  useEffect(() => {
    if (!username || cached) return;

    let cancelled = false;
    loadUserData(username).then((r) => {
      if (cancelled) return;
      if (r.ok) setCachedUserData(username, r);
      setFetched({ username, result: r });
    });

    return () => {
      cancelled = true;
    };
  }, [username, cached, retryCount]);

  const result = cached ?? (fetched && fetched.username === username ? fetched.result : null);

  useEffect(() => {
    if (result?.ok) {
      document.title = `${result.user.name ?? result.user.login} — Repository Index`;
    } else if (username) {
      document.title = `${username} — Repository Index`;
    } else {
      document.title = "Git USSR — Repository Index";
    }
  }, [result, username]);

  if (!ready) return <LoadingShell />;
  if (!username) return <Home />;
  if (!result) return <LoadingShell username={username} />;
  if (!result.ok) {
    return (
      <ErrorState
        username={username}
        kind={result.kind}
        onRetry={() => {
          setFetched(null);
          setRetryCount((c) => c + 1);
        }}
      />
    );
  }

  const initialFilters = parseFiltersFromSearch(search);
  const repoExists = repoName ? result.repos.some((r) => r.name === repoName) : true;

  return (
    <CommandCenter
      key={result.user.login}
      username={result.user.login}
      user={result.user}
      repos={result.repos}
      initialFilters={initialFilters}
      initialOpenRepoName={repoName && repoExists ? repoName : undefined}
      repoNotFound={Boolean(repoName) && !repoExists}
    />
  );
}
