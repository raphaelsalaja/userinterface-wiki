"use client";

import { useState } from "react";
import type { VaultResource, VaultTopic, VaultType } from "@/lib/vault";
import styles from "./styles.module.css";

const TYPE_LABELS: Record<VaultType, string> = {
  video: "Videos",
  article: "Articles",
  talk: "Talks",
  book: "Books",
  tool: "Tools",
};

const TOPIC_LABELS: Record<VaultTopic, string> = {
  motion: "Motion",
  sound: "Sound",
  craft: "Craft",
  experience: "Experience",
};

interface VaultProps {
  resources: VaultResource[];
}

export function Vault({ resources }: VaultProps) {
  const [type, setType] = useState<VaultType | null>(null);
  const [topic, setTopic] = useState<VaultTopic | null>(null);

  const filtered = resources.filter(
    (resource) =>
      (!type || resource.type === type) &&
      (!topic || resource.topics.includes(topic)),
  );

  return (
    <div className={styles.vault}>
      <div className={styles.filters}>
        <fieldset className={styles["filter-group"]} aria-label="Type">
          <FilterButton active={type === null} onClick={() => setType(null)}>
            All
          </FilterButton>
          {(Object.keys(TYPE_LABELS) as VaultType[]).map((key) => (
            <FilterButton
              key={key}
              active={type === key}
              onClick={() => setType(type === key ? null : key)}
            >
              {TYPE_LABELS[key]}
            </FilterButton>
          ))}
        </fieldset>
        <fieldset className={styles["filter-group"]} aria-label="Topic">
          {(Object.keys(TOPIC_LABELS) as VaultTopic[]).map((key) => (
            <FilterButton
              key={key}
              active={topic === key}
              onClick={() => setTopic(topic === key ? null : key)}
            >
              {TOPIC_LABELS[key]}
            </FilterButton>
          ))}
        </fieldset>
      </div>

      <ul className={styles.list}>
        {filtered.map((resource) => (
          <li key={resource.url}>
            <a
              href={resource.url}
              className={styles.card}
              target="_blank"
              rel="noreferrer"
            >
              <div className={styles.row}>
                <span className={styles.name}>{resource.title}</span>
                <span className={styles.type}>
                  {TYPE_LABELS[resource.type]}
                </span>
              </div>
              <span className={styles.note}>{resource.note}</span>
              <span className={styles.source}>{resource.source}</span>
            </a>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className={styles.empty}>Nothing matches those filters yet.</p>
      )}
    </div>
  );
}

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function FilterButton({ active, onClick, children }: FilterButtonProps) {
  return (
    <button
      type="button"
      className={styles.filter}
      data-active={active || undefined}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
