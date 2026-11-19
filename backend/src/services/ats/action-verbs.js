import { normalizeForMatching } from "../../utils/text.js";
import { ACTION_VERBS } from "./ats-rules.js";

const VERB_MATCHERS = ACTION_VERBS.map((verb) => ({
  label: verb.label,
  pattern: new RegExp(`(?<!\\p{L})${verb.stem}\\p{L}*`, "iu"),
}));

export function findActionVerbs(text) {
  const normalized = normalizeForMatching(text);
  const found = new Set();
  for (const { label, pattern } of VERB_MATCHERS) {
    if (pattern.test(normalized)) found.add(label);
  }
  return [...found];
}
