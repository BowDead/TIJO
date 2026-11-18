import { classifyLines } from "./cvMarkdown";

// Dzieli segmenty anonimizacji (z polem start) na linie z rodzajem Markdown.
// Zwykłe segmenty są przycinane do treści linii (bez znaku punktora),
// a ukryte fragmenty trafiają w całości do linii, w której się zaczynają.
export function anonymizedLines(segments) {
  const text = segments.map((segment) => segment.text).join("");

  return classifyLines(text).map((line) => {
    const pieces = [];

    segments.forEach((segment, index) => {
      if (segment.label) {
        if (segment.start >= line.start && segment.start <= line.end) {
          pieces.push({ ...segment, index });
        }
        return;
      }

      const segmentEnd = segment.start + segment.text.length;
      const from = Math.max(segment.start, line.contentStart);
      const to = Math.min(segmentEnd, line.end);
      if (from < to) {
        pieces.push({
          text: segment.text.slice(from - segment.start, to - segment.start),
          start: from,
          index,
        });
      }
    });

    return { kind: line.kind, start: line.start, pieces };
  });
}
