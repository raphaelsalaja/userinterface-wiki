/**
 * OpenGraph metadata extracted from a page
 */
export interface OGMetadata {
  og: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    siteName?: string;
    locale?: string;
    imageWidth?: string;
    imageHeight?: string;
    imageAlt?: string;
  };
  twitter: {
    card?: "summary" | "summary_large_image" | "app" | "player" | string;
    title?: string;
    description?: string;
    image?: string;
    site?: string;
    creator?: string;
  };
  basic: {
    title?: string;
    description?: string;
    canonical?: string;
  };
}

/**
 * Validation issue severity
 */
export type ValidationSeverity = "error" | "warning";

/**
 * A single validation issue
 */
export interface ValidationIssue {
  tag: string;
  message: string;
  severity: ValidationSeverity;
  value?: string;
}

/**
 * Image metadata fetched for validation
 */
export interface ImageInfo {
  url: string;
  width?: number;
  height?: number;
  fileSize?: number;
  format?: string;
  error?: string;
}

/**
 * Analysis result for a single route
 */
export interface RouteAnalysis {
  route: string;
  url: string;
  metadata: OGMetadata;
  issues: ValidationIssue[];
  imageInfo?: ImageInfo;
  fetchedAt: string;
}

/**
 * Complete analysis report
 */
export interface AnalysisReport {
  baseUrl: string;
  analyzedAt: string;
  routes: RouteAnalysis[];
  summary: {
    total: number;
    valid: number;
    withErrors: number;
    withWarnings: number;
  };
}

/**
 * Prerender manifest structure (partial)
 */
export interface PrerenderManifest {
  version: number;
  routes: Record<
    string,
    {
      srcRoute: string;
      dataRoute: string | null;
    }
  >;
  dynamicRoutes: Record<
    string,
    {
      routeRegex: string;
      dataRoute: string;
    }
  >;
}
