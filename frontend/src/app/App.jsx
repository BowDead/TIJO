import { useTranslation } from "react-i18next";
import { AppLayout } from "@/shared/layout/AppLayout";
import { PageHeader } from "@/shared/ui/PageHeader";
import { EmptyState } from "@/shared/ui/EmptyState";
import {
  CvAnonymizedText,
  CvPreview,
  CvUploadPanel,
  useAnonymizationReview,
  useCvUpload,
} from "@/features/cv-upload";
import {
  AtsScorePanel,
  JobDescriptionForm,
  useAtsScore,
} from "@/features/ats-score";
import styles from "./App.module.scss";

const STEPS = ["upload", "review", "match"];

export function App() {
  const { t } = useTranslation();
  const cv = useCvUpload();
  const cvResult = cv.status === "done" ? cv.result : null;
  const review = useAnonymizationReview(cvResult);
  const ats = useAtsScore(cvResult);

  return (
    <AppLayout
      brand={t("app.title")}
      sidebar={
        <>
          <section className={styles.block}>
            <h2 className={styles.label}>{t("app.yourCv")}</h2>
            <CvUploadPanel cv={cv} />
          </section>
          <JobDescriptionForm
            disabled={cv.status !== "done"}
            busy={ats.status === "loading"}
            onSubmit={ats.rescore}
          />
        </>
      }
    >
      <PageHeader title={t("app.title")} description={t("app.description")} />

      {cv.status === "done" && (
        <>
          <AtsScorePanel ats={ats} />
          <div className={styles.split}>
            <CvPreview
              kind={cv.result.kind}
              previewUrl={cv.previewUrl}
              text={cv.result.text}
              fileName={cv.file.name}
            />
            <CvAnonymizedText review={review} fileName={cv.file.name} />
          </div>
        </>
      )}

      {cv.status === "uploading" && (
        <EmptyState busy title={t("app.readingTitle")}>
          {cv.file.name}
        </EmptyState>
      )}

      {(cv.status === "idle" || cv.status === "error") && (
        <EmptyState title={t("app.emptyTitle")}>
          {t("app.emptyText")}
          <ol className={styles.steps}>
            {STEPS.map((step, index) => (
              <li key={step} className={styles.step}>
                <span className={styles.stepNumber}>{index + 1}</span>
                <span>
                  <strong>{t(`app.steps.${step}.title`)}</strong>
                  <span className={styles.stepText}>
                    {t(`app.steps.${step}.text`)}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </EmptyState>
      )}
    </AppLayout>
  );
}
