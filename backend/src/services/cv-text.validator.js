import { InputTooLargeError, InvalidInputError } from "../errors/domain-errors.js";

export const MAX_CV_TEXT_CHARS = 50_000;

export function assertValidCvText(text) {
  if (typeof text !== "string" || !text.trim()) {
    throw new InvalidInputError("CV_TEXT_MISSING");
  }
  if (text.length > MAX_CV_TEXT_CHARS) {
    throw new InputTooLargeError("CV_TEXT_TOO_LONG");
  }
}
