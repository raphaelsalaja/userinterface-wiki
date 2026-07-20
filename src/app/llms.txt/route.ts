import { getSections } from "@/lib/sections";
import { SITE_MANIFEST } from "@/lib/site";
import { getWikiEntry } from "@/lib/wiki-index";

export const dynamic = "force-static";

/**
 * llms.txt - agent-readable site map following https://llmstxt.org.
 * Each article links to its plain-markdown rendering at /{slug}.md.
 */
export async function GET() {
  const lines: string[] = [
    `# ${SITE_MANIFEST.name}`,
    "",
    `> ${SITE_MANIFEST.description}`,
    "",
  ];

  for (const section of getSections()) {
    lines.push(`## ${section.label}`, "");
    for (const page of section.pages) {
      const slug = page.url.replace(/^\//, "");
      const entry = getWikiEntry(slug);
      const description = entry?.description || page.description;
      lines.push(
        `- [${page.title}](${SITE_MANIFEST.url}/${slug}.md): ${description}`,
      );
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
