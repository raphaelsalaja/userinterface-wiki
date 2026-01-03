"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useState } from "react";
import styles from "./styles.module.css";

interface Notification {
  id: number;
  title: string;
  body: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, title: "New message", body: "Hey, are you free for a call?" },
  { id: 2, title: "Reminder", body: "Team standup in 10 minutes" },
  { id: 3, title: "Update available", body: "Version 2.0 is ready to install" },
];

function NotificationCard({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: (id: number) => void;
}) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
  const rotate = useTransform(x, [-150, 0, 150], [-8, 0, 8]);

  const handleDragEnd = () => {
    const xValue = x.get();
    if (Math.abs(xValue) > 100) {
      animate(x, xValue > 0 ? 300 : -300, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      });
      setTimeout(() => onDismiss(notification.id), 200);
    } else {
      animate(x, 0, {
        type: "spring",
        stiffness: 500,
        damping: 30,
      });
    }
  };

  return (
    <motion.div
      className={styles.notification}
      style={{ x, opacity, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: "grabbing" }}
      layout
      transition={{
        layout: {
          type: "spring",
          stiffness: 400,
          damping: 30,
        },
      }}
    >
      <div className={styles.icon}>📬</div>
      <div className={styles.content}>
        <span className={styles.title}>{notification.title}</span>
        <span className={styles.body}>{notification.body}</span>
      </div>
    </motion.div>
  );
}

export function SwipeToDismiss() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const handleDismiss = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleReset = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onDismiss={handleDismiss}
            />
          ))
        ) : (
          <motion.div
            className={styles.empty}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <span className={styles.emptyicon}>✓</span>
            <span className={styles.emptylabel}>All caught up!</span>
          </motion.div>
        )}
      </div>
      {notifications.length < INITIAL_NOTIFICATIONS.length && (
        <motion.button
          className={styles.reset}
          onClick={handleReset}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Reset
        </motion.button>
      )}
      <p className={styles.hint}>Swipe left or right to dismiss</p>
    </div>
  );
}
