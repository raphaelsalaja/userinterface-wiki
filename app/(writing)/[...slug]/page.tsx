import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Article } from "@/components/layout";
import { PageTransition } from "@/components/page-transition";
import { ViewTracker } from "@/components/view-tracker";
import { source } from "@/lib/features/content";

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;

  const page = source.getPage(params.slug);

  if (!page) notFound();

  const MDX = page.data.body;
  const slugString = params.slug.join("/");

  return (
    <PageTransition>
      <ViewTracker slug={slugString} />
      <Header page={page} />
      <Article>
        {/* <AudioReader slugSegments={params.slug} />
         */}
        <MDX />
      </Article>
      <Footer page={page} />
    </PageTransition>
  );
}
