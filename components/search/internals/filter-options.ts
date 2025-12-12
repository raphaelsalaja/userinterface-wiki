// Filter option configuration for search
export interface FilterOption {
  key: string;
  label: string;
  description: string;
  example?: string;
}

export const FILTER_OPTIONS: FilterOption[] = [
  {
    key: "tag:",
    label: "tag:",
    description: "Filter by tag",
    example: "tag:animation",
  },
  {
    key: "author:",
    label: "author:",
    description: "Filter by author",
    example: "author:John",
  },
  {
    key: "before:",
    label: "before:",
    description: "Published before date",
    example: "before:2024-01-01",
  },
  {
    key: "after:",
    label: "after:",
    description: "Published after date",
    example: "after:2024-01-01",
  },
  {
    key: "during:",
    label: "during:",
    description: "Published on exact date",
    example: "during:2024-06-15",
  },
  {
    key: "sort:",
    label: "sort:",
    description: "Sort results",
    example: "sort:oldest",
  },
];

export const SORT_OPTIONS = ["newest", "oldest", "relevance"] as const;
