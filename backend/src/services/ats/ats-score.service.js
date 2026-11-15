import { HttpError } from "../../errors/HttpError.js";
import { anonymize } from "../anonymizer.service.js";
import { detectSkills } from "../skills/skill-detector.service.js";
import {
  ACTION_VERBS,
  BULLET_RE,
  DATE_RANGE_RE,
  DATE_RE,
  SECTIONS,
} from "./ats-rules.js";

const MAX_CV_CHARS = 50_000;
const MAX_JOB_DESCRIPTION_CHARS = 20_000;
const GENERAL_WEIGHT = 0.7;
const MATCH_WEIGHT = 0.3;

function clamp(value, max) {
  return Math.max(0, Math.min(max, Math.round(value)));
}

function lines(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

// Małe litery bez polskich znaków: "Doświadczenie" i "DOSWIADCZENIE" dają to samo
export function fold(text) {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[łŁ]/g, "l")
    .toLowerCase();
}

const FOLDED_SECTIONS = SECTIONS.map((section) => ({
  id: section.id,
  keywords: section.keywords.map(fold),
}));

function normalizeHeading(line) {
  return fold(line)
    .replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "")
    .replace(/\s+/g, " ");
}

export function detectSections(text) {
  const found = new Set();
  for (const line of lines(text)) {
    if (line.length > 40) continue;
    const heading = normalizeHeading(line);
    if (!heading || heading.split(" ").length > 4) continue;

    for (const section of FOLDED_SECTIONS) {
      if (section.keywords.some((keyword) => heading.startsWith(keyword))) {
        found.add(section.id);
      }
    }
  }
  return found;
}

function scoreContact(segments) {
  const types = new Set(segments.map((segment) => segment.type));
  const checks = [
    { id: "email", points: 6, present: types.has("email") },
    { id: "phone", points: 6, present: types.has("phone") },
    {
      id: "profileLink",
      points: 3,
      present: types.has("linkedinLink") || types.has("githubLink"),
    },
  ];

  const tips = [];
  if (!types.has("email")) tips.push("ADD_EMAIL");
  if (!types.has("phone")) tips.push("ADD_PHONE");
  if (!checks[2].present) tips.push("ADD_PROFILE_LINK");

  return {
    id: "contact",
    maxScore: 15,
    score: checks.reduce((sum, c) => sum + (c.present ? c.points : 0), 0),
    details: {
      found: checks.filter((c) => c.present).map((c) => c.id),
      missing: checks.filter((c) => !c.present).map((c) => c.id),
    },
    tips,
  };
}

function scoreSections(sections) {
  let score = 0;
  const tips = [];

  if (sections.has("experience")) score += 8;
  else if (sections.has("projects")) score += 4;
  if (!sections.has("experience")) tips.push("ADD_EXPERIENCE_SECTION");

  for (const [id, points, tip] of [
    ["education", 6, "ADD_EDUCATION_SECTION"],
    ["skills", 6, "ADD_SKILLS_SECTION"],
    ["summary", 3, "ADD_SUMMARY_SECTION"],
    ["languages", 2, "ADD_LANGUAGES_SECTION"],
  ]) {
    if (sections.has(id)) score += points;
    else tips.push(tip);
  }

  const all = SECTIONS.map((section) => section.id);
  return {
    id: "sections",
    maxScore: 25,
    score,
    details: {
      found: all.filter((id) => sections.has(id)),
      missing: all.filter((id) => !sections.has(id)),
    },
    tips,
  };
}

function scoreLength(words) {
  let score = 0;
  if (words >= 350 && words <= 900) score = 10;
  else if ((words >= 200 && words < 350) || (words > 900 && words <= 1300))
    score = 6;
  else if ((words >= 100 && words < 200) || words > 1300) score = 3;

  const tips = [];
  if (words < 350) tips.push("CV_TOO_SHORT");
  if (words > 900) tips.push("CV_TOO_LONG");

  return { id: "length", maxScore: 10, score, details: { words }, tips };
}

function scoreSkills(skills) {
  const count = skills.length;
  return {
    id: "skills",
    maxScore: 20,
    score: clamp(count * 2.5, 20),
    details: { count },
    tips: count < 8 ? ["ADD_MORE_SKILLS"] : [],
  };
}

// Liczby, które nie są datami ani danymi kontaktowymi (te są już zastąpione etykietami)
function countQuantifiedLines(anonymizedText) {
  return lines(anonymizedText).filter((line) => {
    const withoutDates = line.replace(DATE_RANGE_RE, "").replace(DATE_RE, "");
    // "B2" czy "ES6" to nie liczby — liczymy tylko samodzielne liczby
    return /(?<![\p{L}\d])\d/u.test(withoutDates);
  }).length;
}

function scoreAchievements(anonymizedText) {
  const count = countQuantifiedLines(anonymizedText);
  return {
    id: "achievements",
    maxScore: 10,
    score: clamp((count * 10) / 3, 10),
    details: { count },
    tips: count < 3 ? ["ADD_NUMBERS"] : [],
  };
}

export function findActionVerbs(text) {
  const folded = fold(text);
  const found = new Set();
  for (const verb of ACTION_VERBS) {
    const pattern = new RegExp(`(?<!\\p{L})${verb.stem}\\p{L}*`, "iu");
    if (pattern.test(folded)) found.add(verb.label);
  }
  return [...found];
}

function scoreActionVerbs(text) {
  const verbs = findActionVerbs(text);
  return {
    id: "actionVerbs",
    maxScore: 10,
    score: clamp(verbs.length * 2, 10),
    details: { count: verbs.length, examples: verbs.slice(0, 8) },
    tips: verbs.length < 5 ? ["USE_ACTION_VERBS"] : [],
  };
}

function scoreStructure(text) {
  const all = lines(text);
  const bullets = all.filter((line) => BULLET_RE.test(line)).length;
  const dateRanges = [...text.matchAll(DATE_RANGE_RE)].length;
  const longLines = all.filter((line) => line.length > 250).length;

  let score = 0;
  score += bullets >= 3 ? 4 : bullets > 0 ? 2 : 0;
  score += dateRanges >= 2 ? 3 : dateRanges === 1 ? 1 : 0;
  score += longLines === 0 ? 3 : longLines <= 2 ? 1 : 0;

  const tips = [];
  if (bullets < 3) tips.push("USE_BULLETS");
  if (dateRanges < 2) tips.push("ADD_DATES");
  if (longLines > 0) tips.push("SPLIT_LONG_PARAGRAPHS");

  return {
    id: "structure",
    maxScore: 10,
    score,
    details: { bullets, dateRanges, longLines },
    tips,
  };
}

export function matchKeywords(cvSkills, jobDescription) {
  const required = detectSkills(jobDescription).map((skill) => skill.name);
  if (required.length === 0) {
    return { score: null, matched: [], missing: [] };
  }
  const cvNames = new Set(cvSkills.map((skill) => skill.name));
  const matched = required.filter((name) => cvNames.has(name));
  const missing = required.filter((name) => !cvNames.has(name));
  return {
    score: Math.round((matched.length / required.length) * 100),
    matched,
    missing,
  };
}

export function ratingFor(score) {
  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  if (score >= 40) return "fair";
  return "poor";
}

function validate(text, jobDescription) {
  if (typeof text !== "string" || !text.trim()) {
    throw new HttpError(400, "CV_TEXT_MISSING");
  }
  if (text.length > MAX_CV_CHARS) {
    throw new HttpError(413, "CV_TEXT_TOO_LONG");
  }
  if (jobDescription != null && typeof jobDescription !== "string") {
    throw new HttpError(400, "INVALID_INPUT");
  }
  if (jobDescription && jobDescription.length > MAX_JOB_DESCRIPTION_CHARS) {
    throw new HttpError(413, "JOB_DESCRIPTION_TOO_LONG", {
      max: MAX_JOB_DESCRIPTION_CHARS,
    });
  }
}

export function scoreCv(text, jobDescription) {
  validate(text, jobDescription);

  const segments = anonymize(text);
  const anonymizedText = segments
    .map((segment) => segment.label ?? segment.text)
    .join("");
  const words = text.split(/\s+/).filter(Boolean).length;
  const skills = detectSkills(text);

  const criteria = [
    scoreContact(segments),
    scoreSections(detectSections(text)),
    scoreLength(words),
    scoreSkills(skills),
    scoreAchievements(anonymizedText),
    scoreActionVerbs(text),
    scoreStructure(text),
  ];

  const generalScore = criteria.reduce((sum, c) => sum + c.score, 0);
  const keywordMatch = jobDescription?.trim()
    ? matchKeywords(skills, jobDescription)
    : null;

  const score =
    keywordMatch?.score != null
      ? Math.round(
          generalScore * GENERAL_WEIGHT + keywordMatch.score * MATCH_WEIGHT,
        )
      : generalScore;

  return {
    score,
    generalScore,
    rating: ratingFor(score),
    criteria,
    skills,
    keywordMatch,
  };
}
