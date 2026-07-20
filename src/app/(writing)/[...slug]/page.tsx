import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { PageTransition } from "@/components/chrome/page-transition";
import { Toc, type TocItem } from "@/components/chrome/toc";
import { Completion } from "@/components/features/completion";
import {
  NarrationPlayer,
  NarrationProvider,
} from "@/components/features/narration";
import { Newsletter } from "@/components/features/newsletter";
import {
  ArticleContent,
  ArticleHeader,
  ArticleRoot,
} from "@/components/mdx/article";
import { Pager } from "@/components/mdx/pager";
import { toSerializablePageData } from "@/lib/page-data";
import { getAdjacentPages } from "@/lib/sections";
import { SITE_MANIFEST } from "@/lib/site";
import { formatPageData, getPageImage, source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import styles from "./styles.module.css";

function nodeToText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(nodeToText).join("");
  }
  if (node && typeof node === "object" && "props" in node) {
    return nodeToText(
      (node.props as { children?: ReactNode } | undefined)?.children,
    );
  }
  return "";
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  const ogImageUrl = getPageImage(page).url;
  const pageUrl = `${SITE_MANIFEST.url}/${params.slug.join("/")}`;

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      type: "article",
      title: page.data.title,
      description: page.data.description,
      url: pageUrl,
      siteName: SITE_MANIFEST.name,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: page.data.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.data.title,
      description: page.data.description,
      images: [ogImageUrl],
    },
  };
}

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;

  const page = source.getPage(params.slug);

  if (!page) notFound();

  const MDX = page.data.body;

  const { author, coauthors } = formatPageData(page.data);

  const pageData = toSerializablePageData(page);

  const toc: TocItem[] = (page.data.toc ?? [])
    .filter((item) => item.depth <= 3 && item.url !== "#footnote-label")
    .map((item) => ({
      title: nodeToText(item.title),
      url: item.url,
      depth: item.depth,
    }));

  const { prev, next } = getAdjacentPages(params.slug.join("/"));

  return (
    <PageTransition>
      <div className={styles.container}>
        <div className={styles.spacer} />
        <div className={styles.columns}>
          <ArticleRoot
            data={pageData}
            author={author}
            coauthors={coauthors}
            className={styles.article}
          >
            <NarrationProvider
              slug={pageData.slugs.join("/")}
              title={pageData.data.title}
              authorName={author.name}
            >
              <ArticleHeader />
              <ArticleContent>
                <MDX components={getMDXComponents()} />
              </ArticleContent>
              <Completion slug={params.slug.join("/")} />
              <Newsletter />
              <Pager prev={prev} next={next} />
              <NarrationPlayer />
            </NarrationProvider>
          </ArticleRoot>
          <Toc items={toc} />
        </div>
      </div>
    </PageTransition>
  );
}
