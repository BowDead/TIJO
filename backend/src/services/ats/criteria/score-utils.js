// Zaokrągla wynik i ogranicza go do przedziału 0..maxScore
export function roundedScore(value, maxScore) {
  return Math.max(0, Math.min(maxScore, Math.round(value)));
}

export function scoreFromThresholds(value, thresholds) {
  return thresholds.find(({ min }) => value >= min)?.points ?? 0;
}
