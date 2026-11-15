export function parsedCvView(parsedCv) {
  return {
    kind: parsedCv.kind,
    text: parsedCv.text,
    pageCount: parsedCv.pageCount,
    stats: {
      characters: parsedCv.stats.characters,
      words: parsedCv.stats.words,
    },
  };
}

export function anonymizedCvView(segments) {
  return {
    segments: segments.map(({ text, type, label }) =>
      label ? { text, type, label } : { text },
    ),
  };
}

export function atsScoreView(result) {
  return {
    score: result.score,
    generalScore: result.generalScore,
    rating: result.rating,
    criteria: result.criteria.map(({ id, score, maxScore, details, tips }) => ({
      id,
      score,
      maxScore,
      details,
      tips,
    })),
    skills: result.skills.map(({ name, category }) => ({ name, category })),
    keywordMatch: result.keywordMatch,
  };
}
