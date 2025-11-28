import styles from "./styles.module.css";

export const Article = ({ children }: { children: React.ReactNode }) => {
  return <article className={styles.article}>{children}</article>;
};
