import { useTranslation } from "react-i18next";
import styles from "./CvAnonymizedText.module.scss";

export function HiddenDataSummary({ counts }) {
  const { t } = useTranslation();
  const entries = Object.entries(counts);

  if (entries.length === 0) {
    return <p className={styles.summary}>{t("cvUpload.anonymized.noneFound")}</p>;
  }

  return (
    <ul className={styles.chips} aria-label={t("cvUpload.anonymized.hiddenLabel")}>
      {entries.map(([type, count]) => (
        <li key={type} className={styles.chip}>
          {t(`cvUpload.anonymized.labels.${type}`, { defaultValue: type })}{" "}
          <strong>{count}</strong>
        </li>
      ))}
    </ul>
  );
}
