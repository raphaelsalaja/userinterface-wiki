import type { Metadata } from "next";
import { DemosPage } from "@/components/demo/list";
import { getAllDemos } from "@/lib/demos";
import { METADATA, SITE_MANIFEST } from "@/lib/site";

const title = `Demos — ${SITE_MANIFEST.name}`;
const description =
  "Interactive examples exploring animation principles, motion design, and UI patterns.";

export const metadata: Metadata = {
  ...METADATA,
  title,
  description,
  openGraph: {
    ...METADATA.openGraph,
    title,
    description,
    url: `${SITE_MANIFEST.url}/demo`,
  },
  twitter: {
    ...METADATA.twitter,
    title,
    description,
  },
};

export default function Page() {
  const demos = getAllDemos();
  return <DemosPage demos={demos} />;
}
