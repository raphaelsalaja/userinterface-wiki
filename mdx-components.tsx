import type { MDXComponents } from "mdx/types";
import { Preview } from "@/components/mdx";
import { Principles } from "@/documents/12-principles";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    Preview,
    ...Principles,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;
