"use client";

import { clsx } from "clsx";
import Link from "next/link";
import { createContext, useContext } from "react";
import {
  CodePreview,
  EssayPreview,
  MotionPreview,
} from "@/components/previews";
import type { FormattedPage } from "@/lib/source";
import styles from "./styles.module.css";

const PostContext = createContext<FormattedPage | null>(null);

function usePost() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("Post components must be used within Post.Root");
  }
  return context;
}

/* -------------------------------------------------------------------------------------------------
 * Primitives
 * -------------------------------------------------------------------------------------------------*/

interface RootProps {
  page: FormattedPage;
  children: React.ReactNode;
  className?: string;
}

function Root({ page, children, className }: RootProps) {
  return (
    <PostContext.Provider value={page}>
      <div data-post-root="" className={className}>
        {children}
      </div>
    </PostContext.Provider>
  );
}

interface LinkProps {
  children: React.ReactNode;
  className?: string;
}

function PostLink({ children, className }: LinkProps) {
  const { url } = usePost();
  return (
    <Link data-post-link="" href={{ pathname: url }} className={className}>
      {children}
    </Link>
  );
}

interface PreviewProps {
  className?: string;
}

function Preview({ className }: PreviewProps) {
  const { icon, title } = usePost();

  const content = (() => {
    switch (icon) {
      case "motion":
        return <MotionPreview />;
      case "code":
        return <CodePreview seed={title} />;
      default:
        return <EssayPreview seed={title} />;
    }
  })();

  return (
    <div data-post-preview="" className={className}>
      {content}
    </div>
  );
}

interface TitleProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span";
  className?: string;
}

function Title({ as: Tag = "h2", className }: TitleProps) {
  const { title } = usePost();
  return (
    <Tag data-post-title="" className={className}>
      {title}
    </Tag>
  );
}

interface DescriptionProps {
  as?: "p" | "span";
  className?: string;
}

function Description({ as: Tag = "p", className }: DescriptionProps) {
  const { description } = usePost();
  return (
    <Tag data-post-description="" className={className}>
      {description}
    </Tag>
  );
}

interface DateProps {
  options?: Intl.DateTimeFormatOptions;
  locale?: string;
  className?: string;
}

function PublishedDate({ options, locale = "en-US", className }: DateProps) {
  const { date } = usePost();
  const formatted = new Date(date).toLocaleDateString(locale, options);
  return (
    <span data-post-date="" className={clsx(styles.date, className)}>
      {formatted}
    </span>
  );
}

interface AuthorProps {
  className?: string;
}

function Author({ className }: AuthorProps) {
  const { author } = usePost();
  return (
    <span data-post-author="" className={className}>
      {author.name}
    </span>
  );
}

interface MetaProps {
  children: React.ReactNode;
  className?: string;
}

function Meta({ children, className }: MetaProps) {
  return (
    <span data-post-meta="" className={className}>
      {children}
    </span>
  );
}

interface SeparatorProps {
  className?: string;
}

function Separator({ className }: SeparatorProps) {
  return (
    <span
      data-post-separator=""
      className={clsx(styles.separator, className)}
    />
  );
}

interface DividerProps {
  className?: string;
}

function Divider({ className }: DividerProps) {
  return <hr data-post-divider="" className={className} />;
}

export const Post = {
  Root,
  Link: PostLink,
  Preview,
  Title,
  Description,
  Date: PublishedDate,
  Author,
  Meta,
  Separator,
  Divider,
};
