export interface OGMetadata {
  og: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    siteName?: string;
  };
  twitter: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
  };
  basic: {
    title?: string;
    description?: string;
  };
}

export interface ValidationIssue {
  tag: string;
  message: string;
  severity: "error" | "warning";
}

export interface RouteAnalysis {
  route: string;
  url: string;
  metadata: OGMetadata;
  issues: ValidationIssue[];
}

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
