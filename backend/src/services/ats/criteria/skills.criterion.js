import { roundedScore } from "./score-utils.js";

const MAX_SCORE = 20;
const POINTS_PER_SKILL = 2.5;
const RECOMMENDED_SKILLS = 8;

export const skillsCriterion = {
  id: "skills",
  maxScore: MAX_SCORE,
  evaluate({ skills }) {
    const count = skills.length;
    return {
      score: roundedScore(count * POINTS_PER_SKILL, MAX_SCORE),
      details: { count },
      tips: count < RECOMMENDED_SKILLS ? ["ADD_MORE_SKILLS"] : [],
    };
  },
};
