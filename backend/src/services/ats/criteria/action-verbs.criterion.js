import { findActionVerbs } from "../action-verbs.js";
import { roundedScore } from "./score-utils.js";

const MAX_SCORE = 10;
const POINTS_PER_VERB = 2;
const RECOMMENDED_VERBS = 5;
const MAX_EXAMPLES = 8;

export const actionVerbsCriterion = {
  id: "actionVerbs",
  maxScore: MAX_SCORE,
  evaluate({ text }) {
    const verbs = findActionVerbs(text);
    return {
      score: roundedScore(verbs.length * POINTS_PER_VERB, MAX_SCORE),
      details: { count: verbs.length, examples: verbs.slice(0, MAX_EXAMPLES) },
      tips: verbs.length < RECOMMENDED_VERBS ? ["USE_ACTION_VERBS"] : [],
    };
  },
};
