import type { JSONContent } from "@tiptap/react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface OperatorTokenNode {
  type: "operatorToken";
  attrs: { key: string };
}

interface ValueTokenNode {
  type: "valueToken";
  attrs: { value: string; valid?: boolean; negated?: boolean };
}

interface TextNode {
  type: "text";
  text: string;
}

type ContentNode = OperatorTokenNode | ValueTokenNode | TextNode | JSONContent;

// ─────────────────────────────────────────────────────────────────────────────
// Serializer
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Serialize the Tiptap JSON document into a query string.
 *
 * The output follows a simple format:
 * - OperatorToken + ValueToken pairs become "operator:value"
 * - Negated values become "-operator:value"
 * - Plain text is passed through as-is
 *
 * @example
 * serializeQuery(editor.getJSON())
 * // => "author:johndoe tag:design before:2024-01-01"
 */
export function serializeQuery(doc: JSONContent): string {
  const parts: string[] = [];

  function walk(node: ContentNode) {
    if (!node) return;

    if (node.type === "operatorToken") {
      const opNode = node as OperatorTokenNode;
      parts.push(`${opNode.attrs.key}:`);
    } else if (node.type === "valueToken") {
      const valNode = node as ValueTokenNode;
      const prefix = valNode.attrs.negated ? "-" : "";
      // Remove trailing colon from last part if present
      const lastPart = parts[parts.length - 1];
      if (lastPart?.endsWith(":")) {
        parts[parts.length - 1] = `${prefix}${lastPart}${valNode.attrs.value}`;
      } else {
        parts.push(valNode.attrs.value);
      }
    } else if (node.type === "text") {
      const textNode = node as TextNode;
      const text = textNode.text.trim();
      if (text) parts.push(text);
    } else if (node.type === "paragraph" || node.type === "doc") {
      const children = (node as JSONContent).content ?? [];
      for (const child of children) {
        walk(child);
      }
    }
  }

  walk(doc);

  return parts.join(" ").replace(/\s+/g, " ").trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// Normalizer
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalize a query string for use with liqe.
 *
 * Transforms operator:value pairs into liqe-compatible syntax:
 * - "author:john" → "author:john"
 * - "-tag:old" → "NOT tag:old"
 * - "before:2024-01-01" → "date:<2024-01-01"
 * - "after:2024-01-01" → "date:>2024-01-01"
 * - "during:2024" → "date:>=2024-01-01 AND date:<=2024-12-31"
 * - Plain text is wrapped as a title search
 */
export function normalizeQuery(query: string): string {
  if (!query.trim()) return "*";

  const tokens = query.split(/\s+/);
  const normalized: string[] = [];

  for (const token of tokens) {
    // Handle negated operators
    if (token.startsWith("-")) {
      const inner = token.slice(1);
      const colonIndex = inner.indexOf(":");
      if (colonIndex !== -1) {
        const op = inner.slice(0, colonIndex);
        const val = inner.slice(colonIndex + 1);
        normalized.push(`NOT ${normalizeOperator(op, val)}`);
        continue;
      }
    }

    // Handle regular operators
    const colonIndex = token.indexOf(":");
    if (colonIndex !== -1) {
      const op = token.slice(0, colonIndex);
      const val = token.slice(colonIndex + 1);
      if (val) {
        normalized.push(normalizeOperator(op, val));
        continue;
      }
    }

    // Plain text → title search
    if (token) {
      normalized.push(`title:${token}`);
    }
  }

  return normalized.join(" AND ") || "*";
}

function normalizeOperator(op: string, val: string): string {
  switch (op.toLowerCase()) {
    case "before":
      return `date:<${val}`;
    case "after":
      return `date:>${val}`;
    case "during": {
      // Expand "during:2024" to a date range
      const year = Number.parseInt(val, 10);
      if (!Number.isNaN(year)) {
        return `(date:>=${year}-01-01 AND date:<=${year}-12-31)`;
      }
      return `date:${val}`;
    }
    case "sort":
      // Sort is handled separately, not part of filter
      return "";
    default:
      return `${op}:${val}`;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sort Extractor
// ─────────────────────────────────────────────────────────────────────────────

export type SortOption = "newest" | "oldest" | "a-z" | "z-a";

/**
 * Extract sort option from query string.
 */
export function extractSort(query: string): SortOption | null {
  const match = query.match(/sort:(\S+)/i);
  if (!match) return null;

  const val = match[1].toLowerCase();
  if (val === "newest" || val === "oldest" || val === "a-z" || val === "z-a") {
    return val;
  }
  return null;
}
