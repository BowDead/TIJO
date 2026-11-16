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

function CriterionRow({ criterion }) {
  const { t } = useTranslation();
  const percent = Math.round((criterion.score / criterion.maxScore) * 100);

  return (
    <li className={styles.criterion}>
      <div className={styles.criterionHeader}>
        <span className={styles.criterionName}>
          {t(`ats.criteria.${criterion.id}`)}
        </span>
        <span className={styles.points}>
          {criterion.score}/{criterion.maxScore}
        </span>
      </div>
      <div className={styles.bar} aria-hidden="true">
        <span style={{ width: `${percent}%` }} />
      </div>
      <p className={styles.details}>{describe(criterion, t)}</p>
      {criterion.tips.length > 0 && (
        <ul className={styles.tips}>
          {criterion.tips.map((tip) => (
            <li key={tip}>{t(`ats.tips.${tip}`)}</li>
          ))}
        </ul>
      )}
    </li>
  );
}

export function AtsScorePanel({ ats }) {
  const { t } = useTranslation();
  const { data, status, error } = ats;

  if (!data) return null;
  const match = data.keywordMatch;

  return (
    <section className={styles.card} aria-busy={status === "loading"}>
      <div className={styles.summary}>
        <div className={`${styles.score} ${styles[data.rating]}`}>
          <strong data-testid="ats-score">{data.score}</strong>
          <span>/100</span>
        </div>
        <div>
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

      {match && (
        <div className={styles.block}>
          <h3 className={styles.subtitle}>{t("ats.match.title")}</h3>
          {match.score == null ? (
            <p className={styles.muted}>{t("ats.match.noKeywords")}</p>
          ) : (
            <>
              <p className={styles.muted}>{t("ats.match.matched")}</p>
              <TagList items={match.matched} tone="success" />
              <p className={styles.muted}>{t("ats.match.missing")}</p>
              <TagList items={match.missing} tone="primary" />
            </>
          )}
        </div>
      )}

      <ul className={styles.criteria}>
        {data.criteria.map((criterion) => (
          <CriterionRow key={criterion.id} criterion={criterion} />
        ))}
      </ul>

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
