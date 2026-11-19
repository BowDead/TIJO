import { nonEmptyLines } from "../../../utils/text.js";
import { BULLET_RE, DATE_RANGE_RE } from "../ats-rules.js";
import { scoreFromThresholds } from "./score-utils.js";

const LONG_LINE_CHARS = 250;

const BULLET_THRESHOLDS = [
  { min: 3, points: 4 },
  { min: 1, points: 2 },
];
const DATE_RANGE_THRESHOLDS = [
  { min: 2, points: 3 },
  { min: 1, points: 1 },
];

function longLinesScore(longLines) {
  if (longLines === 0) return 3;
  if (longLines <= 2) return 1;
  return 0;
}

export const structureCriterion = {
  id: "structure",
  maxScore: 10,
  evaluate({ text }) {
    const lines = nonEmptyLines(text);
    const bullets = lines.filter((line) => BULLET_RE.test(line)).length;
    const dateRanges = [...text.matchAll(DATE_RANGE_RE)].length;
    const longLines = lines.filter((line) => line.length > LONG_LINE_CHARS).length;

    const tips = [];
    if (bullets < 3) tips.push("USE_BULLETS");
    if (dateRanges < 2) tips.push("ADD_DATES");
    if (longLines > 0) tips.push("SPLIT_LONG_PARAGRAPHS");

    return {
      score:
        scoreFromThresholds(bullets, BULLET_THRESHOLDS) +
        scoreFromThresholds(dateRanges, DATE_RANGE_THRESHOLDS) +
        longLinesScore(longLines),
      details: { bullets, dateRanges, longLines },
      tips,
    };
  },
};
