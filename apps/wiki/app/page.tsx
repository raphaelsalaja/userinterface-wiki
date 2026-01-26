import { HomeLayoutClient } from "@/components/home/client";
import { formatPages, source } from "@/lib/source";

export default function Page() {
  const pages = formatPages(source.getPages());

  return <HomeLayoutClient pages={pages} />;
}
