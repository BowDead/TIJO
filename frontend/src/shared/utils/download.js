export function downloadFile(content, fileName, type = "text/plain") {
  const url = URL.createObjectURL(
    new Blob([content], { type: `${type};charset=utf-8` }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function markdownFileName(fileName, suffix = "") {
  const base = (fileName ?? "cv").replace(/\.[^.]+$/, "");
  return `${base}${suffix}.md`;
}
