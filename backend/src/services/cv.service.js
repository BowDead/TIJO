import {
  InvalidInputError,
  NoTextContentError,
} from "../errors/domain-errors.js";
import { countWords } from "../utils/text.js";
import { detectCvKind } from "../utils/file-type.js";
import { extractPdfText } from "./parsers/pdf.parser.js";
import { extractDocxText } from "./parsers/docx.parser.js";

// Strategia parsowania wybierana na podstawie rodzaju pliku
const PARSERS_BY_KIND = {
  pdf: extractPdfText,
  docx: extractDocxText,
};

export function normalizeText(text) {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function parseCv(file) {
  if (!file) {
    throw new InvalidInputError("FILE_MISSING");
  }
  if (file.size === 0) {
    throw new InvalidInputError("FILE_EMPTY");
  }
  const kind = detectCvKind(file.originalname, file.buffer);

  let parsed;
  try {
    parsed = await PARSERS_BY_KIND[kind](file.buffer);
  } catch (err) {
    console.error("CV parsing failed:", err);
    throw new InvalidInputError("FILE_UNREADABLE");
  }

  const text = normalizeText(parsed.text);
  if (!text) {
    throw new NoTextContentError("FILE_NO_TEXT");
  }
  return {
    kind,
    text,
    pageCount: parsed.pageCount,
    stats: {
      characters: text.length,
      words: countWords(text),
    },
  };
}
