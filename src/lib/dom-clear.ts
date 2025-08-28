export function clearChildren(el: Element | null | undefined) {
  if (!el) return;
  while (el.firstChild) el.removeChild(el.firstChild);
}