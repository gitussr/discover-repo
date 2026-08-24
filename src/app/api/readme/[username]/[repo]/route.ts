import { NextResponse } from "next/server";
import { getReadmeText, isValidGitHubUsername } from "@/lib/github";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string; repo: string }> }
) {
  const { username, repo } = await params;

  if (!isValidGitHubUsername(username)) {
    return NextResponse.json({ error: "invalid-username" }, { status: 400 });
  }

  const text = await getReadmeText(username, repo);
  if (text === null) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }

  return NextResponse.json({ text });
}
