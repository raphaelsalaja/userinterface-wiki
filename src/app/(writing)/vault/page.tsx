import type { Metadata } from "next";
import { PageTransition } from "@/components/chrome/page-transition";
import { Vault } from "@/components/features/vault";
import { VAULT_RESOURCES } from "@/lib/vault";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Vault",
  description:
    "A curated library of the videos, articles, talks, books, and tools behind the wiki.",
};

export default function VaultPage() {
  return (
    <PageTransition>
      <div className={styles.header}>
        <h1 className={styles.title}>Vault</h1>
        <p className={styles.subtitle}>
          The videos, talks, books, and tools this wiki stands on — curated, not
          exhaustive.
        </p>
      </div>
      <div className={styles.content}>
        <Vault resources={VAULT_RESOURCES} />
      </div>
    </PageTransition>
  );
}
