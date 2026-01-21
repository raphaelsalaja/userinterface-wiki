import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArticleContent,
  ArticleHeader,
  ArticleRoot,
} from "@/components/article";
import { NarrationPlayer, NarrationProvider } from "@/components/narration";
import { PageTransition } from "@/components/page-transition";
import { toSerializablePageData } from "@/lib/page-data";
import { formatPageData, getPageImage, source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import styles from "./styles.module.css";

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

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      title: page.data.title,
      description: page.data.description,
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

  return (
    <PageTransition>
      <div className={styles.container}>
        <div className={styles.spacer} />
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
            <NarrationPlayer />
          </NarrationProvider>
        </ArticleRoot>
      </div>
    </PageTransition>
  );
}
