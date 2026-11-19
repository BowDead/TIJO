import { contactCriterion } from "./contact.criterion.js";
import { sectionsCriterion } from "./sections.criterion.js";
import { lengthCriterion } from "./length.criterion.js";
import { skillsCriterion } from "./skills.criterion.js";
import { achievementsCriterion } from "./achievements.criterion.js";
import { actionVerbsCriterion } from "./action-verbs.criterion.js";
import { structureCriterion } from "./structure.criterion.js";

// Rejestr kryteriów (wzorzec Strategy): nowe kryterium wystarczy dopisać tutaj.
// Każde ma { id, maxScore, evaluate(context) => { score, details, tips } }.
export const ATS_CRITERIA = [
  contactCriterion,
  sectionsCriterion,
  lengthCriterion,
  skillsCriterion,
  achievementsCriterion,
  actionVerbsCriterion,
  structureCriterion,
];
