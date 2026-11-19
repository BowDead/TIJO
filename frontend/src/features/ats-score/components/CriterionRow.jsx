import { useTranslation } from "react-i18next";
import {
  criterionDetails,
  scoreLevel,
  scorePercent,
} from "../utils/criterionPresentation";
import styles from "./AtsScore.module.scss";

export function CriterionRow({ criterion }) {
  const { t } = useTranslation();
  const percent = scorePercent(criterion.score, criterion.maxScore);

  return (
    <li className={`${styles.criterion} ${styles[scoreLevel(percent)]}`}>
      <div className={styles.criterionHeader}>
        <span>{t(`ats.criteria.${criterion.id}`)}</span>
        <span className={styles.points}>
          {criterion.score}/{criterion.maxScore}
        </span>
      </div>
      <div className={styles.bar} aria-hidden="true">
        <span style={{ width: `${percent}%` }} />
      </div>
      <p className={styles.details}>{criterionDetails(criterion, t)}</p>
    </li>
  );
}
