import styles from "./EmptyState.module.scss";

export function EmptyState({ title, children, busy = false }) {
  return (
    <div
      className={styles.empty}
      role="status"
      aria-busy={busy || undefined}
    >
      {busy && <span className={styles.progress} aria-hidden="true" />}
      <h2 className={styles.title}>{title}</h2>
      {children && <div className={styles.text}>{children}</div>}
    </div>
  );
}
