import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/ui/Button";
import { Tabs } from "@/shared/ui/Tabs";
import { downloadFile, markdownFileName } from "@/shared/utils/download";
import { anonymizedLines } from "../utils/anonymizedLines";
import { toMarkdown } from "../utils/cvMarkdown";
import styles from "./CvAnonymizedText.module.scss";

function hiddenSummary(counts, t) {
  return Object.entries(counts).map(([type, count]) => ({
    type,
    label: t(`cvUpload.anonymized.labels.${type}`, { defaultValue: type }),
    count,
  }));
}

function readSelection(container) {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const position = (node, offset) => {
    const element = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
    const span = element?.closest("[data-start]");
    if (!span || !container.contains(span)) return null;
    return Number(span.dataset.start) + offset;
  };

  const start = position(range.startContainer, range.startOffset);
  const end = position(range.endContainer, range.endOffset);
  return start !== null && end !== null && start < end ? { start, end } : null;
}

const LINE_CLASS = {
  title: styles.lineTitle,
  heading: styles.lineHeading,
  item: styles.lineItem,
  text: styles.line,
};

export function CvAnonymizedText({ review, fileName }) {
  const { t } = useTranslation();
  const textRef = useRef(null);
  const [selection, setSelection] = useState(null);
  const [view, setView] = useState("edit");
  const [copied, setCopied] = useState(false);
  const hidden = hiddenSummary(review.counts, t);
  const markdown = view === "source" ? toMarkdown(review.text) : null;

  function updateSelection() {
    setSelection(readSelection(textRef.current));
  }

  function hideSelection(everywhere) {
    if (everywhere) {
      review.hideEverywhere(selection.start, selection.end);
    } else {
      review.hide(selection.start, selection.end);
    }
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  }

  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(toMarkdown(review.text));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
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
          <Button variant="ghost" size="sm" onClick={copyMarkdown}>
            {copied ? t("cvUpload.copied") : t("cvUpload.copyMd")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              downloadFile(
                toMarkdown(review.text),
                markdownFileName(fileName, "-zanonimizowane"),
                "text/markdown",
              )
            }
          >
            {t("cvUpload.downloadMd")}
          </Button>
        </div>
      </div>

      {hidden.length > 0 ? (
        <ul className={styles.chips} aria-label={t("cvUpload.anonymized.hiddenLabel")}>
          {hidden.map(({ type, label, count }) => (
            <li key={type} className={styles.chip}>
              {label} <strong>{count}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.summary}>{t("cvUpload.anonymized.noneFound")}</p>
      )}

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
            <Button
              size="sm"
              disabled={!selection}
              onClick={() => hideSelection(false)}
            >
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
          <div
            ref={textRef}
            className={styles.text}
            data-testid="anonymized-text"
            onMouseUp={updateSelection}
            onKeyUp={updateSelection}
          >
            {anonymizedLines(review.segments).map((line) =>
              line.kind === "blank" ? (
                <div key={line.start} className={styles.blank} />
              ) : (
                line.pieces.length > 0 && (
                  <div key={line.start} className={LINE_CLASS[line.kind]}>
                    {line.pieces.map((piece) =>
                      piece.label ? (
                        <button
                          key={piece.start}
                          type="button"
                          className={
                            piece.hidden ? styles.hidden : styles.revealed
                          }
                          title={piece.hidden ? piece.text : piece.label}
                          aria-pressed={piece.hidden}
                          onClick={() => review.toggle(piece.index)}
                        >
                          {piece.hidden ? piece.label : piece.text}
                        </button>
                      ) : (
                        <span key={piece.start} data-start={piece.start}>
                          {piece.text}
                        </span>
                      ),
                    )}
                  </div>
                )
              ),
            )}
          </div>
        </>
      ) : (
        <pre className={styles.source} data-testid="anonymized-markdown">
          {markdown}
        </pre>
      )}
    </section>
  );
}
