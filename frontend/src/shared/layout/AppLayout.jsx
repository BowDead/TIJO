import styles from "./AppLayout.module.scss";

export function AppLayout({ brand, sidebar, children }) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.logo} aria-hidden="true">
            CV
          </span>
          {brand}
        </div>

        {sidebar}
      </aside>

      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
