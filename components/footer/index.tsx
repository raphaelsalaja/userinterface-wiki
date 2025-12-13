import type React from "react";
import { Button } from "@/components/button";
import {
  CopyIcon,
  DownloadIcon,
  GithubIcon,
  LinkIcon,
  TwitterIcon,
} from "@/components/icons";
import styles from "./styles.module.css";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <div className={styles.section}>
      <h3 className={styles.label}>{title}</h3>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

export function Footer(): React.JSX.Element {
  return (
    <footer className={styles.header}>
      <hr className={styles.divider} />
      <div className={styles.metadata}>
        <Section title="Share Article">
          <Button size="small" variant="text">
            <LinkIcon size={18} />
            Link
          </Button>{" "}
          <Button size="small" variant="text">
            <TwitterIcon size={18} />X (Twitter)
          </Button>
        </Section>
        <Section title="Resources">
          <Button size="small" variant="text">
            <CopyIcon size={18} />
            Copy Text
          </Button>
          <Button size="small" variant="text">
            <LinkIcon size={18} />
            Share Link
          </Button>
          <Button size="small" variant="text">
            <GithubIcon size={18} />
            View Github
          </Button>
          <Button size="small" variant="text">
            <DownloadIcon size={18} />
            Download Media
          </Button>
        </Section>
      </div>
    </footer>
  );
}

export default Footer;
