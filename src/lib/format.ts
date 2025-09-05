export function safeText(s: string | null | undefined, fallback = "不明"): string {
  if (s === undefined || s === null || String(s).trim() === "") return fallback;
  return String(s);
}

export function winRate(wins?: number | null, losses?: number | null, draws?: number | null): string {
  const w = Number(wins ?? 0);
  const l = Number(losses ?? 0);
  const d = Number(draws ?? 0);
  const den = w + l; // 勝率は(勝/勝敗)
  if (!den) return "-";
  const rate = (w / den) * 100;
  return `${rate.toFixed(1)}%`;
}

export function primaryNationality(nats?: string[] | null): string | null {
  if (!nats || !Array.isArray(nats) || nats.length === 0) return null;
  return nats[0] ?? null;
}
