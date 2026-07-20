import type { Metadata } from "next";

import { METADATA, SITE_MANIFEST } from "@/lib/site";

import { Stage } from "./stage";

const title = `Live — ${SITE_MANIFEST.name}`;
const description = "Recording stage for live demos.";

export const metadata: Metadata = {
  ...METADATA,
  title,
  description,
  robots: { index: false, follow: false },
  openGraph: {
    ...METADATA.openGraph,
    title,
    description,
    url: `${SITE_MANIFEST.url}/live`,
  },
};

export default function Page() {
  return <Stage />;
}
