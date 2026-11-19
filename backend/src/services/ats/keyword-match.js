import { detectSkills } from "../skills/skill-detector.service.js";

export function matchKeywords(cvSkills, jobDescription) {
  const required = detectSkills(jobDescription).map((skill) => skill.name);
  if (required.length === 0) {
    return { score: null, matched: [], missing: [] };
  }
  const cvSkillNames = new Set(cvSkills.map((skill) => skill.name));
  const matched = required.filter((name) => cvSkillNames.has(name));
  const missing = required.filter((name) => !cvSkillNames.has(name));
  return {
    score: Math.round((matched.length / required.length) * 100),
    matched,
    missing,
  };
}
