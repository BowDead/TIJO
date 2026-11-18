import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/ui/Button";
import { Tabs } from "@/shared/ui/Tabs";
import { downloadFile, markdownFileName } from "@/shared/utils/download";
import { toMarkdown } from "../utils/cvMarkdown";
import { CvMarkdown } from "./CvMarkdown";
import styles from "./CvPreview.module.scss";

export function CvPreview({ kind, previewUrl, text, fileName }) {
  const { t } = useTranslation();
  const [view, setView] = useState("markdown");
  const markdown = toMarkdown(text);

  const tabs = [
    { id: "markdown", label: t("cvUpload.preview.markdown") },
    { id: "source", label: t("cvUpload.preview.source") },
    ...(kind === "pdf"
      ? [{ id: "original", label: t("cvUpload.preview.original") }]
      : []),
  ];

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t("cvUpload.preview.title")}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            downloadFile(markdown, markdownFileName(fileName), "text/markdown")
          }
        >
          {t("cvUpload.downloadMd")}
        </Button>
      </div>

      <Tabs
        tabs={tabs}
        value={view}
        onChange={setView}
        label={t("cvUpload.preview.title")}
      />

      <div className={styles.body} role="tabpanel">
        {view === "markdown" && <CvMarkdown text={text} />}
        {view === "source" && (
          <pre className={styles.source} data-testid="cv-markdown-source">
            {markdown}
          </pre>
        )}
        {view === "original" && (
          <iframe
            className={styles.pdf}
            src={previewUrl}
            title={t("cvUpload.previewTitle", { fileName })}
          />
        )}
      </div>
    </section>
  );
}
