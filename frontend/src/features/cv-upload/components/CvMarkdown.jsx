import { toBlocks } from "../utils/cvMarkdown";
import styles from "./CvMarkdown.module.scss";

export function CvMarkdown({ text }) {
  return (
    <article className={styles.markdown} data-testid="cv-markdown">
      {toBlocks(text).map((block, index) => {
        if (block.kind === "title") {
          return (
            <h1 key={index} className={styles.title}>
              {block.lines[0]}
            </h1>
          );
        }
        if (block.kind === "heading") {
          return (
            <h2 key={index} className={styles.heading}>
              {block.lines[0]}
            </h2>
          );
        }
        if (block.kind === "list") {
          return (
            <ul key={index} className={styles.list}>
              {block.lines.map((line, lineIndex) => (
                <li key={lineIndex} className={styles.item}>
                  {line}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index} className={styles.paragraph}>
            {block.lines.map((line, lineIndex) => (
              <span key={lineIndex}>
                {lineIndex > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
        );
      })}
    </article>
  );
}
