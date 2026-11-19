import { SKILL_DICTIONARY } from "../../data/skill-dictionary.js";
import { escapeRegExp } from "../../utils/regexp.js";

// Nazwa umiejętności nie może być częścią dłuższego słowa ("Java" w "JavaScript")
const NOT_PRECEDED_BY_WORD_CHAR = "(?<![\\p{L}\\p{N}_])";
const NOT_FOLLOWED_BY_WORD_CHAR = "(?![\\p{L}\\p{N}_+#])";

const SKILL_MATCHERS = SKILL_DICTIONARY.map((skill) => {
  const names = [skill.name, ...skill.aliases].map(escapeRegExp).join("|");
  return {
    skill,
    pattern: new RegExp(
      `${NOT_PRECEDED_BY_WORD_CHAR}(?:${names})${NOT_FOLLOWED_BY_WORD_CHAR}`,
      skill.caseSensitive ? "u" : "iu",
    ),
  };
});

export function detectSkills(text) {
  return SKILL_MATCHERS
    .filter(({ pattern }) => pattern.test(text))
    .map(({ skill }) => skill);
}
