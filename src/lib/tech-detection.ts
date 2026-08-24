/**
 * Technology detection must never guess from a repo's name or vibes (see
 * master prompt §56). It only reports a technology when there's real
 * evidence in GitHub metadata: the repo's `topics` matched against a
 * curated dictionary of real technology identifiers. GitHub's primary
 * `language` field is surfaced separately and is never folded into this
 * inference — it's already ground truth on its own.
 */
const KNOWN_TECHNOLOGIES: Record<string, string> = {
  nodejs: "Node.js",
  node: "Node.js",
  express: "Express",
  expressjs: "Express",
  react: "React",
  reactjs: "React",
  nextjs: "Next.js",
  "next-js": "Next.js",
  vue: "Vue.js",
  vuejs: "Vue.js",
  nuxt: "Nuxt",
  svelte: "Svelte",
  sveltekit: "SvelteKit",
  angular: "Angular",
  php: "PHP",
  wordpress: "WordPress",
  woocommerce: "WooCommerce",
  laravel: "Laravel",
  symfony: "Symfony",
  python: "Python",
  django: "Django",
  flask: "Flask",
  fastapi: "FastAPI",
  mysql: "MySQL",
  postgresql: "PostgreSQL",
  postgres: "PostgreSQL",
  mongodb: "MongoDB",
  redis: "Redis",
  sqlite: "SQLite",
  html: "HTML",
  html5: "HTML",
  css: "CSS",
  css3: "CSS",
  javascript: "JavaScript",
  typescript: "TypeScript",
  tailwind: "Tailwind",
  tailwindcss: "Tailwind",
  bootstrap: "Bootstrap",
  docker: "Docker",
  kubernetes: "Kubernetes",
  graphql: "GraphQL",
  rest: "REST API",
  api: "API",
  golang: "Go",
  go: "Go",
  rust: "Rust",
  java: "Java",
  spring: "Spring",
  kotlin: "Kotlin",
  swift: "Swift",
  csharp: "C#",
  dotnet: ".NET",
  ruby: "Ruby",
  rails: "Ruby on Rails",
};

export function detectTechnologies(topics: string[]): { technologies: string[]; confidence: "known" | "unknown" } {
  const matched = new Set<string>();

  for (const topic of topics) {
    const key = topic.toLowerCase().trim();
    const known = KNOWN_TECHNOLOGIES[key];
    if (known) matched.add(known);
  }

  const technologies = Array.from(matched);
  return { technologies, confidence: technologies.length > 0 ? "known" : "unknown" };
}
