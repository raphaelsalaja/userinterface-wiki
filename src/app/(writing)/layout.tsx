import { Header, type HeaderPage } from "@/components/chrome/header";
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

const REFERENCE_LINKS = [
  { title: "Glossary", url: "/glossary" },
  { title: "Vault", url: "/vault" },
  { title: "Sponsors", url: "/sponsors" },
];

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

  const tabs: SidebarTab[] = [
    {
      id: "learn",
      label: "Learn",
      sections: toSidebarSections(sections),
    },
    {
      id: "walkthroughs",
      label: "Walkthroughs",
      sections: toSidebarSections(walkthroughSections),
    },
  ].filter((tab) => tab.sections.length > 0);

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
      <Sidebar tabs={tabs} links={REFERENCE_LINKS} />
      <div className={styles.main}>
        <Header pages={headerPages} />
        <div className={styles.container}>{children}</div>
      </div>
    </div>
  );
}
