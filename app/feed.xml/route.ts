import { source } from "@/lib/source";

const SITE_URL = "https://userinterface.wiki";
const SITE_NAME = "userinterface.wiki";
const SITE_DESCRIPTION =
  "A living manual for better interfaces. Learn design principles, motion, typography, and more.";

export async function GET() {
  const pages = source.getPages();

  const items = pages
    .sort((a, b) => {
      const dateA = new Date(a.data.date.published);
      const dateB = new Date(b.data.date.published);
      return dateB.getTime() - dateA.getTime();
    })
    .map(
      (page) => `
    <item>
      <title><![CDATA[${page.data.title}]]></title>
      <link>${SITE_URL}${page.url}</link>
      <guid isPermaLink="true">${SITE_URL}${page.url}</guid>
      <description><![CDATA[${page.data.description}]]></description>
      <pubDate>${new Date(page.data.date.published).toUTCString()}</pubDate>
      <author>${page.data.author}</author>
    </item>`,
    )
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(feed.trim(), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
