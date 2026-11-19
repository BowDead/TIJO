const EMPTY_LIST = "—";

const LEVEL_THRESHOLDS = [
  { min: 75, level: "high" },
  { min: 45, level: "medium" },
];

export function scorePercent(score, maxScore) {
  return Math.round((score / maxScore) * 100);
}

export function scoreLevel(percent) {
  return LEVEL_THRESHOLDS.find(({ min }) => percent >= min)?.level ?? "low";
}

function translatedItems(items, t) {
  return items.map((item) => t(`ats.items.${item}`)).join(", ") || EMPTY_LIST;
}

// Opis szczegółów kryterium w jednym zdaniu, np. "Znaleziono: e-mail. Brakuje: telefon."
export function criterionDetails(criterion, t) {
  const { id, details } = criterion;
  if (id === "contact" || id === "sections") {
    return t("ats.details.found", {
      found: translatedItems(details.found, t),
      missing: translatedItems(details.missing, t),
    });
  }
  if (id === "actionVerbs") {
    return t("ats.details.actionVerbs", {
      count: details.count,
      examples: details.examples.join(", ") || EMPTY_LIST,
    });
  }
  return t(`ats.details.${id}`, details);
}
