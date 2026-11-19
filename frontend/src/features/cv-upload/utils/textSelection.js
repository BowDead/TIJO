// Pozycja w tekście CV na podstawie atrybutu data-start najbliższego fragmentu
function textPosition(container, node, offset) {
  const element = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
  const fragment = element?.closest("[data-start]");
  if (!fragment || !container.contains(fragment)) return null;
  return Number(fragment.dataset.start) + offset;
}

// Zwraca { start, end } zaznaczenia w obrębie kontenera albo null
export function readTextSelection(container, selection = window.getSelection()) {
  if (!container || !selection || selection.isCollapsed || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const start = textPosition(container, range.startContainer, range.startOffset);
  const end = textPosition(container, range.endContainer, range.endOffset);
  return start !== null && end !== null && start < end ? { start, end } : null;
}
