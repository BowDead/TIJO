import { nonEmptyLines, normalizeForMatching } from "../../utils/text.js";
import { SECTIONS } from "./ats-rules.js";

const MAX_HEADING_LENGTH = 40;
const MAX_HEADING_WORDS = 4;

const NORMALIZED_SECTIONS = SECTIONS.map((section) => ({
  id: section.id,
  keywords: section.keywords.map(normalizeForMatching),
}));

function normalizeHeading(line) {
  return normalizeForMatching(line)
    .replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "")
    .replace(/\s+/g, " ");
}

function looksLikeHeading(heading) {
  return Boolean(heading) && heading.split(" ").length <= MAX_HEADING_WORDS;
}

export function detectSections(text) {
  const found = new Set();
  for (const line of nonEmptyLines(text)) {
    if (line.length > MAX_HEADING_LENGTH) continue;
    const heading = normalizeHeading(line);
    if (!looksLikeHeading(heading)) continue;

    for (const section of NORMALIZED_SECTIONS) {
      if (section.keywords.some((keyword) => heading.startsWith(keyword))) {
        found.add(section.id);
      }
    }
  }
  return found;
}
