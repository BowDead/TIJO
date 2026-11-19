const CONTACT_CHECKS = [
  { id: "email", points: 6, types: ["email"], tip: "ADD_EMAIL" },
  { id: "phone", points: 6, types: ["phone"], tip: "ADD_PHONE" },
  {
    id: "profileLink",
    points: 3,
    types: ["linkedinLink", "githubLink"],
    tip: "ADD_PROFILE_LINK",
  },
];

export const contactCriterion = {
  id: "contact",
  maxScore: 15,
  evaluate({ segments }) {
    const foundTypes = new Set(segments.map((segment) => segment.type));
    const found = CONTACT_CHECKS.filter((check) =>
      check.types.some((type) => foundTypes.has(type)),
    );
    const missing = CONTACT_CHECKS.filter((check) => !found.includes(check));

    return {
      score: found.reduce((sum, check) => sum + check.points, 0),
      details: {
        found: found.map((check) => check.id),
        missing: missing.map((check) => check.id),
      },
      tips: missing.map((check) => check.tip),
    };
  },
};
