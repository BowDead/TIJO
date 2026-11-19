import { escapeRegExp } from "../../utils/regexp.js";
import { nonEmptyLines } from "../../utils/text.js";
import { assertValidCvText } from "../cv-text.validator.js";
import {
  ANONYMIZATION_RULES,
  FULL_NAME_LABEL,
  FULL_NAME_LINE_RE,
} from "./anonymizer-rules.js";

const NAME_SEARCH_LINES = 3;
const MAX_NAME_LENGTH = 50;

// Imię i nazwisko zwykle stoi w jednej z pierwszych linii CV
export function guessFullName(text) {
  return (
    nonEmptyLines(text)
      .slice(0, NAME_SEARCH_LINES)
      .find(
        (line) => line.length <= MAX_NAME_LENGTH && FULL_NAME_LINE_RE.test(line),
      ) ?? null
  );
}

function fullNameRule(text) {
  const fullName = guessFullName(text);
  if (!fullName) return [];
  return [
    {
      type: "fullName",
      pattern: new RegExp(escapeRegExp(fullName), "g"),
      label: FULL_NAME_LABEL,
    },
  ];
}

function findMatches(text) {
  const matches = [];
  const overlapsExisting = (start, end) =>
    matches.some((match) => start < match.end && end > match.start);

  for (const { type, pattern, label } of [
    ...fullNameRule(text),
    ...ANONYMIZATION_RULES,
  ]) {
    for (const found of text.matchAll(pattern)) {
      const start = found.index;
      const end = start + found[0].length;
      if (end > start && !overlapsExisting(start, end)) {
        matches.push({ start, end, type, label });
      }
    }
  }

  return matches.sort((a, b) => a.start - b.start);
}

export function anonymize(text) {
  const segments = [];
  let position = 0;

  for (const { start, end, type, label } of findMatches(text)) {
    if (start > position) {
      segments.push({ text: text.slice(position, start) });
    }
    segments.push({ text: text.slice(start, end), type, label });
    position = end;
  }
  if (position < text.length) {
    segments.push({ text: text.slice(position) });
  }

  return segments;
}

export function anonymizeCv(text) {
  assertValidCvText(text);
  return anonymize(text);
}
