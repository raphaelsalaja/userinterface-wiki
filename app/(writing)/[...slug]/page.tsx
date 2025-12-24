import { ScrollArea } from "@base-ui/react/scroll-area";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

import { PageTransition } from "@/components/page-transition";
import { Playback } from "@/components/playback";
import { formatPageData, source } from "@/lib/features/content";
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

  const slugPath = params.slug.join("/");
  const ogImageUrl = `/api/og?slug=${encodeURIComponent(slugPath)}`;

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
  const { author } = formatPageData(page.data);

  return (
    <PageTransition>
      <div className={styles.container}>
        <div className={styles.spacer} />
        <ScrollArea.Root className={styles.scroll}>
          <ScrollArea.Viewport className={styles.viewport}>
            <ScrollArea.Content
              className={styles.article}
              render={<article />}
              style={{
                minWidth: "100%",
              }}
            >
              <Header page={page} />
              <MDX components={getMDXComponents()} />
            </ScrollArea.Content>
          </ScrollArea.Viewport>{" "}
          <ScrollArea.Scrollbar
            className={styles.scrollbar}
            orientation="vertical"
          >
            <ScrollArea.Thumb className={styles.thumb} />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
        <Playback
          slugSegments={params.slug}
          title={page.data.title}
          authorName={author.name}
        />
      </div>
    </PageTransition>
  );
}
