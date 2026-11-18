import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ACCEPT_ATTRIBUTE, MAX_FILE_SIZE_MB } from "../constants";
import styles from "./CvDropzone.module.scss";

export function CvDropzone({ onFileSelected, disabled = false }) {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  function selectFirstFile(fileList) {
    const file = fileList?.[0];
    if (file) {
      onFileSelected(file);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    if (!disabled) {
      selectFirstFile(event.dataTransfer.files);
    }
  }

  function handleInputChange(event) {
    selectFirstFile(event.target.files);
    event.target.value = "";
  }

  const className = [
    styles.dropzone,
    isDragging && styles.dragging,
    disabled && styles.disabled,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
    <input
      ref={inputRef}
      type="file"
      accept={ACCEPT_ATTRIBUTE}
      onChange={handleInputChange}
      data-testid="cv-file-input"
      hidden
    />
    <button
      type="button"
      className={className}
      aria-disabled={disabled}
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <svg
        className={styles.icon}
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 16V4" />
        <path d="m7 9 5-5 5 5" />
        <path d="M5 16v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" />
      </svg>
      <span className={styles.title}>{t("cvUpload.dropTitle")}</span>
      <span className={styles.hint}>
        {t("cvUpload.dropHint", { maxMb: MAX_FILE_SIZE_MB })}
      </span>
      <span className={styles.cta}>{t("cvUpload.chooseFile")}</span>
    </button>
    </>
  );
}
