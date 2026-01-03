"use client";

import { motion } from "motion/react";
import { useState } from "react";

import styles from "./styles.module.css";

const easeInOutQuad = [0.455, 0.03, 0.515, 0.955] as const;

const tabs = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "search", label: "Search", icon: "🔍" },
  { id: "create", label: "Create", icon: "➕" },
  { id: "profile", label: "Profile", icon: "👤" },
];

export function TabSwitcher() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className={styles.container}>
      <div className={styles.phone}>
        <div className={styles.screen}>
          <div className={styles.content}>
            {tabs.map((tab) => (
              <motion.div
                key={tab.id}
                className={styles.page}
                initial={false}
                animate={{
                  opacity: activeTab === tab.id ? 1 : 0,
                  scale: activeTab === tab.id ? 1 : 0.95,
                }}
                transition={{
                  duration: 0.2,
                  ease: easeInOutQuad,
                }}
                data-active={activeTab === tab.id}
              >
                <span className={styles.pageicon}>{tab.icon}</span>
                <span className={styles.pagelabel}>{tab.label}</span>
              </motion.div>
            ))}
          </div>
          <nav className={styles.tabbar}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={styles.tab}
                data-active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className={styles.tabicon}>{tab.icon}</span>
                <span className={styles.tablabel}>{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-indicator"
                    className={styles.indicator}
                    transition={{
                      duration: 0.25,
                      ease: easeInOutQuad,
                    }}
                  />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>
      <p className={styles.hint}>Ease-in-out for smooth tab transitions</p>
    </div>
  );
}
