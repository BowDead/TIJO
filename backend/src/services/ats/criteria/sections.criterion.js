import { SECTIONS } from "../ats-rules.js";

const EXPERIENCE_POINTS = 8;
const PROJECTS_INSTEAD_OF_EXPERIENCE_POINTS = 4;

const OPTIONAL_SECTIONS = [
  { id: "education", points: 6, tip: "ADD_EDUCATION_SECTION" },
  { id: "skills", points: 6, tip: "ADD_SKILLS_SECTION" },
  { id: "summary", points: 3, tip: "ADD_SUMMARY_SECTION" },
  { id: "languages", points: 2, tip: "ADD_LANGUAGES_SECTION" },
];

const ALL_SECTION_IDS = SECTIONS.map((section) => section.id);

function experienceScore(sections) {
  if (sections.has("experience")) return EXPERIENCE_POINTS;
  if (sections.has("projects")) return PROJECTS_INSTEAD_OF_EXPERIENCE_POINTS;
  return 0;
}

export const sectionsCriterion = {
  id: "sections",
  maxScore: 25,
  evaluate({ sections }) {
    const tips = sections.has("experience") ? [] : ["ADD_EXPERIENCE_SECTION"];
    let score = experienceScore(sections);

    for (const { id, points, tip } of OPTIONAL_SECTIONS) {
      if (sections.has(id)) score += points;
      else tips.push(tip);
    }

    return {
      score,
      details: {
        found: ALL_SECTION_IDS.filter((id) => sections.has(id)),
        missing: ALL_SECTION_IDS.filter((id) => !sections.has(id)),
      },
      tips,
    };
  },
};
