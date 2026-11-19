import path from "node:path";
import {
  InvalidInputError,
  UnsupportedFileTypeError,
} from "../errors/domain-errors.js";

// Sygnatury plików PDF oraz DOCX
const PDF_SIGNATURE = "%PDF";
const ZIP_SIGNATURES = [
  Buffer.from([0x50, 0x4b, 0x03, 0x04]),
  Buffer.from([0x50, 0x4b, 0x05, 0x06]),
  Buffer.from([0x50, 0x4b, 0x07, 0x08]),
];

export function detectCvKind(fileName, buffer) {
  const extension = path.extname(fileName).toLowerCase();
  if (extension === ".pdf") {
    if (!buffer.subarray(0, 1024).includes(PDF_SIGNATURE)) {
      throw new InvalidInputError("FILE_NOT_PDF");
    }
    return "pdf";
  }

  if (extension === ".docx") {
    const head = buffer.subarray(0, 4);
    if (!ZIP_SIGNATURES.some((signature) => head.equals(signature))) {
      throw new InvalidInputError("FILE_NOT_DOCX");
    }
    return "docx";
  }
  throw new UnsupportedFileTypeError("FILE_UNSUPPORTED");
}
