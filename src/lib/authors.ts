/**
 * Authors - load, validate, and lookup author data
 */

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const slug = /^[a-z0-9-]+$/;

export const authorSchema = z
  .object({
    id: z.string().regex(slug),
    name: z.string().min(1),
    bio: z.string().min(1).optional(),
    avatar: z.string().url().optional(),
    socials: z
      .object({
        twitter: z.string().url().optional(),
        instagram: z.string().url().optional(),
        cosmos: z.string().url().optional(),
        github: z.string().url().optional(),
        linkedin: z.string().url().optional(),
        website: z.string().url().optional(),
      })
      .optional(),
  })
  .strict();

export type Author = z.infer<typeof authorSchema>;

const directory = join(dirname(fileURLToPath(import.meta.url)), "authors");

const registry = new Map<string, Author>();

export const authors = readdirSync(directory)
  .filter((filename) => filename.endsWith(".json"))
  .sort((a, b) => a.localeCompare(b))
  .map((filename) => {
    const absolutePath = join(directory, filename);
    const relativePath = relative(process.cwd(), absolutePath);

    let definition: unknown;

    try {
      const contents = readFileSync(absolutePath, "utf8");
      definition = JSON.parse(contents);
    } catch (error) {
      throw new Error(
        `Unable to read author file ${relativePath}: ${(error as Error).message}`,
      );
    }

    const result = authorSchema.safeParse(definition);

    if (!result.success) {
      throw new Error(
        `Invalid author definition in ${relativePath}: ${result.error.message}`,
      );
    }

    return result.data;
  })
  .map((author) => {
    if (registry.has(author.id)) {
      throw new Error(`Duplicate author id: ${author.id}`);
    }

    registry.set(author.id, author);

    return author;
  });

export function getAuthorById(id: string): Author {
  const author = registry.get(id);

  if (!author) {
    throw new Error(`Author not found: ${id}`);
  }

  return author;
}
