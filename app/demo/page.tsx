import { getAllDemos } from "@/lib/demos";
import { DemoList } from "./client";

export const metadata = {
  title: "Demos",
  description: "All interactive demos",
};

export default function DemosPage() {
  const demos = getAllDemos();
  return <DemoList demos={demos} />;
}
