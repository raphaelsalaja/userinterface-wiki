export class ArticleNotFoundError extends Error {
  constructor(message = "Article not found") {
    super(message);
    this.name = "ArticleNotFoundError";
  }
}

export class ResponseError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ResponseError";
  }
}

export function isEnoent(error: unknown) {
  return Boolean(
    error &&
      typeof error === "object" &&
      (error as { code?: string }).code === "ENOENT",
  );
}

export function isNotFound(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const status = (error as { status?: number }).status;
  if (status === 404) return true;
  const code = (error as { code?: string }).code;
  if (code === "item_not_found") return true;
  const message = (error as { message?: string }).message ?? "";
  return message.toLowerCase().includes("does not exist");
}
