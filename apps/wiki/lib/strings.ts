/**
 * String utilities
 */

const NON_WORD_CHARACTERS = /[^\p{L}\p{N}''-]+/gu;

export function normalizeWord(value: string | null | undefined): string {
  if (!value) return "";

  return value
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(NON_WORD_CHARACTERS, "");
}

export function isMeaningfulWord(value: string | null | undefined): boolean {
  return normalizeWord(value).length > 0;
}

export function getInitials(name: string): string {
  const trimmed = name.trim();

  if (!trimmed) {
    return "";
  }

  const tokens = trimmed.split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return "";
  }

  if (tokens.length === 1) {
    const single = tokens[0] ?? "";
    return single.slice(0, 2).toUpperCase();
  }

  const first = tokens[0] ?? "";
  const last = tokens[tokens.length - 1] ?? "";

  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

export function toSlugSegments(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap(normalizeSegment).filter(Boolean);
  }
  if (typeof value === "string") {
    return value.split("/").flatMap(normalizeSegment).filter(Boolean);
  }
  return [];
}

function normalizeSegment(value: unknown): string[] {
  if (typeof value !== "string") return [];
  const cleaned = value.trim();
  if (!cleaned) return [];
  if (!/^[-A-Za-z0-9]+$/.test(cleaned)) return [];
  return [cleaned];
}
