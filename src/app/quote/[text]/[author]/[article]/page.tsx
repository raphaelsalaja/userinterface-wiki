import type { Metadata } from "next";
import { SITE_MANIFEST } from "@/lib/site";
import { QuoteRedirect } from "./redirect";

interface QuotePageProps {
  params: Promise<{
    text: string;
    author: string;
    article: string;
  }>;
  searchParams: Promise<{
    slug?: string;
  }>;
}

export async function generateMetadata({
  params,
}: QuotePageProps): Promise<Metadata> {
  const { text, author, article } = await params;

  const decodedText = Buffer.from(text, "base64url").toString("utf-8");
  const decodedAuthor = decodeURIComponent(author);
  const decodedArticle = Buffer.from(article, "base64url").toString("utf-8");

  return {
    title: decodedArticle,
    description: `"${decodedText.slice(0, 100)}${decodedText.length > 100 ? "…" : ""}" — ${decodedAuthor}`,
    openGraph: {
      title: decodedArticle,
      description: `"${decodedText.slice(0, 100)}${decodedText.length > 100 ? "…" : ""}" — ${decodedAuthor}`,
      type: "article",
      siteName: SITE_MANIFEST.name,
    },
    twitter: {
      card: "summary_large_image",
      title: decodedArticle,
      description: `"${decodedText.slice(0, 100)}${decodedText.length > 100 ? "…" : ""}" — ${decodedAuthor}`,
    },
  };
}

export default async function QuotePage({
  params,
  searchParams,
}: QuotePageProps) {
  const { text, article } = await params;
  const { slug } = await searchParams;

  const decodedText = Buffer.from(text, "base64url").toString("utf-8");
  const decodedArticle = Buffer.from(article, "base64url").toString("utf-8");
  const redirectUrl = slug ? `/${slug}` : "/";

  return (
    <QuoteRedirect
      redirectUrl={redirectUrl}
      quoteText={decodedText}
      articleTitle={decodedArticle}
    />
  );
}
