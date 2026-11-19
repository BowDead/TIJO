import { useTranslation } from "react-i18next";
import { TagList } from "@/shared/ui/TagList";
import { errorMessage } from "@/shared/i18n/errorMessage";
import { CriterionRow } from "./CriterionRow";
import { KeywordMatch } from "./KeywordMatch";
import { ScoreRing } from "./ScoreRing";
import styles from "./AtsScore.module.scss";

function ScoreSummary({ data }) {
  const { t } = useTranslation();
  const match = data.keywordMatch;

  return (
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
  );
}

function Tips({ tips }) {
  const { t } = useTranslation();
  if (tips.length === 0) return null;

  return (
    <div className={styles.tipsBox}>
      <h3 className={styles.subtitle}>{t("ats.tipsTitle")}</h3>
      <ul className={styles.tips}>
        {tips.map((tip) => (
          <li key={tip}>{t(`ats.tips.${tip}`)}</li>
        ))}
      </ul>
    </div>
  );
}

export function AtsScorePanel({ ats }) {
  const { t } = useTranslation();
  const { data, status, error } = ats;
  const errorText = status === "error" && (
    <p className={styles.error}>{errorMessage(error)}</p>
  );

  if (!data) {
    if (status === "idle") return null;
    return (
      <section className={styles.card} aria-busy={status === "loading"}>
        {errorText || <p className={styles.muted}>{t("ats.loading")}</p>}
      </section>
    );
  }

  return (
    <section className={styles.card} aria-busy={status === "loading"}>
      <ScoreSummary data={data} />
      {errorText}
      <Tips tips={data.criteria.flatMap((criterion) => criterion.tips)} />
      {data.keywordMatch && <KeywordMatch match={data.keywordMatch} />}

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
