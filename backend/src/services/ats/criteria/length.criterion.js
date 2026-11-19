const IDEAL_MIN_WORDS = 350;
const IDEAL_MAX_WORDS = 900;

// Pierwszy pasujący przedział wyznacza liczbę punktów
const LENGTH_BANDS = [
  { min: IDEAL_MIN_WORDS, max: IDEAL_MAX_WORDS, points: 10 },
  { min: 200, max: 1300, points: 6 },
  { min: 100, max: Infinity, points: 3 },
];

export const lengthCriterion = {
  id: "length",
  maxScore: 10,
  evaluate({ words }) {
    const band = LENGTH_BANDS.find(({ min, max }) => words >= min && words <= max);

    const tips = [];
    if (words < IDEAL_MIN_WORDS) tips.push("CV_TOO_SHORT");
    if (words > IDEAL_MAX_WORDS) tips.push("CV_TOO_LONG");

    return { score: band?.points ?? 0, details: { words }, tips };
  },
};
