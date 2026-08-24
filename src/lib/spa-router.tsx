"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";

/**
 * GitHub Pages serves static files with no server, so real per-username
 * routes (/:username, /:username/repo/:repo) can't be pre-rendered — there
 * are infinitely many possible usernames. Instead the whole app ships as one
 * static shell (index.html) and this router reads/writes the visible URL
 * client-side via the History API. A 404.html redirect (see
 * src/app/not-found.tsx) restores the pretty path before this ever mounts,
 * so a hard reload or direct link to /octocat still lands on the right
 * screen.
 *
 * window.location is external mutable state, so it's read through
 * useSyncExternalStore rather than useState+useEffect — that avoids both a
 * hydration-mismatch (getServerSnapshot returns a neutral "not ready" value
 * for the very first server-matching render) and the extra flash a
 * useEffect-based sync would cause.
 */

// Inlined at build time by Next for NEXT_PUBLIC_ vars; set only by the GitHub
// Pages build step, since the site is served under /discover-repo/.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const NAVIGATE_EVENT = "spa-router:navigate";

interface RouteState {
  pathname: string;
  search: string;
}

function readLocation(): RouteState {
  let pathname = window.location.pathname;
  if (BASE_PATH && pathname.startsWith(BASE_PATH)) {
    pathname = pathname.slice(BASE_PATH.length) || "/";
  }
  return { pathname, search: window.location.search };
}

let cachedKey = "";
let cachedSnapshot: RouteState = { pathname: "/", search: "" };

function getSnapshot(): RouteState {
  const key = window.location.pathname + window.location.search;
  if (key !== cachedKey) {
    cachedKey = key;
    cachedSnapshot = readLocation();
  }
  return cachedSnapshot;
}

function getServerSnapshot(): null {
  return null;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("popstate", callback);
  window.addEventListener(NAVIGATE_EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(NAVIGATE_EVENT, callback);
  };
}

interface RouteContextValue extends RouteState {
  ready: boolean;
  navigate: (to: string, opts?: { replace?: boolean }) => void;
}

const RouteContext = createContext<RouteContextValue | null>(null);

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const navigate = useCallback((to: string, opts?: { replace?: boolean }) => {
    const [pathname, search = ""] = to.split("?");
    const full = `${BASE_PATH}${pathname}${search ? `?${search}` : ""}`;
    if (opts?.replace) {
      window.history.replaceState(null, "", full);
    } else {
      window.history.pushState(null, "", full);
      window.scrollTo(0, 0);
    }
    window.dispatchEvent(new Event(NAVIGATE_EVENT));
  }, []);

  const value: RouteContextValue = {
    pathname: state?.pathname ?? "/",
    search: state?.search ?? "",
    ready: state !== null,
    navigate,
  };

  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>;
}

export function useRoute(): RouteContextValue {
  const ctx = useContext(RouteContext);
  if (!ctx) throw new Error("useRoute must be used within a RouteProvider");
  return ctx;
}
