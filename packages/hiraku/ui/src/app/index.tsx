import { useEffect, useState } from "react";
import { RouteCard } from "../components/route-card";
import { Summary } from "../components/summary";
import type { AnalysisReport } from "../types";
import styles from "./styles.module.css";

export function App() {
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [expandedRoutes, setExpandedRoutes] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/report")
      .then((res) => res.json())
      .then(setReport);
  }, []);

  const toggleRoute = (route: string) => {
    setExpandedRoutes((prev) => {
      const next = new Set(prev);
      if (next.has(route)) {
        next.delete(route);
      } else {
        next.add(route);
      }
      return next;
    });
  };

  if (!report) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>hiraku</h1>
        <p className={styles.subtitle}>
          Analyzed {report.summary.total} routes at{" "}
          {new Date(report.analyzedAt).toLocaleString()}
        </p>
      </header>

      <Summary summary={report.summary} />

      <div className={styles["routes-list"]}>
        {report.routes.map((route) => (
          <RouteCard
            key={route.route}
            route={route}
            isExpanded={expandedRoutes.has(route.route)}
            onToggle={() => toggleRoute(route.route)}
          />
        ))}
      </div>
    </div>
  );
}
