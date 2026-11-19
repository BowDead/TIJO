import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/ui/Button";
import { Tabs } from "@/shared/ui/Tabs";
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard";
import { downloadFile, markdownFileName } from "@/shared/utils/download";
import { toMarkdown } from "../utils/cvMarkdown";
import { readTextSelection } from "../utils/textSelection";
import { AnonymizedTextLines } from "./AnonymizedTextLines";
import { HiddenDataSummary } from "./HiddenDataSummary";
import styles from "./CvAnonymizedText.module.scss";

export function CvAnonymizedText({ review, fileName }) {
  const { t } = useTranslation();
  const textRef = useRef(null);
  const [selection, setSelection] = useState(null);
  const [view, setView] = useState("edit");
  const { copied, copy } = useCopyToClipboard();
  const markdown = useMemo(() => toMarkdown(review.text), [review.text]);

  function updateSelection() {
    setSelection(readTextSelection(textRef.current));
  }

  function hideSelection(everywhere) {
    const hide = everywhere ? review.hideEverywhere : review.hide;
    hide(selection.start, selection.end);
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  }

  function downloadMarkdown() {
    downloadFile(
      markdown,
      markdownFileName(fileName, t("cvUpload.anonymized.fileSuffix")),
      "text/markdown",
    );
  }

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t("cvUpload.anonymized.title")}</h3>
        <div className={styles.toolbar}>
          {review.edited && (
            <Button variant="ghost" size="sm" onClick={review.restore}>
              {t("cvUpload.anonymized.restore")}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => copy(markdown)}>
            {copied ? t("cvUpload.copied") : t("cvUpload.copyMd")}
          </Button>
          <Button variant="ghost" size="sm" onClick={downloadMarkdown}>
            {t("cvUpload.downloadMd")}
          </Button>
        </div>
      </div>

      <HiddenDataSummary counts={review.counts} />

      <div className={styles.controls}>
        <Tabs
          tabs={[
            { id: "edit", label: t("cvUpload.anonymized.viewEdit") },
            { id: "source", label: t("cvUpload.preview.source") },
          ]}
          value={view}
          onChange={setView}
          label={t("cvUpload.anonymized.title")}
        />
        {view === "edit" && (
          <div className={styles.toolbar}>
            <Button size="sm" disabled={!selection} onClick={() => hideSelection(false)}>
              {t("cvUpload.anonymized.hideSelection")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!selection}
              onClick={() => hideSelection(true)}
            >
              {t("cvUpload.anonymized.hideEverywhere")}
            </Button>
          </div>
        )}
      </div>

      {view === "edit" ? (
        <>
          <p className={styles.description}>
            {t("cvUpload.anonymized.description")}
          </p>
          <AnonymizedTextLines
            containerRef={textRef}
            segments={review.segments}
            onToggle={review.toggle}
            onSelectionChange={updateSelection}
          />
        </>
      ) : (
        <pre className={styles.source} data-testid="anonymized-markdown">
          {markdown}
        </pre>
      )}
    </section>
  );
}
