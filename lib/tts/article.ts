import { readFile } from "node:fs/promises";
import path from "node:path";
import removeMarkdown from "remove-markdown";
import { CONTENT_DIR } from "./constants";
import { ArticleNotFoundError, isEnoent } from "./errors";

export async function getPlainArticleText(slugSegments: string[]) {
  const articlePath = resolveArticlePath(slugSegments);
  const raw = await readFile(articlePath, "utf8").catch((error) => {
    if (isEnoent(error)) throw new ArticleNotFoundError();
    throw error;
  });

  const body = stripFrontmatter(raw);
  const spokenSource = stripCodeSections(body);
  return removeMarkdown(spokenSource, { useImgAltText: false }).trim();
}

export function resolveArticlePath(slugSegments: string[]) {
  const relativePath = `${path.join(...slugSegments)}.mdx`;
  const absolute = path.join(CONTENT_DIR, relativePath);
  const rel = path.relative(CONTENT_DIR, absolute);

  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error("Invalid slug path");
  }

  return absolute;
}

function stripFrontmatter(value: string) {
  if (!value.startsWith("---")) return value;
  const closingIndex = value.indexOf("\n---", 3);
  if (closingIndex === -1) return value;
  return value.slice(closingIndex + 4);
}

function stripCodeSections(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, "")
    .replace(/~~~[\s\S]*?~~~/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/<pre[\s\S]*?<\/pre>/gi, "");
}
