import styles from "./Tabs.module.scss";

export function Tabs({ tabs, value, onChange, label }) {
  function handleKeyDown(event) {
    const index = tabs.findIndex((tab) => tab.id === value);
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = tabs[(index + step + tabs.length) % tabs.length];
    onChange(next.id);
    event.currentTarget
      .querySelector(`[data-tab="${next.id}"]`)
      ?.focus();
  }

  return (
    <div
      className={styles.tabs}
      role="tablist"
      aria-label={label}
      onKeyDown={handleKeyDown}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          data-tab={tab.id}
          aria-selected={tab.id === value}
          tabIndex={tab.id === value ? 0 : -1}
          className={styles.tab}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
