import { HomeLayout } from "@/components/features/home";
import { getSections } from "@/lib/sections";

export default function Page() {
  return <HomeLayout sections={getSections()} />;
}
