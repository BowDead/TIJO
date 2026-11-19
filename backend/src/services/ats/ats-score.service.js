import { InputTooLargeError, InvalidInputError } from "../../errors/domain-errors.js";
import { countWords } from "../../utils/text.js";
import { anonymize } from "../anonymizer/anonymizer.service.js";
import { assertValidCvText } from "../cv-text.validator.js";
import { detectSkills } from "../skills/skill-detector.service.js";
import { ATS_CRITERIA } from "./criteria/index.js";
import { matchKeywords } from "./keyword-match.js";
import { detectSections } from "./section-detector.js";

const MAX_JOB_DESCRIPTION_CHARS = 20_000;
const GENERAL_WEIGHT = 0.7;
const MATCH_WEIGHT = 0.3;

const RATING_THRESHOLDS = [
  { min: 80, rating: "excellent" },
  { min: 60, rating: "good" },
  { min: 40, rating: "fair" },
];

export function ratingFor(score) {
  return RATING_THRESHOLDS.find(({ min }) => score >= min)?.rating ?? "poor";
}

function assertValidJobDescription(jobDescription) {
  if (jobDescription != null && typeof jobDescription !== "string") {
    throw new InvalidInputError("INVALID_INPUT");
  }
  if (jobDescription && jobDescription.length > MAX_JOB_DESCRIPTION_CHARS) {
    throw new InputTooLargeError("JOB_DESCRIPTION_TOO_LONG", {
      max: MAX_JOB_DESCRIPTION_CHARS,
    });
  }
}

// Dane wspólne dla wszystkich kryteriów, liczone tylko raz
export function buildScoringContext(text) {
  const segments = anonymize(text);
  return {
    text,
    segments,
    anonymizedText: segments
      .map((segment) => segment.label ?? segment.text)
      .join(""),
    words: countWords(text),
    skills: detectSkills(text),
    sections: detectSections(text),
  };
}

export function evaluateCriteria(context, criteria = ATS_CRITERIA) {
  return criteria.map((criterion) => ({
    id: criterion.id,
    maxScore: criterion.maxScore,
    ...criterion.evaluate(context),
  }));
}

export function combineScores(generalScore, keywordMatchScore) {
  if (keywordMatchScore == null) return generalScore;
  return Math.round(
    generalScore * GENERAL_WEIGHT + keywordMatchScore * MATCH_WEIGHT,
  );
}

export function scoreCv(text, jobDescription) {
  assertValidCvText(text);
  assertValidJobDescription(jobDescription);

  const context = buildScoringContext(text);
  const criteria = evaluateCriteria(context);
  const generalScore = criteria.reduce((sum, criterion) => sum + criterion.score, 0);
  const keywordMatch = jobDescription?.trim()
    ? matchKeywords(context.skills, jobDescription)
    : null;
  const score = combineScores(generalScore, keywordMatch?.score);

  return {
    score,
    generalScore,
    rating: ratingFor(score),
    criteria,
    skills: context.skills,
    keywordMatch,
  };
}
