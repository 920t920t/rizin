import type { Fighter } from './types';

export function getFighterPaths(fighters: Fighter[]) {
  return fighters.map((f) => ({ params: { id: f.id }, props: { fighter: f } }));
}

export function normalizeMatchupKey(a: string, b: string) {
  return [a, b].sort().join('_');
}

