import type { Repository } from "@/lib/types";
import RepoCard from "./RepoCard";

export default function RepoList({
  repos,
  onOpen,
}: {
  repos: Repository[];
  onOpen: (repo: Repository) => void;
}) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-live="polite">
      {repos.map((repo) => (
        <li key={repo.id}>
          <RepoCard repo={repo} onOpen={onOpen} />
        </li>
      ))}
    </ul>
  );
}
