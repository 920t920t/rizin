export function safeText(s: string | null | undefined, fallback = "不明"): string {
  if (s === undefined || s === null || String(s).trim() === "") return fallback;
  return String(s);
}

