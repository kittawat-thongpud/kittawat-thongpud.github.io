export function onReady(fn: () => void) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  } else {
    fn();
  }
}

export async function loadText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'Content-Type': 'text/html' } });
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  return res.text();
}

export async function loadJSON<T = unknown>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  return res.json() as Promise<T>;
}

export function htmlToFragment(html: string): DocumentFragment {
  const tpl = document.createElement('template');
  tpl.innerHTML = html.trim();
  return tpl.content;
}

export type HChild = Node | string | null | undefined;
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Record<string, any> = {},
  children: HChild | HChild[] = []
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  Object.entries(props || {}).forEach(([k, v]) => {
    if (k === 'class') (el as HTMLElement).className = v;
    else if (k === 'style' && v && typeof v === 'object') {
      Object.entries(v).forEach(([sk, sv]) => (el as HTMLElement).style.setProperty(sk, String(sv)));
    } else if (k in el) (el as any)[k] = v; else (el as HTMLElement).setAttribute(k, String(v));
  });
  const list = Array.isArray(children) ? children : [children];
  list.forEach((c) => {
    if (c == null) return;
    (el as HTMLElement).append(c instanceof Node ? c : document.createTextNode(String(c)));
  });
  return el as any;
}