// Nagłówki sekcji rozpoznawane w CV (porównanie z początkiem linii, małe litery)
export const SECTIONS = [
  {
    id: "summary",
    keywords: ["profil", "podsumowanie", "o mnie", "cel zawodowy", "summary", "profile", "about me", "objective"],
  },
  {
    id: "experience",
    keywords: ["doświadczenie", "historia zatrudnienia", "przebieg pracy", "experience", "work experience", "employment"],
  },
  {
    id: "education",
    keywords: ["wykształcenie", "edukacja", "education"],
  },
  {
    id: "skills",
    keywords: ["umiejętności", "kompetencje", "technologie", "skills", "technical skills", "tech stack"],
  },
  {
    id: "languages",
    keywords: ["języki", "znajomość języków", "languages"],
  },
  {
    id: "projects",
    keywords: ["projekty", "projects"],
  },
  {
    id: "certifications",
    keywords: ["certyfikaty", "kursy", "szkolenia", "certifications", "certificates", "courses"],
  },
];

// Rdzenie czasowników (bez polskich znaków, bo tekst jest wcześniej z nich oczyszczany).
// Pasują do różnych form, np. "wdrożył", "wdrożyłam", "wdrożenie".
export const ACTION_VERBS = [
  { stem: "zaprojektowa", label: "zaprojektował" },
  { stem: "wdroz", label: "wdrożył" },
  { stem: "wdraza", label: "wdrażał" },
  { stem: "stworzy", label: "stworzył" },
  { stem: "tworz", label: "tworzył" },
  { stem: "automatyz", label: "automatyzował" },
  { stem: "rozwoj", label: "rozwój" },
  { stem: "testowa", label: "testował" },
  { stem: "opracowa", label: "opracował" },
  { stem: "zoptymalizowa", label: "zoptymalizował" },
  { stem: "zarzadza", label: "zarządzał" },
  { stem: "prowadzi", label: "prowadził" },
  { stem: "zautomatyzowa", label: "zautomatyzował" },
  { stem: "zrealizowa", label: "zrealizował" },
  { stem: "zwiekszy", label: "zwiększył" },
  { stem: "zmniejszy", label: "zmniejszył" },
  { stem: "skroci", label: "skrócił" },
  { stem: "koordynowa", label: "koordynował" },
  { stem: "zbudowa", label: "zbudował" },
  { stem: "zaimplementowa", label: "zaimplementował" },
  { stem: "implementowa", label: "implementował" },
  { stem: "rozwija", label: "rozwijał" },
  { stem: "utrzymywa", label: "utrzymywał" },
  { stem: "zmigrowa", label: "zmigrował" },
  { stem: "nadzorowa", label: "nadzorował" },
  { stem: "wprowadzi", label: "wprowadził" },
  { stem: "designed", label: "designed" },
  { stem: "developed", label: "developed" },
  { stem: "implemented", label: "implemented" },
  { stem: "built", label: "built" },
  { stem: "led", label: "led" },
  { stem: "managed", label: "managed" },
  { stem: "created", label: "created" },
  { stem: "improved", label: "improved" },
  { stem: "increased", label: "increased" },
  { stem: "reduced", label: "reduced" },
  { stem: "optimi[sz]ed", label: "optimized" },
  { stem: "automated", label: "automated" },
  { stem: "delivered", label: "delivered" },
  { stem: "launched", label: "launched" },
  { stem: "migrated", label: "migrated" },
  { stem: "maintained", label: "maintained" },
  { stem: "coordinated", label: "coordinated" },
];

export const BULLET_RE = /^[•▪●◦‣∙·✓✔➢►\-–*]\s*/u;

// Rok (1990–2099) z opcjonalnym miesiącem: 2021, 03.2021, 3/2021, 2021-03
const DATE = String.raw`(?:(?:0?[1-9]|1[0-2])[./-])?(?:19|20)\d{2}(?:[./-](?:0?[1-9]|1[0-2]))?`;

export const DATE_RE = new RegExp(`(?<!\\d)${DATE}(?!\\d)`, "g");

export const DATE_RANGE_RE = new RegExp(
  `(?<!\\d)${DATE}\\s*(?:-|–|—|do|to)\\s*(?:${DATE}|obecnie|nadal|teraz|present|now|current)(?!\\d)`,
  "giu",
);
