import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DemoPage } from "@/components/demo/page";
import {
  formatDemoTitle,
  generateDemoParams,
  getAdjacentDemos,
  getDemo,
} from "@/lib/demos";
import { SITE_MANIFEST } from "@/lib/site";

export async function generateStaticParams() {
  return generateDemoParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { slug } = params;

  const demo = getDemo(slug);
  if (!demo) return {};

  const title = `${formatDemoTitle(slug)} - Demo`;
  const description = `Interactive demo from ${formatDemoTitle(demo.article)}`;

  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title,
      description,
      siteName: SITE_MANIFEST.name,
    },
  };
}

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { slug } = params;

  const demo = getDemo(slug);
  if (!demo) notFound();

  const adjacent = getAdjacentDemos(slug);

  return <DemoPage demo={demo} adjacent={adjacent} />;
}
