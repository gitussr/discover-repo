const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  const diffMs = now.getTime() - then;
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth} month${diffMonth === 1 ? "" : "s"} ago`;
  const diffYear = Math.floor(diffMonth / 12);
  return `${diffYear} year${diffYear === 1 ? "" : "s"} ago`;
}

export function repositoryAge(createdIso: string, now: Date = new Date()): string {
  const created = new Date(createdIso);
  let years = now.getUTCFullYear() - created.getUTCFullYear();
  const beforeAnniversary =
    now.getUTCMonth() < created.getUTCMonth() ||
    (now.getUTCMonth() === created.getUTCMonth() && now.getUTCDate() < created.getUTCDate());
  if (beforeAnniversary) years -= 1;

  if (years < 1) {
    const months = Math.max(
      1,
      (now.getUTCFullYear() - created.getUTCFullYear()) * 12 + (now.getUTCMonth() - created.getUTCMonth())
    );
    return `${months} month${months === 1 ? "" : "s"}`;
  }
  return `${years} year${years === 1 ? "" : "s"}`;
}

export function daysSince(iso: string, now: Date = new Date()): number {
  return Math.floor((now.getTime() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
}
