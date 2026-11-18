import { useTranslation } from "react-i18next";
import { TagList } from "@/shared/ui/TagList";
import { errorMessage } from "@/shared/i18n/errorMessage";
import styles from "./AtsScore.module.scss";

function describe(criterion, t) {
  const { id, details } = criterion;
  if (id === "contact" || id === "sections") {
    const names = (list) =>
      list.map((item) => t(`ats.items.${item}`)).join(", ") || "—";
    return t("ats.details.found", {
      found: names(details.found),
      missing: names(details.missing),
    });
  }
  if (id === "actionVerbs") {
    return t("ats.details.actionVerbs", {
      count: details.count,
      examples: details.examples.join(", ") || "—",
    });
  }
  return t(`ats.details.${id}`, details);
}

function level(percent) {
  if (percent >= 75) return "high";
  if (percent >= 45) return "medium";
  return "low";
}

function ScoreRing({ score, rating }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(score, 0), 100) / 100);

  return (
    <div className={`${styles.ring} ${styles[rating]}`}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle className={styles.ringTrack} cx="50" cy="50" r={radius} />
        <circle
          className={styles.ringValue}
          cx="50"
          cy="50"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className={styles.ringLabel}>
        <p>
          <strong data-testid="ats-score">{score}</strong>
          <span>/100</span>
        </p>
      </div>
    </div>
  );
}

function CriterionRow({ criterion }) {
  const { t } = useTranslation();
  const percent = Math.round((criterion.score / criterion.maxScore) * 100);

  return (
    <li className={`${styles.criterion} ${styles[level(percent)]}`}>
      <div className={styles.criterionHeader}>
        <span>{t(`ats.criteria.${criterion.id}`)}</span>
        <span className={styles.points}>
          {criterion.score}/{criterion.maxScore}
        </span>
      </div>
      <div className={styles.bar} aria-hidden="true">
        <span style={{ width: `${percent}%` }} />
      </div>
      <p className={styles.details}>{describe(criterion, t)}</p>
    </li>
  );
}

export function AtsScorePanel({ ats }) {
  const { t } = useTranslation();
  const { data, status, error } = ats;

  if (!data) return null;
  const match = data.keywordMatch;
  const tips = data.criteria.flatMap((criterion) => criterion.tips);

  return (
    <section className={styles.card} aria-busy={status === "loading"}>
      <div className={styles.summary}>
        <ScoreRing score={data.score} rating={data.rating} />
        <div className={styles.summaryText}>
          <p className={styles.eyebrow}>{t("ats.title")}</p>
          <h2 className={styles.title}>{t(`ats.rating.${data.rating}`)}</h2>
          <p className={styles.muted}>
            {match?.score != null
              ? t("ats.scoreWithMatch", {
                  general: data.generalScore,
                  match: match.score,
                })
              : t("ats.scoreGeneral")}
          </p>
        </div>
      </div>

      {status === "error" && (
        <p className={styles.error}>{errorMessage(error)}</p>
      )}

      {tips.length > 0 && (
        <div className={styles.tipsBox}>
          <h3 className={styles.subtitle}>{t("ats.tipsTitle")}</h3>
          <ul className={styles.tips}>
            {tips.map((tip) => (
              <li key={tip}>{t(`ats.tips.${tip}`)}</li>
            ))}
          </ul>
        </div>
      )}

      {match && (
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
                <TagList items={match.missing} tone="primary" />
              </div>
            </div>
          )}
        </div>
      )}

      <div className={styles.block}>
        <h3 className={styles.subtitle}>{t("ats.criteriaTitle")}</h3>
        <ul className={styles.criteria}>
          {data.criteria.map((criterion) => (
            <CriterionRow key={criterion.id} criterion={criterion} />
          ))}
        </ul>
      </div>

      <div className={styles.block}>
        <h3 className={styles.subtitle}>{t("ats.skillsTitle")}</h3>
        {data.skills.length ? (
          <TagList items={data.skills.map((skill) => skill.name)} />
        ) : (
          <p className={styles.muted}>{t("ats.noSkills")}</p>
        )}
      </div>
    </section>
  );
}
