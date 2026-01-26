import type { ImageInfo, OGMetadata, ValidationIssue } from "./types.js";

const RULES = {
  "og:title": {
    required: true,
    maxLength: 60,
  },
  "og:description": {
    required: true,
    maxLength: 155,
  },
  "og:image": {
    required: true,
    minWidth: 1200,
    minHeight: 630,
    maxFileSize: 8 * 1024 * 1024, // 8MB
    aspectRatio: 1.91, // 1.91:1
    aspectRatioTolerance: 0.1,
  },
  "og:url": {
    required: true,
  },
  "twitter:card": {
    required: false,
    validTypes: ["summary", "summary_large_image", "app", "player"],
  },
} as const;

/**
 * Validate OG metadata and return issues
 *
 * @param metadata - The parsed OG metadata
 * @param imageInfo - Optional image info for dimension validation
 * @returns Array of validation issues
 */
export function validateMetadata(
  metadata: OGMetadata,
  imageInfo?: ImageInfo,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!metadata.og.title && !metadata.basic.title) {
    issues.push({
      tag: "og:title",
      message: "Missing og:title (and no fallback <title> found)",
      severity: "error",
    });
  } else {
    const title = metadata.og.title || metadata.basic.title || "";
    if (title.length > RULES["og:title"].maxLength) {
      issues.push({
        tag: "og:title",
        message: `Title exceeds ${RULES["og:title"].maxLength} characters (${title.length} chars)`,
        severity: "warning",
        value: title,
      });
    }
  }

  if (!metadata.og.description && !metadata.basic.description) {
    issues.push({
      tag: "og:description",
      message:
        "Missing og:description (and no fallback meta description found)",
      severity: "error",
    });
  } else {
    const description =
      metadata.og.description || metadata.basic.description || "";
    if (description.length > RULES["og:description"].maxLength) {
      issues.push({
        tag: "og:description",
        message: `Description exceeds ${RULES["og:description"].maxLength} characters (${description.length} chars)`,
        severity: "warning",
        value: description,
      });
    }
  }

  if (!metadata.og.image) {
    issues.push({
      tag: "og:image",
      message: "Missing og:image",
      severity: "error",
    });
  } else {
    try {
      new URL(metadata.og.image);
    } catch {
      issues.push({
        tag: "og:image",
        message: "Invalid og:image URL format",
        severity: "error",
        value: metadata.og.image,
      });
    }

    if (imageInfo) {
      if (imageInfo.error) {
        issues.push({
          tag: "og:image",
          message: `Failed to fetch image: ${imageInfo.error}`,
          severity: "warning",
          value: metadata.og.image,
        });
      } else {
        if (imageInfo.width && imageInfo.width < RULES["og:image"].minWidth) {
          issues.push({
            tag: "og:image",
            message: `Image width (${imageInfo.width}px) is below recommended ${RULES["og:image"].minWidth}px`,
            severity: "warning",
            value: `${imageInfo.width}x${imageInfo.height}`,
          });
        }

        if (
          imageInfo.height &&
          imageInfo.height < RULES["og:image"].minHeight
        ) {
          issues.push({
            tag: "og:image",
            message: `Image height (${imageInfo.height}px) is below recommended ${RULES["og:image"].minHeight}px`,
            severity: "warning",
            value: `${imageInfo.width}x${imageInfo.height}`,
          });
        }

        if (imageInfo.width && imageInfo.height) {
          const ratio = imageInfo.width / imageInfo.height;
          if (
            Math.abs(ratio - RULES["og:image"].aspectRatio) >
            RULES["og:image"].aspectRatioTolerance
          ) {
            issues.push({
              tag: "og:image",
              message: `Image aspect ratio (${ratio.toFixed(2)}:1) differs from recommended 1.91:1`,
              severity: "warning",
              value: `${imageInfo.width}x${imageInfo.height}`,
            });
          }
        }

        if (
          imageInfo.fileSize &&
          imageInfo.fileSize > RULES["og:image"].maxFileSize
        ) {
          const sizeMB = (imageInfo.fileSize / (1024 * 1024)).toFixed(2);
          issues.push({
            tag: "og:image",
            message: `Image file size (${sizeMB}MB) exceeds recommended 8MB`,
            severity: "warning",
            value: `${sizeMB}MB`,
          });
        }
      }
    }
  }

  if (!metadata.og.url) {
    issues.push({
      tag: "og:url",
      message: "Missing og:url",
      severity: "warning",
    });
  } else {
    try {
      new URL(metadata.og.url);
    } catch {
      issues.push({
        tag: "og:url",
        message: "Invalid og:url format",
        severity: "error",
        value: metadata.og.url,
      });
    }
  }

  if (metadata.twitter.card) {
    const validTypes: readonly string[] = RULES["twitter:card"].validTypes;
    if (!validTypes.includes(metadata.twitter.card)) {
      issues.push({
        tag: "twitter:card",
        message: `Invalid twitter:card type: ${metadata.twitter.card}`,
        severity: "error",
        value: metadata.twitter.card,
      });
    }
  }

  return issues;
}

export async function fetchImageInfo(imageUrl: string): Promise<ImageInfo> {
  try {
    const response = await fetch(imageUrl, {
      method: "HEAD",
      headers: { "User-Agent": "OG-Analyzer/1.0" },
    });

    if (!response.ok) {
      return { url: imageUrl, error: `HTTP ${response.status}` };
    }

    const contentLength = response.headers.get("content-length");
    const contentType = response.headers.get("content-type");

    return {
      url: imageUrl,
      fileSize: contentLength ? Number.parseInt(contentLength, 10) : undefined,
      format: contentType?.split("/")[1],
    };
  } catch (error) {
    return {
      url: imageUrl,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function getValidationSummary(issues: ValidationIssue[]): {
  errors: number;
  warnings: number;
  isValid: boolean;
} {
  const errors = issues.filter((i) => i.severity === "error").length;
  const warnings = issues.filter((i) => i.severity === "warning").length;

  return {
    errors,
    warnings,
    isValid: errors === 0,
  };
}
