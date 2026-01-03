"use client";

import { motion } from "motion/react";
import { useState } from "react";

import styles from "./styles.module.css";

const easeInQuint = [0.755, 0.05, 0.855, 0.06] as const;
const easeOutQuint = [0.23, 1, 0.32, 1] as const;

const menuItems = [
  { id: 1, icon: "🏠", label: "Home" },
  { id: 2, icon: "📁", label: "Projects" },
  { id: 3, icon: "📊", label: "Analytics" },
  { id: 4, icon: "⚙️", label: "Settings" },
];

export function SidebarDemo() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <motion.aside
          className={styles.sidebar}
          initial={false}
          animate={{
            width: isOpen ? 200 : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{
            duration: 0.25,
            ease: isOpen ? easeOutQuint : easeInQuint,
          }}
        >
          <nav className={styles.nav}>
            {menuItems.map((item) => (
              <div key={item.id} className={styles.menuitem}>
                <span className={styles.menuicon}>{item.icon}</span>
                <span className={styles.menulabel}>{item.label}</span>
              </div>
            ))}
          </nav>
        </motion.aside>
        <main className={styles.main}>
          <div className={styles.content}>
            <div className={styles.placeholder} />
            <div className={styles.placeholder} data-size="short" />
            <div className={styles.placeholder} data-size="medium" />
          </div>
        </main>
      </div>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      </button>
      <p className={styles.hint}>
        {isOpen ? "Ease-out for opening" : "Ease-in for closing (exiting view)"}
      </p>
    </div>
  );
}
