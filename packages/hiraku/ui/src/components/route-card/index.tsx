import { Collapsible } from "@base-ui/react/collapsible";
import type { RouteAnalysis } from "../../types";
import { PreviewCard } from "../preview-card";
import styles from "./styles.module.css";

interface RouteCardProps {
  route: RouteAnalysis;
  isExpanded: boolean;
  onToggle: () => void;
}

export function RouteCard({ route, isExpanded, onToggle }: RouteCardProps) {
  const errors = route.issues.filter((i) => i.severity === "error").length;
  const warnings = route.issues.filter((i) => i.severity === "warning").length;

  return (
    <Collapsible.Root open={isExpanded} onOpenChange={onToggle}>
      <div className={styles.card}>
        <Collapsible.Trigger className={styles.header}>
          <span className={styles.path}>{route.route}</span>
          <div className={styles.badges}>
            {errors > 0 && (
              <span className={styles.badge} data-variant="error">
                {errors} error{errors > 1 ? "s" : ""}
              </span>
            )}
            {warnings > 0 && (
              <span className={styles.badge} data-variant="warning">
                {warnings} warning{warnings > 1 ? "s" : ""}
              </span>
            )}
            {errors === 0 && warnings === 0 && (
              <span className={styles.badge} data-variant="valid">
                Valid
              </span>
            )}
          </div>
        </Collapsible.Trigger>

        <Collapsible.Panel className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles["section-title"]}>Social Previews</h3>
            <div className={styles["preview-cards"]}>
              {["Twitter", "Facebook", "LinkedIn"].map((platform) => (
                <PreviewCard
                  key={platform}
                  platform={platform}
                  metadata={route.metadata}
                  url={route.url}
                />
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles["section-title"]}>Metadata</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Tag</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["og:title", route.metadata.og.title],
                  ["og:description", route.metadata.og.description],
                  ["og:image", route.metadata.og.image],
                  ["og:url", route.metadata.og.url],
                  ["og:type", route.metadata.og.type],
                  ["og:site_name", route.metadata.og.siteName],
                  ["twitter:card", route.metadata.twitter.card],
                  ["twitter:title", route.metadata.twitter.title],
                  ["twitter:description", route.metadata.twitter.description],
                  ["twitter:image", route.metadata.twitter.image],
                ].map(([tag, value]) => (
                  <tr key={tag}>
                    <td className={styles.tag}>{tag}</td>
                    <td className={value ? styles.value : styles.empty}>
                      {value || "(not set)"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {route.issues.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles["section-title"]}>Issues</h3>
              <div className={styles["issues-list"]}>
                {route.issues.map((issue) => (
                  <div
                    key={`${issue.tag}-${issue.message}`}
                    className={styles.issue}
                    data-severity={issue.severity}
                  >
                    <span className={styles["issue-icon"]}>
                      {issue.severity === "error" ? "✕" : "⚠"}
                    </span>
                    <span>
                      {issue.tag}: {issue.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Collapsible.Panel>
      </div>
    </Collapsible.Root>
  );
}
