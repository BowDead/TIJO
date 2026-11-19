// Zamiana tekstu CV (wyciągniętego z PDF/DOCX) na Markdown.
// Każda linia dostaje rodzaj: title (# imię), heading (## sekcja),
// item (- punktor), text albo blank. Pozycje start/contentStart/end
// odnoszą się do oryginalnego tekstu, więc można je łączyć z segmentami
// anonimizacji.

const SECTION_KEYWORDS = [
  "profil",
  "podsumowanie",
  "o mnie",
  "cel zawodowy",
  "summary",
  "profile",
  "about me",
  "objective",
  "doświadczenie",
  "doświadczenie zawodowe",
  "historia zatrudnienia",
  "przebieg pracy",
  "experience",
  "work experience",
  "employment",
  "wykształcenie",
  "edukacja",
  "education",
  "umiejętności",
  "kompetencje",
  "technologie",
  "skills",
  "technical skills",
  "tech stack",
  "języki",
  "znajomość języków",
  "languages",
  "projekty",
  "projects",
  "certyfikaty",
  "kursy",
  "szkolenia",
  "certifications",
  "certificates",
  "courses",
  "zainteresowania",
  "hobby",
  "interests",
  "kontakt",
  "contact",
  "osiągnięcia",
  "achievements",
];

const BULLET_RE = /^[ \t]*(?:[•●▪◦■►‣·*–—-]|\d{1,2}[.)])[ \t]+/;
const MAX_TITLE_LENGTH = 60;
const MAX_HEADING_LENGTH = 40;

function isSectionHeading(line) {
  const plain = line.trim().replace(/:$/, "").trim();
  if (!plain || plain.length > MAX_HEADING_LENGTH) return false;

  const lower = plain.toLowerCase();
  if (SECTION_KEYWORDS.includes(lower)) return true;

  // Krótka linia pisana WIELKIMI LITERAMI, np. "DOŚWIADCZENIE ZAWODOWE"
  const letters = plain.replace(/[^\p{L}]/gu, "");
  return (
    letters.length >= 3 &&
    plain === plain.toUpperCase() &&
    plain !== plain.toLowerCase() &&
    plain.split(/\s+/).length <= 4 &&
    !/[\d,;|/]/.test(plain) &&
    !/^\[.*\]$/.test(plain)
  );
}

function isTitle(line) {
  const plain = line.trim();
  return (
    plain.length > 0 &&
    plain.length <= MAX_TITLE_LENGTH &&
    !/[@\d]/.test(plain) &&
    !BULLET_RE.test(line)
  );
}

export function classifyLines(text) {
  const lines = [];
  let start = 0;
  let titleFound = false;

  for (const raw of text.split("\n")) {
    const end = start + raw.length;
    const line = { start, end, contentStart: start, kind: "text" };

    if (!raw.trim()) {
      line.kind = "blank";
    } else if (!titleFound && isTitle(raw)) {
      line.kind = "title";
      line.contentStart = start + raw.search(/\S/);
    } else if (isSectionHeading(raw)) {
      line.kind = "heading";
      line.contentStart = start + raw.search(/\S/);
    } else if (BULLET_RE.test(raw)) {
      line.kind = "item";
      line.contentStart = start + raw.match(BULLET_RE)[0].length;
    } else {
      line.contentStart = start + raw.search(/\S/);
    }

    if (line.kind !== "blank") titleFound = true;
    lines.push(line);
    start = end + 1; // +1 za znak nowej linii
  }

  return lines;
}

function lineContent(text, line) {
  const content = text.slice(line.contentStart, line.end).trim();
  return line.kind === "heading" ? content.replace(/\s*:$/, "") : content;
}

// Bloki do wyświetlenia: kolejne punktory łączone w listę,
// kolejne linie tekstu w akapit.
export function toBlocks(text) {
  const blocks = [];

  for (const line of classifyLines(text)) {
    const content = lineContent(text, line);
    const last = blocks.at(-1);

    if (line.kind === "blank") {
      if (last) last.closed = true;
      continue;
    }
    if (line.kind === "item") {
      if (last?.kind === "list" && !last.closed) {
        last.lines.push(content);
      } else {
        blocks.push({ kind: "list", lines: [content] });
      }
      continue;
    }
    if (line.kind === "text") {
      if (last?.kind === "paragraph" && !last.closed) {
        last.lines.push(content);
      } else {
        blocks.push({ kind: "paragraph", lines: [content] });
      }
      continue;
    }
    blocks.push({ kind: line.kind, lines: [content] });
  }

  return blocks.map(({ kind, lines }) => ({ kind, lines }));
}

export function toMarkdown(text) {
  return toBlocks(text)
    .map(({ kind, lines }) => {
      if (kind === "title") return `# ${lines[0]}`;
      if (kind === "heading") return `## ${lines[0]}`;
      if (kind === "list") return lines.map((line) => `- ${line}`).join("\n");
      // Twarde łamanie linii (dwie spacje) zachowuje układ akapitu
      return lines.join("  \n");
    })
    .join("\n\n")
    .concat("\n");
}
