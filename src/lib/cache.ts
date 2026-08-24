import type { UserDataResult } from "./data";

/**
 * Session-lived, in-memory cache keyed by username. There is no server here
 * (see spa-router.tsx) to hold a shared/edge cache, so this simply avoids
 * re-hitting GitHub's unauthenticated (60 req/hr) rate limit when a visitor
 * revisits or switches back to a username within the same page session.
 */
const TTL_MS = 5 * 60 * 1000;

interface Entry {
  result: UserDataResult;
  expiresAt: number;
}

const store = new Map<string, Entry>();

export function getCachedUserData(username: string): UserDataResult | null {
  const key = username.toLowerCase();
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.result;
}

export function setCachedUserData(username: string, result: UserDataResult): void {
  store.set(username.toLowerCase(), { result, expiresAt: Date.now() + TTL_MS });
}
