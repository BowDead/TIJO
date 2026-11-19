export const FULL_NAME_LINE_RE =
  /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:[ -][A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+){1,2}$/;

export const FULL_NAME_LABEL = "[IMIĘ I NAZWISKO]";

// Kolejność ma znaczenie: fragment dopasowany przez wcześniejszą regułę
// nie jest już brany pod uwagę przez kolejne.
export const ANONYMIZATION_RULES = [
  {
    type: "email",
    pattern: /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g,
    label: "[EMAIL]",
  },
  { type: "pesel", pattern: /(?<!\d)\d{11}(?!\d)/g, label: "[PESEL]" },
  {
    type: "phone",
    pattern: /(?<![\w+])(?:\+|00)?(?:48[\s-]?)?(?:\d[\s-]?){8}\d(?!\d)/g,
    label: "[TELEFON]",
  },
  {
    type: "githubLink",
    pattern: /(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s,;)]+/gi,
    label: "[LINK GITHUB]",
  },
  {
    type: "linkedinLink",
    pattern: /(?:https?:\/\/)?(?:[\w-]+\.)?linkedin\.com\/[^\s,;)]+/gi,
    label: "[LINK LINKEDIN]",
  },
  {
    type: "link",
    pattern:
      /(?<![\w.-])(?:https?:\/\/)?(?:www\.)?(?:facebook|instagram|twitter|x)\.com\/[^\s,;)]+/gi,
    label: "[LINK]",
  },
  {
    type: "link",
    pattern: /(?:https?:\/\/|www\.)[^\s,;)]+/gi,
    label: "[LINK]",
  },
  {
    type: "address",
    pattern:
      /\b(?:ul\.|ulica|al\.|aleja|os\.)\s+[^\n,]{2,40}?\s\d+[a-zA-Z]?(?:\/\d+)?/gi,
    label: "[ADRES]",
  },
  {
    type: "address",
    pattern:
      /(?<=^|[\n,;:|][ \t]*)[^\s,;:|][^\n,;:|]{0,40}?\s\d+[a-zA-Z]?(?:\/\d+)?[\s,]+\d{2}-\d{3}[ \t]+\p{Lu}[\p{L}-]*(?:[ \t]\p{Lu}[\p{L}-]*)?/gmu,
    label: "[ADRES]",
  },
  {
    type: "postalCode",
    pattern: /(?<!\d)\d{2}-\d{3}(?!\d)/g,
    label: "[KOD POCZTOWY]",
  },
  {
    type: "birthDate",
    pattern:
      /(?<=(?:data urodzenia|date of birth|ur\.)\s*:?\s*)[\d./-]{6,10}/gi,
    label: "[DATA]",
  },
];
