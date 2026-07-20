import { SITE_MANIFEST } from "@/lib/site";
import { getWikiEntry, wikiEntries } from "@/lib/wiki-index";

/**
 * Plain-markdown rendering of an article. Exposed publicly as /{slug}.md
 * via a rewrite in next.config.mjs.
 */

export function generateStaticParams() {
  return wikiEntries.map((entry) => ({ slug: entry.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const entry = getWikiEntry(slug);

  if (!entry) {
    return new Response("Not found", { status: 404 });
  }

  const markdown = [
    `# ${entry.title}`,
    "",
    `> ${entry.description}`,
    "",
    `Source: ${SITE_MANIFEST.url}/${entry.slug}`,
    "",
    entry.markdown,
    "",
  ].join("\n");

  return new Response(markdown, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
