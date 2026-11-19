import { useTranslation } from "react-i18next";
import { TagList } from "@/shared/ui/TagList";
import styles from "./AtsScore.module.scss";

export function KeywordMatch({ match }) {
  const { t } = useTranslation();

  return (
    <div className={styles.block}>
      <h3 className={styles.subtitle}>{t("ats.match.title")}</h3>
      {match.score == null ? (
        <p className={styles.muted}>{t("ats.match.noKeywords")}</p>
      ) : (
        <div className={styles.matchGrid}>
          <div className={styles.block}>
            <p className={styles.muted}>{t("ats.match.matched")}</p>
            <TagList items={match.matched} tone="success" />
          </div>
          <div className={styles.block}>
            <p className={styles.muted}>{t("ats.match.missing")}</p>
            <TagList items={match.missing} tone="warning" />
          </div>
        </div>
      )}
    </div>
  );
}
