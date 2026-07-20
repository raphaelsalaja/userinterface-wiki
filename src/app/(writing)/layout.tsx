import { Header, type HeaderPage } from "@/components/chrome/header";
import { Sidebar, type SidebarGroup } from "@/components/chrome/sidebar";
import {
  getSections,
  getWalkthroughSections,
  type Section,
} from "@/lib/sections";
import styles from "./styles.module.css";

const REFERENCE_LINKS = [
  { title: "Glossary", url: "/glossary" },
  { title: "Vault", url: "/vault" },
  { title: "Sponsors", url: "/sponsors" },
];

function toSidebarGroups(sections: Section[]): SidebarGroup[] {
  return sections.map((section) => ({
    id: section.id,
    label: section.label,
    tracked: true,
    items: section.pages.map((page) => ({
      title: page.title,
      url: page.url,
    })),
  }));
}

function toHeaderPages(sections: Section[]): HeaderPage[] {
  return sections.flatMap((section) =>
    section.pages.map((page) => ({
      title: page.title,
      url: page.url,
      section: section.label,
      markdown: true,
    })),
  );
}

export default function WritingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sections = getSections();
  const walkthroughSections = getWalkthroughSections();

  const groups: SidebarGroup[] = [
    ...toSidebarGroups(sections),
    ...toSidebarGroups(walkthroughSections),
    {
      id: "reference",
      label: "Reference",
      items: REFERENCE_LINKS.map((link) => ({
        title: link.title,
        url: link.url,
      })),
    },
  ].filter((group) => group.items.length > 0);

  const headerPages: HeaderPage[] = [
    ...toHeaderPages(sections),
    ...toHeaderPages(walkthroughSections),
    ...REFERENCE_LINKS.map((link) => ({
      title: link.title,
      url: link.url,
      section: "Reference",
    })),
  ];

  return (
    <div className={styles.shell}>
      <Sidebar groups={groups} />
      <div className={styles.main}>
        <Header pages={headerPages} />
        <div className={styles.container}>{children}</div>
      </div>
    </div>
  );
}
