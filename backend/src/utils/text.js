export function nonEmptyLines(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

// Małe litery bez polskich znaków: "Doświadczenie" i "DOSWIADCZENIE" dają to samo
export function normalizeForMatching(text) {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[łŁ]/g, "l")
    .toLowerCase();
}
