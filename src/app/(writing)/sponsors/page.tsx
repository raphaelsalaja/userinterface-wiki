import type { Metadata } from "next";
import { PageTransition } from "@/components/chrome/page-transition";
import {
  getSponsorsByTier,
  SPONSOR_CTA_URL,
  TIER_LABELS,
} from "@/lib/sponsors";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Sponsors",
  description:
    "The people and companies keeping the User Interface Wiki free and open.",
};

export default function SponsorsPage() {
  const tiers = getSponsorsByTier();

  return (
    <PageTransition>
      <div className={styles.header}>
        <h1 className={styles.title}>Sponsors</h1>
        <p className={styles.subtitle}>
          Everything here is free and open source — the articles, the demos, and
          the agent skill. Sponsorship keeps it that way.
        </p>
        <a
          href={SPONSOR_CTA_URL}
          className={styles.cta}
          target="_blank"
          rel="noreferrer"
        >
          Become a sponsor
        </a>
      </div>

      <div className={styles.tiers}>
        {tiers.map(({ tier, sponsors }) => (
          <section key={tier} className={styles.tier}>
            <h2 className={styles.label}>{TIER_LABELS[tier]}</h2>
            {sponsors.length > 0 ? (
              <ul className={styles.grid} data-tier={tier}>
                {sponsors.map((sponsor) => (
                  <li key={sponsor.url}>
                    <a
                      href={sponsor.url}
                      className={styles.card}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {sponsor.name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <a
                href={SPONSOR_CTA_URL}
                className={styles.placeholder}
                target="_blank"
                rel="noreferrer"
              >
                Your name here
              </a>
            )}
          </section>
        ))}
      </div>
    </PageTransition>
  );
}
