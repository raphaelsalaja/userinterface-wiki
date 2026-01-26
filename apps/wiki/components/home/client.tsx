"use client";

import dynamic from "next/dynamic";
import type { FormattedPage } from "@/lib/source";

const HomeLayout = dynamic(
  () => import("./index").then((mod) => mod.HomeLayout),
  { ssr: false },
);

export function HomeLayoutClient({ pages }: { pages: FormattedPage[] }) {
  return <HomeLayout pages={pages} />;
}
