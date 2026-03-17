import { HomeLayoutClient } from "@/components/home/client";
import { formatPages, source } from "@/lib/source";

const HIDDEN_SLUGS = new Set(["skill"]);

export default function Page() {
  const pages = formatPages(
    source.getPages().filter((p) => !HIDDEN_SLUGS.has(p.slugs.join("/"))),
  );

  return <HomeLayoutClient pages={pages} />;
}
