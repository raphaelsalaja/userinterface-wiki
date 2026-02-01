"use client";

import { Field } from "@base-ui/react/field";
import Fuse from "fuse.js";
import Link from "next/link";
import { createContext, type ReactNode, use, useMemo, useState } from "react";
import { MagnifyingGlassIcon } from "@/icons";
import type { DemoInfo } from "@/lib/demos";
import styles from "./styles.module.css";

interface DemoListState {
  query: string;
  filteredDemos: DemoInfo[];
  demosByArticle: Record<string, DemoInfo[]>;
}

interface DemoListActions {
  setQuery: (query: string) => void;
}

interface DemoListContextValue {
  state: DemoListState;
  actions: DemoListActions;
}

const DemoListContext = createContext<DemoListContextValue | null>(null);

function useDemoList() {
  const context = use(DemoListContext);
  if (!context) {
    throw new Error("DemoList components must be used within DemoList.Root");
  }
  return context;
}

interface RootProps {
  demos: DemoInfo[];
  children: ReactNode;
}

function Root({ demos, children }: RootProps) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(demos, {
        keys: ["title", "articleTitle", "slug", "article"],
        threshold: 0.3,
        includeScore: true,
      }),
    [demos],
  );

  const filteredDemos = useMemo(() => {
    const q = query.trim();
    return q ? fuse.search(q).map((result) => result.item) : demos;
  }, [fuse, demos, query]);

  const demosByArticle = useMemo(() => {
    return filteredDemos.reduce(
      (acc, demo) => {
        if (!acc[demo.article]) {
          acc[demo.article] = [];
        }
        acc[demo.article].push(demo);
        return acc;
      },
      {} as Record<string, DemoInfo[]>,
    );
  }, [filteredDemos]);

  const value: DemoListContextValue = {
    state: { query, filteredDemos, demosByArticle },
    actions: { setQuery },
  };

  return <DemoListContext value={value}>{children}</DemoListContext>;
}

function Header({ children }: { children: ReactNode }) {
  return <div className={styles.header}>{children}</div>;
}

function Title({ children }: { children: ReactNode }) {
  return <h1 className={styles.heading}>{children}</h1>;
}

interface SearchProps {
  placeholder?: string;
}

function Search({ placeholder = "Search…" }: SearchProps) {
  const { state, actions } = useDemoList();

  return (
    <div className={styles.toolbar}>
      <Field.Root className={styles.search}>
        <MagnifyingGlassIcon className={styles.icon} size={18} />
        <Field.Control
          type="search"
          className={styles.input}
          placeholder={placeholder}
          value={state.query}
          onChange={(e) => actions.setQuery(e.target.value)}
        />
      </Field.Root>
    </div>
  );
}

function Content({ children }: { children: ReactNode }) {
  return <div className={styles.content}>{children}</div>;
}

function List({ children }: { children?: ReactNode }) {
  const { state } = useDemoList();

  return (
    <div className={styles.list}>
      {children ??
        Object.entries(state.demosByArticle).map(([article, demos]) => (
          <Section key={article} demos={demos} />
        ))}
    </div>
  );
}

interface SectionProps {
  demos: DemoInfo[];
  title?: string;
}

function Section({ demos, title }: SectionProps) {
  const sectionTitle = title ?? demos[0]?.articleTitle;

  return (
    <section className={styles.section}>
      <h2 className={styles["section-title"]}>{sectionTitle}</h2>
      <ul className={styles.items}>
        {demos.map((demo) => (
          <Item key={demo.url} demo={demo} />
        ))}
      </ul>
    </section>
  );
}

interface ItemProps {
  demo: DemoInfo;
}

function Item({ demo }: ItemProps) {
  return (
    <li className={styles.item}>
      <Link href={demo.url} className={styles.row}>
        {demo.title}
      </Link>
    </li>
  );
}

export const DemoList = {
  Root,
  Header,
  Title,
  Search,
  Content,
  List,
  Section,
  Item,
};

interface DemosPageProps {
  demos: DemoInfo[];
}

export function DemosPage({ demos }: DemosPageProps) {
  return (
    <Root demos={demos}>
      <Header>
        <Title>All Demos</Title>
      </Header>
      <Content>
        <Search />
        <List />
      </Content>
    </Root>
  );
}
