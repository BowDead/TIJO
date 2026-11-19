import { anonymizedLines } from "../utils/anonymizedLines";
import styles from "./CvAnonymizedText.module.scss";

const LINE_CLASS = {
  title: styles.lineTitle,
  heading: styles.lineHeading,
  item: styles.lineItem,
  text: styles.line,
};

function HiddenPiece({ piece, onToggle }) {
  return (
    <button
      type="button"
      className={piece.hidden ? styles.hidden : styles.revealed}
      title={piece.hidden ? piece.text : piece.label}
      aria-pressed={piece.hidden}
      onClick={() => onToggle(piece.index)}
    >
      {piece.hidden ? piece.label : piece.text}
    </button>
  );
}

export function AnonymizedTextLines({ segments, onToggle, onSelectionChange, containerRef }) {
  return (
    <div
      ref={containerRef}
      className={styles.text}
      data-testid="anonymized-text"
      onMouseUp={onSelectionChange}
      onKeyUp={onSelectionChange}
    >
      {anonymizedLines(segments).map((line) => {
        if (line.kind === "blank") {
          return <div key={line.start} className={styles.blank} />;
        }
        if (line.pieces.length === 0) return null;

        return (
          <div key={line.start} className={LINE_CLASS[line.kind]}>
            {line.pieces.map((piece) =>
              piece.label ? (
                <HiddenPiece key={piece.start} piece={piece} onToggle={onToggle} />
              ) : (
                <span key={piece.start} data-start={piece.start}>
                  {piece.text}
                </span>
              ),
            )}
          </div>
        );
      })}
    </div>
  );
}
