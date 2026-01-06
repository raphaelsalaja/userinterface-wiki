"use client";

import { ScrollArea } from "@base-ui/react/scroll-area";
import { useState } from "react";
import { Button } from "@/components/button";
import {
  ArrowsRepeatIcon,
  Checkmark1Icon,
  GithubIcon,
  SquareBehindSquare1Icon,
} from "@/icons";
import { SITE_MANIFEST } from "@/lib/site";
import styles from "./styles.module.css";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function GlobalError({ error, reset }: GlobalErrorProps) {
  const [copied, setCopied] = useState(false);

  const errorText = `${error.name || "Error"}: ${error.message}\n\n${error.stack || ""}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(errorText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReportIssue = () => {
    const title = encodeURIComponent(
      `[Bug] ${error.name || "Error"}: ${error.message}`,
    );
    const body = encodeURIComponent(
      `## Description\n\nDescribe what you were doing when this error occurred.\n\n## Error Details\n\n\`\`\`\n${errorText}\`\`\`\n\n## Environment\n\n- URL: ${typeof window !== "undefined" ? window.location.href : "Unknown"}\n- User Agent: ${typeof navigator !== "undefined" ? navigator.userAgent : "Unknown"}`,
    );
    window.open(
      `${SITE_MANIFEST.github}/issues/new?title=${title}&body=${body}`,
      "_blank",
    );
  };

  const sharedProps = {
    button: { aspect: "square", radius: "full" } as const,
    icon: { size: 16 },
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{error.name || "Error"} :(</h1>
      <p className={styles.message}>{error.message}</p>
      {error.stack && (
        <ScrollArea.Root className={styles.scroll}>
          <ScrollArea.Viewport className={styles.viewport}>
            <ScrollArea.Content>
              <pre className={styles.stack}>{error.stack}</pre>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar className={styles.scrollbar}>
            <ScrollArea.Thumb className={styles.thumb} />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      )}
      <div className={styles.actions}>
        <Button onClick={reset} aria-label="Try again" {...sharedProps.button}>
          <ArrowsRepeatIcon {...sharedProps.icon} />
        </Button>
        <Button
          onClick={handleCopy}
          {...sharedProps.button}
          aria-label={copied ? "Copied" : "Copy error"}
        >
          {copied ? (
            <Checkmark1Icon {...sharedProps.icon} />
          ) : (
            <SquareBehindSquare1Icon {...sharedProps.icon} />
          )}
        </Button>
        <Button
          onClick={handleReportIssue}
          aria-label="Report issue on GitHub"
          {...sharedProps.button}
        >
          <GithubIcon {...sharedProps.icon} />
        </Button>
      </div>
    </div>
  );
}
