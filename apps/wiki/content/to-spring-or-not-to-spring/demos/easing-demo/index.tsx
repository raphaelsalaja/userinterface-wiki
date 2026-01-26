"use client";

import { Tabs } from "@base-ui/react/tabs";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

const tabs = [
  { id: "world", label: "Animation" },
  { id: "business", label: "Business" },
  { id: "arts", label: "Arts" },
  { id: "science", label: "Science" },
];

export function EasingDemo() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayTabRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const overlay = overlayRef.current;
    const indicator = indicatorRef.current;
    const activeTabElement = tabRefs.current.get(activeTab);

    if (!wrapper || !overlay || !indicator || !activeTabElement) return;

    for (const [id, tabEl] of tabRefs.current) {
      const overlayTabEl = overlayTabRefs.current.get(id);
      if (overlayTabEl) {
        const width = tabEl.getBoundingClientRect().width;
        overlayTabEl.style.width = `${width}px`;
      }
    }

    const wrapperRect = wrapper.getBoundingClientRect();
    const tabRect = activeTabElement.getBoundingClientRect();
    const left = tabRect.left - wrapperRect.left;
    const right = wrapperRect.right - tabRect.right;

    overlay.style.clipPath = `inset(0 ${right}px 0 ${left}px round 100px)`;
    indicator.style.left = `${left}px`;
    indicator.style.width = `${tabRect.width}px`;
  }, [activeTab]);

  return (
    <div className={styles.root}>
      <Tabs.Root
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as string)}
      >
        <div ref={wrapperRef} className={styles.wrapper}>
          <Tabs.List className={styles.list}>
            {tabs.map((tab) => (
              <Tabs.Tab
                key={tab.id}
                ref={(el) => {
                  if (el) tabRefs.current.set(tab.id, el as HTMLButtonElement);
                  else tabRefs.current.delete(tab.id);
                }}
                value={tab.id}
                className={styles.tab}
              >
                {tab.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <div
            ref={indicatorRef}
            className={styles.indicator}
            aria-hidden="true"
          />
          <div ref={overlayRef} className={styles.overlay} aria-hidden="true">
            {tabs.map((tab) => (
              <span
                key={tab.id}
                ref={(el) => {
                  if (el) overlayTabRefs.current.set(tab.id, el);
                  else overlayTabRefs.current.delete(tab.id);
                }}
                className={styles.tab}
              >
                {tab.label}
              </span>
            ))}
          </div>
        </div>
      </Tabs.Root>
    </div>
  );
}
