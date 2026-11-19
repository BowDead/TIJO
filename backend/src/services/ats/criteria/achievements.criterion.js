import { nonEmptyLines } from "../../../utils/text.js";
import { DATE_RANGE_RE, DATE_RE } from "../ats-rules.js";
import { roundedScore } from "./score-utils.js";

const MAX_SCORE = 10;
const RECOMMENDED_QUANTIFIED_LINES = 3;

// "B2" czy "ES6" to nie liczby — liczymy tylko samodzielne liczby
const STANDALONE_NUMBER_RE = /(?<![\p{L}\d])\d/u;

// Liczby, które nie są datami ani danymi kontaktowymi (te są już zastąpione etykietami)
export function countQuantifiedLines(anonymizedText) {
  return nonEmptyLines(anonymizedText).filter((line) => {
    const withoutDates = line.replace(DATE_RANGE_RE, "").replace(DATE_RE, "");
    return STANDALONE_NUMBER_RE.test(withoutDates);
  }).length;
}

export const achievementsCriterion = {
  id: "achievements",
  maxScore: MAX_SCORE,
  evaluate({ anonymizedText }) {
    const count = countQuantifiedLines(anonymizedText);
    return {
      score: roundedScore(
        (count * MAX_SCORE) / RECOMMENDED_QUANTIFIED_LINES,
        MAX_SCORE,
      ),
      details: { count },
      tips: count < RECOMMENDED_QUANTIFIED_LINES ? ["ADD_NUMBERS"] : [],
    };
  },
};
