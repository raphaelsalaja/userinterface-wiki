import {
  Sidebar,
  type SidebarSection,
  type SidebarTab,
} from "@/components/chrome/sidebar";
import {
  getSections,
  getWalkthroughSections,
  type Section,
} from "@/lib/sections";
import styles from "./styles.module.css";

function toSidebarSections(sections: Section[]): SidebarSection[] {
  return sections.map((section) => ({
    id: section.id,
    label: section.label,
    items: section.pages.map((page) => ({
      title: page.title,
      url: page.url,
    })),
  }));
}

export default function WritingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tabs: SidebarTab[] = [
    {
      id: "learn",
      label: "Learn",
      sections: toSidebarSections(getSections()),
    },
    {
      id: "walkthroughs",
      label: "Walkthroughs",
      sections: toSidebarSections(getWalkthroughSections()),
    },
  ].filter((tab) => tab.sections.length > 0);

  return (
    <div className={styles.shell}>
      <Sidebar
        tabs={tabs}
        links={[
          { title: "Glossary", url: "/glossary" },
          { title: "Vault", url: "/vault" },
          { title: "Sponsors", url: "/sponsors" },
        ]}
      />
      <div className={styles.main}>{children}</div>
    </div>
  );
}
