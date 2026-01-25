import type { z } from "zod";
import type { authorSchema } from "./authors";

/**
 * Author data from JSON files
 */
export type Author = z.infer<typeof authorSchema>;

/**
 * A formatted page with resolved author data and formatted dates.
 * This is the canonical shape for displaying page metadata in components.
 */
export interface FormattedPage {
  url: string;
  title: string;
  description: string;
  author: Author;
  coauthors: Author[];
  icon?: "motion" | "code" | "writing";
  date: {
    published: string;
  };
}
