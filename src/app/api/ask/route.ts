import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { SITE_MANIFEST } from "@/lib/site";
import { getWikiEntry, searchWiki, wikiEntries } from "@/lib/wiki-index";

export const runtime = "nodejs";
export const maxDuration = 30;

const ARTICLE_LIST = wikiEntries
  .map((entry) => `- "${entry.title}" (/${entry.slug}): ${entry.description}`)
  .join("\n");

const SYSTEM_PROMPT = `You are the Ask AI assistant for ${SITE_MANIFEST.name} (${SITE_MANIFEST.url}), a wiki about UI/UX design and design engineering by Raphael Salaja.

Ground every answer in the wiki articles. Use the searchWiki tool to find relevant passages, and readArticle when you need the full text. If the wiki doesn't cover a topic, say so briefly rather than inventing content.

Available articles:
${ARTICLE_LIST}

Style:
- Be concise and practical. Prefer a few sentences over long essays.
- Cite sources as markdown links to article paths, e.g. [Laws of UX](/laws-of-ux).
- Use markdown formatting sparingly: short paragraphs, occasional lists, inline code for CSS/JS identifiers.`;

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();

  const result = streamText({
    model: "google/gemini-3-flash",
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(4),
    tools: {
      searchWiki: tool({
        description:
          "Search the wiki articles for passages relevant to a query. Returns the best-matching articles with excerpts.",
        inputSchema: z.object({
          query: z.string().describe("Search terms, e.g. 'spring animation'"),
        }),
        execute: async ({ query }) => searchWiki(query, 4),
      }),
      readArticle: tool({
        description: "Read the full markdown of a wiki article by slug.",
        inputSchema: z.object({
          slug: z
            .string()
            .describe("Article slug without leading slash, e.g. 'laws-of-ux'"),
        }),
        execute: async ({ slug }) => {
          const entry = getWikiEntry(slug.replace(/^\//, ""));
          if (!entry) return { error: `No article with slug "${slug}"` };
          return {
            title: entry.title,
            url: `/${entry.slug}`,
            markdown: entry.markdown,
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
