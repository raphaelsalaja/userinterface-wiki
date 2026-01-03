"use client";

import { Toast } from "@base-ui/react/toast";

import styles from "./styles.module.css";

const toastTypes = [
  { icon: "✓", title: "Changes saved", type: "success" },
  { icon: "📧", title: "Message sent", type: "info" },
  { icon: "⚡", title: "Action completed", type: "info" },
];

function ToastList() {
  const { toasts } = Toast.useToastManager();

  return (
    <Toast.Portal>
      <Toast.Viewport className={styles.viewport}>
        {toasts.map((toast) => (
          <Toast.Root key={toast.id} toast={toast} className={styles.toast}>
            <Toast.Content className={styles.content}>
              <span className={styles.icon} data-type={toast.type}>
                {toast.data?.icon}
              </span>
              <Toast.Title className={styles.title} />
              <Toast.Close className={styles.close}>×</Toast.Close>
            </Toast.Content>
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

function ToastTrigger() {
  const toastManager = Toast.useToastManager();

  const showToast = () => {
    const randomToast =
      toastTypes[Math.floor(Math.random() * toastTypes.length)];
    toastManager.add({
      title: randomToast.title,
      type: randomToast.type,
      data: { icon: randomToast.icon },
      timeout: 3000,
    });
  };

  return (
    <button type="button" className={styles.trigger} onClick={showToast}>
      Show Toast
    </button>
  );
}

export function ToastDemo() {
  return (
    <div className={styles.container}>
      <Toast.Provider timeout={3000}>
        <ToastList />
        <ToastTrigger />
      </Toast.Provider>
      <p className={styles.hint}>Ease-out for responsive entry</p>
    </div>
  );
}
