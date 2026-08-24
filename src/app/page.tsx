import Link from "next/link";
import UsernameForm from "@/components/UsernameForm";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <main className="w-full max-w-sm">
        <p className="text-[var(--color-text-dim)]">
          <span aria-hidden="true">$ </span>repo init
        </p>
        <h1 className="mt-4 text-lg font-semibold">GitHub repository index</h1>
        <p className="mt-2 text-[var(--color-text-muted)]">
          A searchable, terminal-inspired command center for any public GitHub user&apos;s
          repositories.
        </p>
        <div className="mt-6">
          <UsernameForm />
        </div>
        <p className="mt-8 text-xs text-[var(--color-text-dim)]">
          Try:{" "}
          <Link href="/gitussr" className="text-[var(--color-accent)] hover:underline">
            /gitussr
          </Link>{" "}
          ·{" "}
          <Link href="/octocat" className="text-[var(--color-accent)] hover:underline">
            /octocat
          </Link>
        </p>
      </main>
    </div>
  );
}
