import { Sidebar, type SidebarSection } from "@/components/chrome/sidebar";
import { getSections } from "@/lib/sections";
import styles from "./styles.module.css";

export default function WritingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sections: SidebarSection[] = getSections().map((section) => ({
    id: section.id,
    label: section.label,
    items: section.pages.map((page) => ({
      title: page.title,
      url: page.url,
    })),
  }));

  return (
    <div className={styles.shell}>
      <Sidebar sections={sections} />
      <div className={styles.main}>{children}</div>
    </div>
  );
}
