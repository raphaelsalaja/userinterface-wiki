/**
 * Sections - ordered curriculum groupings for the academy layout
 */

import { type FormattedPage, formatPages, type Page, source } from "./source";

export interface SectionDefinition {
  id: string;
  label: string;
  description: string;
  /** Article slugs in reading order. */
  slugs: string[];
}

export const SECTION_DEFINITIONS: SectionDefinition[] = [
  {
    id: "motion",
    label: "Motion",
    description:
      "Animation principles, springs, exits, and morphing — how interfaces move.",
    slugs: [
      "12-principles-of-animation",
      "to-spring-or-not-to-spring",
      "mastering-animate-presence",
      "animating-container-bounds",
      "morphing-icons",
    ],
  },
  {
    id: "sound",
    label: "Sound",
    description:
      "Audio feedback and synthesis — when and how interfaces should speak.",
    slugs: ["sounds-on-the-web", "generating-sounds-with-ai"],
  },
  {
    id: "craft",
    label: "Craft",
    description:
      "CSS and typography details that separate considered interfaces from default ones.",
    slugs: [
      "taking-advantage-of-pseudo-elements",
      "your-font-can-do-more",
      "nest-radii",
      "stack-shadows",
      "balance-headlines",
      "alpha-borders",
    ],
  },
  {
    id: "experience",
    label: "Experience",
    description:
      "The psychology and perception tricks behind interfaces that feel right.",
    slugs: ["laws-of-ux", "skip-the-spinner", "predictive-prefetching"],
  },
  {
    id: "resources",
    label: "Resources",
    description: "Tools and references for applying the wiki in your work.",
    slugs: ["skill"],
  },
];

export interface Section {
  id: string;
  label: string;
  description: string;
  pages: FormattedPage[];
}

function pageSlug(page: Page): string {
  return page.slugs.join("/");
}

/**
 * Returns all sections with their pages resolved, in curriculum order.
 * Pages not assigned to any section are collected into an "Other" bucket.
 */
export function getSections(): Section[] {
  const pages = source.getPages();
  const bySlug = new Map(pages.map((page) => [pageSlug(page), page]));
  const assigned = new Set<string>();

  const sections: Section[] = [];

  for (const definition of SECTION_DEFINITIONS) {
    const sectionPages: Page[] = [];
    for (const slug of definition.slugs) {
      const page = bySlug.get(slug);
      if (page) {
        sectionPages.push(page);
        assigned.add(slug);
      }
    }
    if (sectionPages.length > 0) {
      sections.push({
        id: definition.id,
        label: definition.label,
        description: definition.description,
        pages: formatPages(sectionPages),
      });
    }
  }

  const unassigned = pages.filter((page) => !assigned.has(pageSlug(page)));
  if (unassigned.length > 0) {
    sections.push({
      id: "other",
      label: "Other",
      description: "Everything else.",
      pages: formatPages(
        [...unassigned].sort(
          (a, b) =>
            new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
        ),
      ),
    });
  }

  return sections;
}

/**
 * All pages flattened in curriculum order.
 */
export function getOrderedPages(): FormattedPage[] {
  return getSections().flatMap((section) => section.pages);
}

/**
 * Previous and next articles relative to the given slug, in curriculum order.
 */
export function getAdjacentPages(slug: string): {
  prev: FormattedPage | null;
  next: FormattedPage | null;
} {
  const ordered = getOrderedPages();
  const index = ordered.findIndex((page) => page.url === `/${slug}`);

  if (index === -1) return { prev: null, next: null };

  return {
    prev: index > 0 ? ordered[index - 1] : null,
    next: index < ordered.length - 1 ? ordered[index + 1] : null,
  };
}
