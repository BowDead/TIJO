import styles from "./AtsScore.module.scss";

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScoreRing({ score, rating }) {
  const boundedScore = Math.min(Math.max(score, 0), 100);
  const offset = CIRCUMFERENCE * (1 - boundedScore / 100);

  return (
    <div className={`${styles.ring} ${styles[rating]}`}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle className={styles.ringTrack} cx="50" cy="50" r={RADIUS} />
        <circle
          className={styles.ringValue}
          cx="50"
          cy="50"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <div className={styles.ringLabel}>
        <p>
          <strong data-testid="ats-score">{score}</strong>
          <span>/100</span>
        </p>
      </div>
    </div>
  );
}
