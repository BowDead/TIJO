import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/ui/Button";
import styles from "./AtsScore.module.scss";

export function JobDescriptionForm({ disabled, busy, onSubmit }) {
  const { t } = useTranslation();
  const [text, setText] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(text);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.formLabel} htmlFor="job-description">
        {t("ats.jobDescription.label")}
      </label>
      <textarea
        id="job-description"
        className={styles.textarea}
        rows={7}
        value={text}
        placeholder={t("ats.jobDescription.placeholder")}
        onChange={(event) => setText(event.target.value)}
      />
      <div className={styles.formFooter}>
        <span className={styles.counter}>
          {t("ats.jobDescription.characters", { count: text.length })}
        </span>
        <Button type="submit" size="sm" disabled={disabled || busy}>
          {busy ? t("ats.jobDescription.scoring") : t("ats.jobDescription.submit")}
        </Button>
      </div>
      {disabled && <p className={styles.hint}>{t("ats.jobDescription.needCv")}</p>}
    </form>
  );
}
