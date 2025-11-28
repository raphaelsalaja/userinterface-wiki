import { source } from "@markdown/lib/source";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import { Article } from "@/components/layout";

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

  const date = {
    published: new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(new Date((page.data.date as { published: string })?.published)),
    modified:
      page.data.date && (page.data.date as { modified?: string }).modified,
  };

  return (
    <React.Fragment>
      <header>
        <h1>{page.data.title}</h1>
        <span>
          <time dateTime={(page.data.date as { published: string })?.published}>
            {date.published}
          </time>
          &nbsp;by {page.data.authors?.join(", ")} · {page.data.views || 0}{" "}
          views · {page.data.tags?.join(", ")}
        </span>
      </header>
      <Article>
        <MDX />
      </Article>
    </React.Fragment>
  );
}
