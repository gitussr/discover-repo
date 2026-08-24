import type { LocalMetadataStore } from "@/lib/types";

/**
 * Optional storytelling layer GitHub cannot provide on its own.
 * Namespaced by GitHub username so one user's context never applies to
 * another user's repository of the same name. Leave a user's entry out
 * entirely (or a repo's entry out of a user's map) when nothing reliable
 * is known — the UI falls back to neutral, non-fabricated copy.
 *
 * Example:
 * {
 *   gitussr: {
 *     "sandesh-lib": {
 *       status: "legacy",
 *       why: "Built while learning the Fetch API.",
 *       tags: ["learning", "legacy"],
 *       featured: false,
 *     },
 *   },
 * }
 */
const repositoryMeta: LocalMetadataStore = {};

export default repositoryMeta;
