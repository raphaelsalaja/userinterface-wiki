import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AudioReader } from "@/components/audio-reader";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Article } from "@/components/layout";
import { PageTransition } from "@/components/page-transition";
import { formatPageData, source } from "@/lib/features/content";
import { getMDXComponents } from "@/mdx-components";

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
      <Header page={page} />
      <Article>
        <AudioReader
          slugSegments={params.slug}
          title={page.data.title}
          authorName={author.name}
        />
        <MDX components={getMDXComponents()} />
      </Article>
      <Footer
        slug={params.slug}
        title={page.data.title}
        description={page.data.description}
      />
    </PageTransition>
  );
}
