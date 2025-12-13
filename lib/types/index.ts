export interface Author {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  socials?: {
    twitter?: string;
    instagram?: string;
    cosmos?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

// Re-export content types for convenience
export type { FormattedPage, Page } from "@/lib/features/content/types";
