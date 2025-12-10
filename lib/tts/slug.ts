export function toSlugSegments(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap(normalizeSegment).filter(Boolean);
  }
  if (typeof value === "string") {
    return value.split("/").flatMap(normalizeSegment).filter(Boolean);
  }
  return [];
}

function normalizeSegment(value: unknown) {
  if (typeof value !== "string") return [];
  const cleaned = value.trim();
  if (!cleaned) return [];
  if (!/^[-A-Za-z0-9]+$/.test(cleaned)) return [];
  return [cleaned];
}
