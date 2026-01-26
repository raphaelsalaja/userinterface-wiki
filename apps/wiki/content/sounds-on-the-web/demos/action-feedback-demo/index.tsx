"use client";

import { Toast } from "@base-ui/react/toast";
import { Button } from "@/components/button";
import { Controls } from "@/components/controls";
import { sounds } from "@/lib/sounds";
import styles from "./styles.module.css";

type ActionType = "success" | "error" | "warning";

export function ActionFeedbackDemo() {
  const { toasts, add } = Toast.useToastManager();

  const handleAction = (type: ActionType) => {
    sounds[type]();

    const messages: Record<ActionType, string> = {
      success: "Payment processed successfully",
      error: "Card declined. Please try again.",
      warning: "Your session will expire soon",
    };

    add({
      type,
      description: messages[type],
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.area}>
        <Toast.Viewport className={styles.viewport}>
          {toasts.map((toast) => (
            <Toast.Root
              key={toast.id}
              toast={toast}
              className={styles.toast}
              data-type={toast.type}
            >
              <Toast.Content className={styles.content} data-type={toast.type}>
                <Toast.Description className={styles.message} />
              </Toast.Content>
            </Toast.Root>
          ))}
        </Toast.Viewport>
      </div>
      <Controls className={styles.actions}>
        <Button onClick={() => handleAction("success")}>Success</Button>
        <Button onClick={() => handleAction("error")}>Error</Button>
        <Button onClick={() => handleAction("warning")}>Warning</Button>
      </Controls>
    </div>
  );
}
