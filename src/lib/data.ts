import fs from 'node:fs/promises';
import path from 'node:path';
import type { Bout, Fighter, VoteCounts } from './types';
import { normalizeMatchupKey } from './paths';

const root = path.resolve(process.cwd());

async function readJson<T>(relPath: string): Promise<T> {
  const p = path.join(root, relPath);
  const txt = await fs.readFile(p, 'utf-8');
  return JSON.parse(txt) as T;
}

export async function loadFighters(): Promise<Fighter[]> {
  return readJson<Fighter[]>('data/fighters.json');
}

export async function loadBouts(): Promise<Bout[]> {
  return readJson<Bout[]>('data/featured_bouts.json');
}

export async function loadVotes(): Promise<VoteCounts> {
  try {
    const raw = await readJson<Record<string, number>>('data/votes.json');
    const out: VoteCounts = {};
    let invalidKeys = 0;
    let nonNumberValues = 0;
    let mergedKeys = 0;
    for (const [k, v] of Object.entries(raw || {})) {
      const idx = k.lastIndexOf('_');
      if (idx <= 0 || idx === k.length - 1) { invalidKeys++; continue; }
      const left = k.slice(0, idx);
      const right = k.slice(idx + 1);
      const nk = normalizeMatchupKey(left, right);
      if (nk !== k) mergedKeys++;
      const n = typeof v === 'number' && Number.isFinite(v) ? v : 0;
      if (!(typeof v === 'number' && Number.isFinite(v))) nonNumberValues++;
      out[nk] = (out[nk] ?? 0) + n;
    }
    if (invalidKeys || nonNumberValues || mergedKeys) {
      console.warn(`[votes.json] normalized: merged=${mergedKeys}, invalidKeys=${invalidKeys}, nonNumber=${nonNumberValues}`);
    }
    return out;
  } catch {
    return {};
  }
}