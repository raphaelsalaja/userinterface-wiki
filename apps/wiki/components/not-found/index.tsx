"use client";

import Link from "next/link";
import { Button } from "@/components/button";
import { GithubIcon } from "@/icons";
import { SITE_MANIFEST } from "@/lib/site";
import styles from "./styles.module.css";

export function NotFound() {
  const handleReportIssue = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = encodeURIComponent("404: Page not found");
    const body = encodeURIComponent(
      `## Description\nA 404 error occurred when trying to access a page.\n\n## URL\n${url}\n\n## Additional Context\nPlease add any additional context about this issue.`,
    );
    window.open(
      `${SITE_MANIFEST.github}/issues/new?title=${title}&body=${body}`,
      "_blank",
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>
        This page doesn't exist or has been moved.
      </p>
      <div className={styles.actions}>
        <Button
          variant="primary"
          radius="full"
          render={(props) => <Link href="/" {...props} />}
        >
          Return
        </Button>
        <Button
          variant="secondary"
          aspect="square"
          radius="full"
          onClick={handleReportIssue}
        >
          <GithubIcon size={16} />
        </Button>
      </div>
    </div>
  );
}
