import { HomeLayout } from "@/components/home";
import { formatPages, source } from "@/lib/source";

export default function Page() {
  const pages = formatPages(source.getPages());

  return <HomeLayout pages={pages} />;
}
