"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/button";
import { Controls } from "@/components/controls";
import styles from "./styles.module.css";

let nextId = 4;

export function ListDemo() {
  const [items, setItems] = useState([
    { id: 1, label: "Item 1" },
    { id: 2, label: "Item 2" },
    { id: 3, label: "Item 3" },
  ]);

  const addItem = () => {
    const id = nextId++;
    setItems((prev) => [...prev, { id, label: `Item ${id}` }]);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className={styles.root}>
      <ul className={styles.list}>
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.li
              key={item.id}
              className={styles.item}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
              layout
              onClick={() => removeItem(item.id)}
            >
              {item.label}
              <span className={styles.remove}>×</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <Controls>
        <Button onClick={addItem}>Add Item</Button>
      </Controls>
    </div>
  );
}
